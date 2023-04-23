import Block from '../src/lib/block'

describe("Block tests", () => {
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block(0, "", "data")
  })

  it("Should be valid", () => {
    const block = new Block(1, genesis.hash, "data")
    const valid = block.isValid(genesis.hash, genesis.index)

    expect(valid).toBeTruthy()
  })

  it("Should not be valid (previous hash)", () => {
    const block = new Block(1, "", "data")
    const valid = block.isValid(genesis.hash, genesis.index)

    expect(valid).toBeFalsy()
  })

  it("Should not be valid (timestamp)", () => {
    const block = new Block(1, genesis.hash, "data")
    block.timestamp = -1
    block.hash = block.getHash()
    
    const valid = block.isValid(genesis.hash, genesis.index)

    expect(valid).toBeFalsy()
  })

  it("Should not be valid (hash)", () => {
    const block = new Block(1, genesis.hash, 'data')
    block.hash = ""
    const valid = block.isValid(genesis.hash, genesis.index)

    expect(valid).toBeFalsy()
  })

  it("Should not be valid (data)", () => {
    const block = new Block(1, genesis.hash, '')
    const valid = block.isValid(genesis.hash, genesis.index)

    expect(valid).toBeFalsy()
  })

  it("Should not be valid (index)", () => {
    const block = new Block(-1, genesis.hash, 'data')
    const valid = block.isValid(genesis.hash, genesis.index)

    expect(valid).toBeFalsy()
  })
})