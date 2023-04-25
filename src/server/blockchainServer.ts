import express from "express";
import morgan from "morgan";

import BlockChain from "../lib/blockchain";

const PORT: number = 4000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const blockchain = new BlockChain();

app.get("/status", (req, res, next) => {
  res.json({
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
    numberOfBlocks: blockchain.blocks.length,
  });
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

app.listen(PORT, () => {
  console.log(`Blockchain running on port ${PORT}`);
});
