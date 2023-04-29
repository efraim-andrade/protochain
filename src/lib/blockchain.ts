import Block from './block'
import Validation from "./validation";

/**
 * A blockchain is a growing list of records, called blocks, that are linked
 * together using cryptography. Each block contains a cryptographic hash of
 * the previous block, a timestamp, and transaction data (generally
 * represented as a Merkle tree).
 */
export default class BlockChain {
  static readonly DIFFICULTY_FACTOR = 5;

  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Creates a new blockchain with a genesis block.
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        data: "Genesis Block",
      } as Block),
    ];
    this.nextIndex++;
  }

  /**
   * @returns The last block in the blockchain.
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   *
   * @returns The difficulty of the blockchain.
   */
  getDifficulty(): number {
    //Can be anything depending on the implementation, ex. average time between blocks, number of transactions, number of miners, etc.
    return Math.ceil(this.blocks.length / BlockChain.DIFFICULTY_FACTOR);
  }

  /**
   * adds a block to the blockchain.
   * @param block The block to add to the blockchain.
   * @returns Validation object.
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty()
    );
    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`);

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  /**
   * Gets a block with the given hash.
   * @param hash The hash of the block to find.
   * @returns a block with the given hash, or undefined if not found.
   */
  getBlock(hash: string): Block | undefined {
    return this.blocks.find((block) => block.hash === hash);
  }

  /**
   * Validate mined block to before adds to blockchain.
   * @returns validation object.
   */
  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];

      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
        this.getDifficulty()
      );

      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        );
    }

    return new Validation();
  }
}
