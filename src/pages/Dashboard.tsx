
import { useEffect } from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useTransactions } from "@/context/TransactionContext";
import { Chart, ChartCard } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/DashboardCard";
import TransactionForm from "@/components/TransactionForm";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { Calculator, ChartBarIcon, ChartPie, DollarSign } from "lucide-react";

/**
 * Configuração do Chart.js
 */
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Página do Dashboard
 * Exibe o resumo financeiro e permite adicionar novas transações
 */
const Dashboard = () => {
  const { transactions, totalIncome, totalExpense, balance } = useTransactions();

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
   * Obtém os dados para o gráfico de categorias
   */
  const getCategoryData = () => {
    // Agrupa transações por categoria e soma os valores
    const categoryMap: Record<string, number> = {};
    
    transactions.forEach((transaction) => {
      const { category, amount, type } = transaction;
      const value = type === "income" ? amount : -amount;
      
      if (categoryMap[category]) {
        categoryMap[category] += value;
      } else {
        categoryMap[category] = value;
      }
    });
    
    // Converte para o formato esperado pelo gráfico
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.abs(value),
      isExpense: value < 0,
    }));
  };

  /**
   * Obtém os dados para o gráfico de receitas vs despesas
   */
  const getIncomeExpenseData = () => [
    { name: "Receitas", value: totalIncome },
    { name: "Despesas", value: totalExpense },
  ];

  // Cores para os gráficos
  const COLORS = ["#8B5CF6", "#F97316", "#0EA5E9", "#8A898C", "#D946EF", "#1EAEDB"];
  const INCOME_COLOR = "#10B981";
  const EXPENSE_COLOR = "#EF4444";

  // Filtra as transações recentes (últimas 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Saldo Atual"
          value={formatCurrency(balance)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          className={balance >= 0 ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}
        />
        <DashboardCard
          title="Receitas Totais"
          value={formatCurrency(totalIncome)}
          icon={<ChartPie className="h-4 w-4 text-muted-foreground" />}
          className="border-l-4 border-green-500"
        />
        <DashboardCard
          title="Despesas Totais"
          value={formatCurrency(totalExpense)}
          icon={<Calculator className="h-4 w-4 text-muted-foreground" />}
          className="border-l-4 border-red-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getCategoryData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value">
                      {getCategoryData().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isExpense ? EXPENSE_COLOR : INCOME_COLOR} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getIncomeExpenseData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell key="cell-0" fill={INCOME_COLOR} />
                      <Cell key="cell-1" fill={EXPENSE_COLOR} />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  Nenhuma transação registrada ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`font-medium ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <TransactionForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
