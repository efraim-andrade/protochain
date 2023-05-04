import TransactionType from "../transactionTypes";
import Validation from "../validation";

export default class Transaction {
  hash: string;
  data: string;
  timestamp: number;
  type: TransactionType;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.data = tx?.data || "";
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    return "abc";
  }

  isValid(): Validation {
    if (!this.data) {
      return new Validation(false, "Invalid mock transaction.");
    }

    return new Validation();
  }
}
