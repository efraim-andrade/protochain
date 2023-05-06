import Transaction from "./transaction";

export default interface TransactionSearch {
  blockIndex: number;
  mempoolIndex: number;
  transaction: Transaction;
}
