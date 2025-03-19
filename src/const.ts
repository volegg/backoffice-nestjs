export enum AppRoles {
  standart = 'standart',
  editor = 'editor',
  admin = 'admin',
  halk = 'halk',
}

export const userDataAccessRoles = [AppRoles.editor, AppRoles.admin];

export enum TransactionType {
  deposit = 'deposit',
  credit = 'credit',
}

export enum TransactionSubType {
  reward = 'reward',
  purchase = 'purchase',
  refund = 'refund',
}

export enum TransactionStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
}