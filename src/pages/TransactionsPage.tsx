
import React from "react";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";

/**
 * Página de transações
 * Exibe o formulário para adicionar transações e a lista de transações existentes
 */
const TransactionsPage = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Transações</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList />
        </div>
        
        <div>
          <TransactionForm />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
