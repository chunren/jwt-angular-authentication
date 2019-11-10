export interface Transaction {
  userName?: string;
  transactionId?: number;
  transactionRef?: string;
  action?: string;
  amount?: number;
  subjectName?: string;
  transactionDate?: Date;
  transactionMethod?: string;
}
