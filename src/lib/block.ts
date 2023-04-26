import sha256 from 'crypto-js/sha256'
import Validation from "./validation";

/**
 * Creates a new Block
 */
export default class Block {
  index: number;
  timestamp: number = Date.now();
  hash: string;
  previousHash: string;
  data: string;

  /**
   * Creates a new block
   * @param block block data
   *
   * @example
   *
   * new Block(blockData)
   *
   */
  constructor(block?: Block) {
    this.data = block?.data || "";
    this.index = block?.index || 0;
    this.previousHash = block?.previousHash || "";

    this.hash = block?.hash || this.getHash();
    this.timestamp = block?.timestamp || Date.now();
  }

  /**
   * Get hash of the block
   * @returns crypto-js hash of the block
   */
  getHash(): string {
    return sha256(
      this.index + this.data + this.timestamp + this.previousHash
    ).toString();
  }

  /**
   * Verify if the block is valid
   * @returns If the block is valid will return true
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if (!this.data) return new Validation(false, "Invalid index");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");

    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash");
    if (previousIndex !== this.index - 1)
      return new Validation(false, "Invalid index");
    if (this.previousHash !== previousHash)
      return new Validation(false, "Invalid previous hash");

    return new Validation();
  }
}