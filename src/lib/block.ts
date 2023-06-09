import sha256 from 'crypto-js/sha256'
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionTypes";

/**
 * Creates a new Block
 */
export default class Block {
  index: number;
  timestamp: number = Date.now();
  hash: string;
  previousHash: string;
  transactions: Transaction[];
  nonce: number;
  miner: string;

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
    this.transactions = block?.transactions
      ? block.transactions.map((tx) => new Transaction(tx))
      : ([] as Transaction[]);

    this.index = block?.index || 0;
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.previousHash = block?.previousHash || "";

    this.hash = block?.hash || this.getHash();
    this.timestamp = block?.timestamp || Date.now();
  }

  /**
   * Get hash of the block
   * @returns crypto-js hash of the block
   */
  getHash(): string {
    const txs =
      this.transactions && this.transactions.length
        ? this.transactions.map((tx) => tx.hash).join("")
        : "";

    return sha256(
      this.index +
        txs +
        this.timestamp +
        this.previousHash +
        this.nonce +
        this.miner
    ).toString();
  }

  /**
   * Generate a new valid hash for the block with the specified difficulty
   * @param difficulty the blockchain current difficulty
   * @param miner the miner wallet address
   */
  mine(difficulty: number, miner: string) {
    this.miner = miner;
    const prefix = new Array(difficulty + 1).join("0");

    do {
      this.nonce++;
      this.hash = this.getHash();
    } while (!this.hash.startsWith(prefix));
  }

  /**
   * Verify if the block is valid
   * @param previousHash previous block hash
   * @param previousIndex previous block index
   * @param difficulty difficulty of the block
   * @returns If the block is valid will return true
   */
  isValid(
    previousHash: string,
    previousIndex: number,
    difficulty: number
  ): Validation {
    if (this.transactions && this.transactions.length) {
      if (
        this.transactions.filter((tx) => tx.type === TransactionType.FEE)
          .length > 1
      ) {
        return new Validation(false, "Too many fees.");
      }

      const validations = this.transactions.map((tx) => tx.isValid());

      const errors = validations
        .filter((validation) => !validation.success)
        .map((validation) => validation.message);

      if (errors.length > 0) {
        return new Validation(
          false,
          `Invalid block due to invalid transactions: ${errors.join(", ")}`
        );
      }
    }

    if (previousIndex !== this.index - 1) {
      return new Validation(false, "Invalid index");
    }

    if (this.timestamp < 1) {
      return new Validation(false, "Invalid timestamp");
    }

    if (this.previousHash !== previousHash) {
      return new Validation(false, "Invalid previous hash");
    }

    if (!this.nonce || !this.miner) {
      return new Validation(false, "No mined");
    }

    const prefix = new Array(difficulty + 1).join("0");
    if (this.hash !== this.getHash() || !this.hash.startsWith(prefix)) {
      return new Validation(false, "Invalid hash");
    }

    return new Validation();
  }

  static fromBlockInfo(blockInfo: BlockInfo): Block {
    const block = new Block();

    block.index = blockInfo.index;
    block.transactions = blockInfo.transactions;
    block.previousHash = blockInfo.previousHash;

    return block;
  }
}