import sha256 from "crypto-js/sha256";
import TransactionType from "./transactionTypes";
import Validation from "./validation";

/**
 * Transaction class
 */
export default class Transaction {
  hash: string;
  data: string;
  timestamp: number;
  type: TransactionType;

  /**
   *  Creates a new transaction
   * @param tx transaction data
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.data = tx?.data || "";
    this.hash = tx?.hash || this.getHash();
  }

  /**
   *  Get the hash of the transaction
   * @returns {string} Hash of the transaction
   */
  getHash(): string {
    return sha256(this.type + this.data + this.timestamp).toString();
  }

  /**
   *  Validate the transaction
   * @returns {Validation} Validation object
   */
  isValid(): Validation {
    if (this.hash !== this.getHash()) {
      return new Validation(false, "Invalid hash");
    }

    if (!this.data) {
      return new Validation(false, "Invalid data");
    }

    return new Validation();
  }
}
