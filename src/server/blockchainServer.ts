import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";

import BlockChain from "../lib/blockchain";
import Block from "../lib/block";
import Transaction from "../lib/transaction";

const PORT: number = parseInt(process.env.PORT || "4000");

const app = express();

/* c8 ignore start */
if (process.argv.includes("--run")) {
  app.use(morgan("dev"));
}
/* c8 ignore end */

app.use(express.json());

const blockchain = new BlockChain();

app.get("/status", (_, res) => {
  res.json({
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
    numberOfBlocks: blockchain.blocks.length,
  });
});

app.get("/blocks/next", (_, res) => {
  res.json(blockchain.getNextBlock());
});

app.get("/blocks/:indexOrHash", (req, res) => {
  let block;

  if (/^[0-9]+$/.test(req.params.indexOrHash)) {
    const index = parseInt(req.params.indexOrHash);

    block = blockchain.blocks[index];
  } else {
    block = blockchain.getBlock(req.params.indexOrHash);
  }

  if (!block) {
    return res.status(404).json({
      message: "Block not found",
    });
  }

  return res.json(block);
});

app.post("/blocks", (req, res) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);

  const validation = blockchain.addBlock(block);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(201).json(block);
});

app.get("/transactions/:hash?", (req, res) => {
  if (req.params.hash) {
    return res.json(blockchain.getTransaction(req.params.hash));
  }

  return res.json({
    next: blockchain.mempool.slice(0, BlockChain.TX_PER_BLOCK),
    total: blockchain.mempool.length,
  });
});

app.post("/transactions", (req, res) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const tx = new Transaction(req.body as Transaction);
  const validation = blockchain.addTransaction(tx);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(201).json(tx);
});

/* c8 ignore start */
if (process.argv.includes("--run")) {
  app.listen(PORT, () => {
    console.log(`Blockchain running on port ${PORT}`);
  });
}
/* c8 ignore end */

export { app };
