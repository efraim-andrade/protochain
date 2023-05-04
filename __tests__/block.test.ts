import Block from '../src/lib/block'
import BlockInfo from "../src/lib/blockInfo";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionTypes";

jest.mock("../src/lib/transaction");

describe("Block tests", () => {
  const exampleDifficulty = 0;
  const exampleMiner = "miner_wallet_address";

  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      transactions: [
        new Transaction({
          data: "Genesis block",
        } as Transaction),
      ],
    } as Block);
  });

  it("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
    } as Block);

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  });

  it("Should NOT be valid (2 FEE)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "fee 1",
          type: TransactionType.FEE,
        } as Transaction),
        new Transaction({
          data: "fee 2",
          type: TransactionType.FEE,
        } as Transaction),
      ],
    } as Block);

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should NOT be valid (invalid tx)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction()],
    } as Block);

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      index: 1,
      feePerTx: 1,
      difficulty: 0,
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo);

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  });

  it("Should be valid (fallbacks)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "",
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
    } as Block);
    block.timestamp = -1;
    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
    } as Block);

    block.mine(exampleDifficulty, exampleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (no mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });
});