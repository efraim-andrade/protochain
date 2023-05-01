import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";

import BlockChain from "../lib/blockchain";
import Block from "../lib/block";

const PORT: number = parseInt(process.env.PORT || "3000");

const app = express();

/* c8 ignore start */
if (process.argv.includes("--run")) {
  app.use(morgan("dev"));
}
/* c8 ignore end */

app.use(express.json());

const blockchain = new BlockChain();

app.get("/status", (req, res, next) => {
  res.json({
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
    numberOfBlocks: blockchain.blocks.length,
  });
});

app.get("/blocks/next", (req, res, next) => {
  res.json(blockchain.getNextBlock());
});

app.get("/blocks/:indexOrHash", (req, res, next) => {
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

app.post("/blocks", (req, res, next) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);

  const validation = blockchain.addBlock(block);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(201).json(block);
});

/* c8 ignore start */
if (process.argv.includes("--run")) {
  app.listen(PORT, () => {
    console.log(`Blockchain running on port ${PORT}`);
  });
}
/* c8 ignore end */

export { app };
