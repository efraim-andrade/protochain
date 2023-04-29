import Block from '../src/lib/block'

describe("Block tests", () => {
  const exampleDifficulty = 0;
  const exampleMiner = "miner_wallet_address";

  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      data: "Genesis Block",
    } as Block);
  });

  it("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);

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
      data: "Block 2",
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
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
      data: "Block 2",
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
      data: "Block 2",
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });

  it("Should not be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  });
})