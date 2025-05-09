
/**
 * Tipos de transação disponíveis no sistema
 */
export type TransactionType = "income" | "expense";

/**
 * Interface que define a estrutura de uma transação
 */
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
}

/**
 * Interface para os filtros de transações
 */
export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
}
