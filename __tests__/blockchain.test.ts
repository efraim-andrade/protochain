import Block from '../src/lib/block'
import Blockchain from '../src/lib/blockchain'

describe("Blockchain tests", () => {
  it("Should has genesis block", () => {
    const blockchain = new Blockchain()

    expect(blockchain.blocks.length).toBe(1)
  })

  it("Should be valid (genesis)", () => {
    const blockchain = new Blockchain();

    expect(blockchain.isValid().success).toEqual(true);
  });

  it("Should be valid (two blocks)", () => {
    const blockchain = new Blockchain();

    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"));

    expect(blockchain.isValid().success).toEqual(true);
  });

  it("Should not be valid", () => {
    const blockchain = new Blockchain();

    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"));
    blockchain.blocks[1].data = "A transfer 2 to B";

    expect(blockchain.isValid().success).toEqual(false);
  });

  it('should add a block', () => {
    const blockchain = new Blockchain()

    const result = blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"))

    expect(result.success).toBe(true);
  })

  it('should not add a block', () => {
    const blockchain = new Blockchain()

    const result = blockchain.addBlock(new Block(-1, blockchain.blocks[0].hash, "Block 2"))

    expect(result.success).toBe(false);
  })
})