import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import Transaction from "../transaction";
import TransactionType from "../transactionTypes";

export default class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;

  constructor() {
    this.blocks = [
      new Block({
        index: 0,
        hash: "abc",
        previousHash: "",
        transactions: [
          new Transaction({
            data: "tx1",
            type: TransactionType.FEE,
          } as Transaction),
        ],
        timestamp: Date.now(),
      } as Block),
    ];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, `Invalid mock block`);

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find((block) => block.hash === hash);
  }

  isValid(): Validation {
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    return {
      transactions: [
        new Transaction({
          data: new Date().toString(),
        } as Transaction),
      ],
      index: 1,
      feePerTx: this.getFeePerTx(),
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      maxDifficulty: 62,
    };
  }
}
