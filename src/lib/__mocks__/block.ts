import Transaction from "../transaction";
import Validation from "../validation";

export default class Block {
  index: number;
  timestamp: number = Date.now();
  hash: string;
  previousHash: string;
  transactions: Transaction[];

  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.transactions = block?.transactions || [];
    this.previousHash = block?.previousHash || "";

    this.hash = block?.hash || this.getHash();
    this.timestamp = block?.timestamp || Date.now();
  }

  getHash(): string {
    return this.hash || "abc";
  }

  isValid(previousHash: string, previousIndex: number): Validation {
    if (!previousHash || previousIndex < 0 || this.index < 0) {
      return new Validation(false, "Invalid mock block.");
    }

    return new Validation();
  }
}
