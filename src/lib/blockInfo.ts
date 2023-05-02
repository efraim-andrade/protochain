import Transaction from "./transaction";

/**
 * BlockInfo interface
 */
export default interface BlockInfo {
  index: number;
  previousHash: string;
  difficulty: number;
  maxDifficulty: number;
  feePerTx: number;
  transactions: Transaction[];
}
