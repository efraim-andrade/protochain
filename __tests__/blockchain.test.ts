import Block from '../src/lib/block'
import Blockchain from '../src/lib/blockchain'
import Transaction from "../src/lib/transaction";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");

describe("Blockchain tests", () => {
  it("Should has genesis block", () => {
    const blockchain = new Blockchain();

    expect(blockchain.blocks.length).toBe(1);
  });

  it("Should be valid (genesis)", () => {
    const blockchain = new Blockchain();

    expect(blockchain.isValid().success).toEqual(true);
  });

  it("Should be valid (two blocks)", () => {
    const blockchain = new Blockchain();

    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            data: "block 2",
          } as Transaction),
        ],
      } as Block)
    );

    expect(blockchain.isValid().success).toEqual(true);
  });

  it("Should NOT be valid", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx 1",
    } as Transaction);

    blockchain.mempool.push(tx);

    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );

    blockchain.blocks[1].index = -1;

    expect(blockchain.isValid().success).toEqual(false);
  });

  it("Should add transaction", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx 1",
      hash: "asd",
    } as Transaction);

    const validation = blockchain.addTransaction(tx);

    expect(validation.success).toEqual(true);
  });

  it("Should NOT add transaction (invalid tx)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "",
      hash: "asd",
    } as Transaction);

    const validation = blockchain.addTransaction(tx);

    expect(validation.success).toEqual(false);
  });

  it("Should NOT add transaction (duplicated blockchain)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "a",
      hash: "asd",
    } as Transaction);

    blockchain.blocks.push(new Block({ transactions: [tx] } as Block));

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(false);
  });

  it("Should NOT add transaction (duplicated mempool)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "a",
      hash: "asd",
    } as Transaction);

    blockchain.mempool.push(tx);

    const validation = blockchain.addTransaction(tx);
    expect(validation.success).toEqual(false);
  });

  it("Should get transaction (mempool)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx 1",
      hash: "abc",
    } as Transaction);

    blockchain.mempool.push(tx);

    const result = blockchain.getTransaction(tx.hash);

    expect(result.mempoolIndex).toEqual(0);
  });

  it("Should get transaction (blockchain)", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx 1",
      hash: "abcd",
    } as Transaction);

    blockchain.blocks.push(new Block({ transactions: [tx] } as Block));

    const result = blockchain.getTransaction(tx.hash);

    expect(result.blockIndex).toEqual(1);
  });

  it("Should NOT get transaction", () => {
    const blockchain = new Blockchain();

    const result = blockchain.getTransaction("xyz");

    expect(result.blockIndex).toEqual(-1);
    expect(result.mempoolIndex).toEqual(-1);
  });

  it("should add a block", () => {
    const blockchain = new Blockchain();

    const tx = new Transaction({
      data: "tx 1",
    } as Transaction);

    blockchain.mempool.push(tx);

    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );

    expect(result.success).toBe(true);
  });

  it("should get block", () => {
    const blockchain = new Blockchain();

    const block = blockchain.getBlock(blockchain.blocks[0].hash);

    expect(block).toBeTruthy();
  });

  it("should not add a block", () => {
    const blockchain = new Blockchain();

    const result = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            data: "block 2",
          } as Transaction),
        ],
      } as Block)
    );

    expect(result.success).toBe(false);
  });

  it("should get next block info", () => {
    const blockchain = new Blockchain();
    blockchain.mempool.push(new Transaction());

    const info = blockchain.getNextBlock();

    expect(info ? info.index : 0).toBe(1);
  });

  it("should NOT get next block info", () => {
    const blockchain = new Blockchain();

    const info = blockchain.getNextBlock();

    expect(info).toBeNull();
  });
});