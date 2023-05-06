import Block from './block'
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "./transactionSearch";
import TransactionType from "./transactionTypes";
import Validation from "./validation";

/**
 * A blockchain is a growing list of records, called blocks, that are linked
 * together using cryptography. Each block contains a cryptographic hash of
 * the previous block, a timestamp, and transaction data (generally
 * represented as a Merkle tree).
 */
export default class BlockChain {
  static readonly DIFFICULTY_FACTOR = 5;
  static readonly MAX_DIFFICULTY = 62;
  static readonly TX_PER_BLOCK = 2;

  blocks: Block[];
  nextIndex: number = 0;
  mempool: Transaction[] = [];

  /**
   * Creates a new blockchain with a genesis block.
   */
  constructor() {
    this.mempool = [];
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: new Date().toString(),
          } as Transaction),
        ] as Transaction[],
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
   * adds a transaction to the mempool.
   * @param transaction The transaction to add to the mempool.
   * @returns Validation object.
   */
  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if (!validation.success) {
      return new Validation(
        false,
        `Invalid transaction: ${validation.message}`
      );
    }

    if (this.mempool.some((tx) => tx.hash === transaction.hash)) {
      return new Validation(
        false,
        `Transaction already in mempool: ${transaction.hash}`
      );
    }

    if (this.blocks.some((block) => block.transactions.includes(transaction))) {
      return new Validation(
        false,
        `Transaction already in blockchain: ${transaction.hash}`
      );
    }

    this.mempool.push(transaction);

    return new Validation(true, transaction.hash);
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
    if (!validation.success) {
      return new Validation(false, `Invalid block: ${validation.message}`);
    }

    const txs = block.transactions
      .filter((tx) => tx.type !== TransactionType.FEE)
      .map((tx) => tx.hash);
    const newMempool = this.mempool.filter((tx) => !txs.includes(tx.hash));

    if (newMempool.length + txs.length !== this.mempool.length) {
      return new Validation(
        false,
        `Invalid transaction in block: ${validation.message}`
      );
    }

    this.mempool = newMempool;

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation(true, block.hash);
  }

  /**
   * Gets a block with the given hash.
   * @param hash The hash of the block to find.
   * @returns a block with the given hash, or undefined if not found.
   */
  getBlock(hash: string): Block | undefined {
    return this.blocks.find((block) => block.hash === hash);
  }

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex((tx) => tx.hash === hash);
    if (mempoolIndex !== -1) {
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex],
      } as TransactionSearch;
    }

    const blockIndex = this.blocks.findIndex((block) =>
      block.transactions.some((tx) => tx.hash === hash)
    );
    if (blockIndex !== -1) {
      return {
        blockIndex,
        transaction: this.blocks[blockIndex].transactions.find(
          (tx) => tx.hash === hash
        ),
      } as TransactionSearch;
    }

    return {
      blockIndex: -1,
      mempoolIndex: -1,
    } as TransactionSearch;
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

  /**
   *  Gets the fee per transaction.
   * @returns the fee per transaction.
   */
  getFeePerTx(): number {
    return 1;
  }

  /**
   *  Gets the next block to be mined.
   * @returns a new block with the next index, a timestamp, and the hash of the last block.
   */
  getNextBlock(): BlockInfo | null {
    if (!this.mempool || !this.mempool.length) {
      return null;
    }

    const transactions = this.mempool.splice(0, BlockChain.TX_PER_BLOCK);

    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const maxDifficulty = BlockChain.MAX_DIFFICULTY;

    return {
      index,
      feePerTx,
      difficulty,
      transactions,
      previousHash,
      maxDifficulty,
    };
  }
}
