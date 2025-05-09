
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, TransactionType } from "@/types/Transaction";

/**
 * Interface que define os dados e funções disponíveis no contexto de transações
 */
interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Contexto para gerenciar as transações na aplicação
 */
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

/**
 * Hook personalizado para acessar o contexto de transações
 */
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions deve ser usado dentro de um TransactionProvider");
  }
  return context;
};

/**
 * Componente que fornece o contexto de transações para a aplicação
 */
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado para armazenar todas as transações
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Carrega transações do localStorage se existirem
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Calcula os totais sempre que as transações mudam
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  // Salva transações no localStorage sempre que forem atualizadas
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  /**
   * Adiciona uma nova transação
   */
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(), // Geração simples de ID único
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  /**
   * Remove uma transação pelo ID
   */
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  /**
   * Atualiza uma transação existente
   */
  const updateTransaction = (id: string, transaction: Omit<Transaction, "id">) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...transaction, id } : t))
    );
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalIncome,
    totalExpense,
    balance,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
