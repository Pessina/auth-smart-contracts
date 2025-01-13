import { Contract, Account as NearAccount } from "near-api-js";
import { WebAuthnAuthData, WebAuthnAuthIdentity } from "../auth/WebAuthn/types";
import { EthereumAuthData, EthereumAuthIdentity } from "../auth/Ethereum/types";
import { SolanaAuthData, SolanaAuthIdentity } from "../auth/Solana/types";
import { OIDCAuthIdentity } from "../auth/OIDC/types";

export interface SignRequest {
  payload: number[];
  path: string;
  key_version: number;
}

export interface SignPayloadsRequest {
  contract_id: string;
  payloads: SignRequest[];
}
export interface OIDCData {
  token: string;
  message: string;
}

export type AuthIdentity =
  | EthereumAuthIdentity
  | SolanaAuthIdentity
  | WebAuthnAuthIdentity
  | OIDCAuthIdentity;

export interface Auth {
  auth_identity: AuthIdentity;
  auth_data: WebAuthnAuthData | EthereumAuthData | SolanaAuthData | OIDCData;
}

export interface UserOperation {
  account_id: string;
  auth: Auth;
  selected_auth_identity?: AuthIdentity;
  payloads: SignPayloadsRequest;
}

export interface Account {
  nonce: number;
  auth_identities: AuthIdentity[];
}

type AbstractContract = Contract & {
  new: () => Promise<void>;
  add_account: (args: {
    account_id: string;
    auth_identity: AuthIdentity;
  }) => Promise<void>;
  get_account_by_id: (args: { account_id: string }) => Promise<Account | null>;
  list_account_ids: () => Promise<string[]>;
  list_auth_identities: (args: {
    account_id: string;
  }) => Promise<AuthIdentity[] | null>;
  send_transaction: (args: {
    args: { user_op: UserOperation };
    gas?: string;
    amount?: string;
  }) => Promise<void>;
};

export class AbstractAccountContract {
  private contract: AbstractContract;

  constructor({
    account,
    contractId,
  }: {
    account: NearAccount;
    contractId: string;
  }) {
    this.contract = new Contract(account, contractId, {
      viewMethods: [
        "get_account_by_id",
        "list_account_ids",
        "list_auth_identities",
      ],
      changeMethods: ["new", "add_account", "send_transaction"],
      useLocalViewExecution: false,
    }) as unknown as AbstractContract;
  }

  async new(): Promise<void> {
    return await this.contract.new();
  }

  async addAccount(
    accountId: string,
    authIdentity: AuthIdentity
  ): Promise<void> {
    return await this.contract.add_account({
      account_id: accountId,
      auth_identity: authIdentity,
    });
  }

  async getAccountById(accountId: string): Promise<Account | null> {
    return await this.contract.get_account_by_id({ account_id: accountId });
  }

  async listAccountIds(): Promise<string[]> {
    return await this.contract.list_account_ids();
  }

  async listAuthIdentities(accountId: string): Promise<AuthIdentity[] | null> {
    return await this.contract.list_auth_identities({ account_id: accountId });
  }

  async sendTransaction(userOp: UserOperation): Promise<void> {
    return await this.contract.send_transaction({
      args: { user_op: userOp },
      gas: "300000000000000",
      amount: "10", // TODO: Use dynamic fee
    });
  }
}
