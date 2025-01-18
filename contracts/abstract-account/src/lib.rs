mod contract;
mod mods;
mod types;
mod utils;

use interfaces::auth::wallet::WalletType;
use near_sdk::{
    env, near, require,
    serde::{Deserialize, Serialize},
    store::IterableMap,
    AccountId, Promise,
};
use schemars::JsonSchema;
use types::{account::Account, auth_identity::AuthIdentity, transaction::UserOp};
use types::{auth_identity::AuthIdentityNames, transaction::Transaction};

const KEY_PREFIX_ACCOUNTS: &[u8] = b"q";
const KEY_PREFIX_AUTH_CONTRACTS: &[u8] = b"a";

#[near(contract_state)]
pub struct AbstractAccountContract {
    accounts: IterableMap<String, Account>, // account_id -> account (auth_identities)
    auth_contracts: IterableMap<AuthIdentityNames, AccountId>,
    signer_account: AccountId,
}

impl Default for AbstractAccountContract {
    fn default() -> Self {
        let mut auth_contracts = IterableMap::new(KEY_PREFIX_AUTH_CONTRACTS);
        auth_contracts.insert(
            AuthIdentityNames::WebAuthn,
            "felipe-webauthn-contract.testnet".parse().unwrap(),
        );
        auth_contracts.insert(
            AuthIdentityNames::EthereumWallet,
            "felipe-ethereum-contract.testnet".parse().unwrap(),
        );
        auth_contracts.insert(
            AuthIdentityNames::SolanaWallet,
            "felipe-solana-contract.testnet".parse().unwrap(),
        );
        auth_contracts.insert(
            AuthIdentityNames::OIDC,
            "felipe-oidc-contract.testnet".parse().unwrap(),
        );

        Self {
            accounts: IterableMap::new(KEY_PREFIX_ACCOUNTS),
            auth_contracts,
            signer_account: "v1.signer-prod.testnet".parse().unwrap(),
        }
    }
}

#[derive(Deserialize, Serialize, JsonSchema)]
#[serde(crate = "near_sdk::serde")]
pub struct AuthContractConfig {
    pub auth_type: AuthIdentityNames,
    pub contract_id: String,
}

#[near]
impl AbstractAccountContract {
    #[init(ignore_state)]
    pub fn new(
        auth_contracts: Option<Vec<AuthContractConfig>>,
        signer_account: Option<String>,
    ) -> Self {
        let mut contract = Self::default();

        if let Some(contracts) = auth_contracts {
            for contract_config in contracts {
                contract.auth_contracts.insert(
                    contract_config.auth_type,
                    contract_config.contract_id.parse().unwrap(),
                );
            }
        }

        if let Some(signer) = signer_account {
            contract.signer_account = signer.parse().unwrap();
        }

        contract
    }

    // TODO: it should be auth function that check the auth identity and then call the send_transaction, add_auth_identity, delete_auth_identity
    #[payable]
    pub fn auth(&mut self, user_op: UserOp) -> Promise {
        let account = self.accounts.get_mut(&user_op.account_id).unwrap();

        require!(
            account.has_auth_identity(&user_op.auth.authenticator),
            "Auth identity not found in account"
        );

        let mut selected_auth_identity =
            if let Some(selected_auth_identity) = user_op.selected_auth_identity.clone() {
                require!(
                    account.has_auth_identity(&selected_auth_identity),
                    "Selected auth identity not found in account"
                );
                selected_auth_identity
            } else {
                user_op.auth.authenticator.clone()
            };

        // TODO: check if the clone is needed
        let auth_identity = user_op.auth.authenticator.clone();
        let transaction = user_op.transaction.clone();
        let account_id = user_op.account_id.clone();

        let promise = match auth_identity {
            AuthIdentity::WebAuthn(ref webauthn) => {
                let account = self.accounts.get(&user_op.account_id).unwrap();
                let webauthn_identity = account.auth_identities.iter()
                    .find(|identity| matches!(identity, AuthIdentity::WebAuthn(current_webauthn) if current_webauthn.key_id == webauthn.key_id))
                    .and_then(|identity| {
                        if let AuthIdentity::WebAuthn(webauthn) = identity {
                            Some(webauthn)
                        } else {
                            None
                        }
                    })
                    .expect("WebAuthn identity not found");

                let compressed_public_key = webauthn_identity
                    .compressed_public_key
                    .as_ref()
                    .expect("WebAuthn public key not found");

                if let AuthIdentity::WebAuthn(ref mut webauthn) = selected_auth_identity {
                    webauthn.compressed_public_key = Some(compressed_public_key.to_string());
                }

                match self.handle_webauthn_auth(user_op, compressed_public_key.to_string()) {
                    Ok(promise) => promise,
                    Err(e) => env::panic_str(&e),
                }
            }
            AuthIdentity::Wallet(wallet) => {
                let auth_identity_name = match wallet.wallet_type {
                    WalletType::Ethereum => AuthIdentityNames::EthereumWallet,
                    WalletType::Solana => AuthIdentityNames::SolanaWallet,
                };

                match self.handle_wallet_auth(
                    user_op,
                    wallet.public_key.clone(),
                    auth_identity_name,
                ) {
                    Ok(promise) => promise,
                    Err(e) => env::panic_str(&e),
                }
            }
            AuthIdentity::OIDC(oidc) => match self.handle_oidc_auth(user_op, oidc) {
                Ok(promise) => promise,
                Err(e) => env::panic_str(&e),
            },
            AuthIdentity::Account(_) => env::panic_str("Account auth type not yet supported"),
        };

        promise.then(
            Self::ext(env::current_account_id())
                .with_attached_deposit(env::attached_deposit())
                .auth_callback(account_id, selected_auth_identity, transaction),
        )
    }

    #[private]
    #[payable]
    pub fn auth_callback(
        &mut self,
        account_id: String,
        auth_identity: AuthIdentity,
        transaction: Transaction,
        #[callback_result] auth_result: Result<bool, near_sdk::PromiseError>,
    ) -> Promise {
        match auth_result {
            Ok(true) => self.execute_transaction(account_id, auth_identity, transaction),
            Ok(false) => env::panic_str("Authentication failed"),
            Err(_) => env::panic_str("Error validating authentication"),
        }
    }
}
