
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionType, TransactionFilters } from "@/types/Transaction";

/**
 * Componente que exibe a lista de transações com opções de filtro
 */
const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactions();
  
  // Estado para os filtros
  const [filters, setFilters] = useState<TransactionFilters>({});
  
  /**
   * Formata um valor para exibição como moeda
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  /**
   * Aplica os filtros à lista de transações
   */
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtro por tipo
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Filtro por categoria
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    // Filtro por data início
    if (filters.startDate && transaction.date < filters.startDate) {
      return false;
    }
    
    // Filtro por data fim
    if (filters.endDate && transaction.date > filters.endDate) {
      return false;
    }
    
    return true;
  });

  // Obtém todas as categorias únicas para o filtro
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transações</h2>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="w-full md:w-auto">
          <Select
            onValueChange={(value: TransactionType | "") => 
              setFilters(prev => ({ ...prev, type: value || undefined }))
            }
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto">
          <Select
            onValueChange={(value) => 
              setFilters(prev => ({ ...prev, category: value || undefined }))
            }
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas categorias</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div>
            <Input
              type="date"
              placeholder="Data inicial"
              onChange={(e) => 
                setFilters(prev => ({ ...prev, startDate: e.target.value || undefined }))
              }
              className="w-full md:w-auto"
            />
          </div>
          <div>
            <Input
              type="date"
              placeholder="Data final"
              onChange={(e) => 
                setFilters(prev => ({ ...prev, endDate: e.target.value || undefined }))
              }
              className="w-full md:w-auto"
            />
          </div>
        </div>
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            onClick={() => setFilters({})}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
      
      {/* Tabela de transações */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(parseISO(transaction.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type === "income" ? "Receita" : "Despesa"}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;
