export enum TransactionType {
  debit = 'debit',
  credit = 'credit',
}

export enum TransactionSubType {
  reward = 'reward',
  purchase = 'purchase',
  refund = 'refund'
}

export enum TransactionStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}