import canonicalize from "canonicalize";
import {
  Ethereum,
  WalletType as EthereumWalletType,
} from "@/lib/auth/Ethereum/Ethereum";
import { Solana, SolanaWalletType } from "@/lib/auth/Solana/Solana";
import { mockTransaction, NEAR_MAX_GAS } from "@/lib/constants";
import { AbstractAccountContractClass } from "@/contracts/AbstractAccountContract/AbstractAccountContract";
import { AbstractAccountContractBuilder } from "@/contracts/AbstractAccountContract/utils/auth";

type WalletConfig = {
  type: "ethereum" | "solana";
  wallet: EthereumWalletType | SolanaWalletType;
};

const getWalletInstance = (config: WalletConfig) => {
  if (config.type === "ethereum") {
    const ethereum = new Ethereum();
    Ethereum.setWallet(config.wallet as EthereumWalletType);
    return ethereum;
  } else {
    const solana = new Solana();
    Solana.setWallet(config.wallet as SolanaWalletType);
    return solana;
  }
};

export const handleWalletRegister = async ({
  contract,
  walletConfig,
  accountId,
}: {
  contract: AbstractAccountContractClass;
  walletConfig: WalletConfig;
  accountId: string;
}) => {
  const wallet = getWalletInstance(walletConfig);

  const authIdentity = await wallet.getAuthIdentity();
  if (!authIdentity) {
    throw new Error("Failed to get auth identity");
  }

  await contract.addAccount({
    args: { account_id: accountId, auth_identity: authIdentity },
  });
};

export const handleWalletAuthenticate = async ({
  contract,
  walletConfig,
  accountId,
}: {
  contract: AbstractAccountContractClass;
  walletConfig: WalletConfig;
  accountId: string;
}) => {
  const wallet = getWalletInstance(walletConfig);
  const account = await contract.getAccountById({
    account_id: accountId,
  });

  if (!account) {
    throw new Error("Failed to get account");
  }

  const transaction = mockTransaction();
  const signTransaction = AbstractAccountContractBuilder.transaction.sign({
    contractId: transaction.contract_id,
    payloads: transaction.payloads,
  });

  const canonical = canonicalize(signTransaction);

  if (!canonical) {
    throw new Error("Failed to canonicalize transaction");
  }

  const walletData = await wallet.sign(canonical);
  const authIdentity = await wallet.getAuthIdentity();

  if (!authIdentity || !walletData) {
    throw new Error("Failed to get auth identity or wallet data");
  }

  await contract.auth({
    args: {
      user_op: {
        account_id: accountId,
        auth: {
          authenticator: authIdentity,
          credentials: walletData,
        },
        transaction: signTransaction,
      },
    },
    gas: NEAR_MAX_GAS,
    amount: "10", // Fee should be dynamic
  });
};
