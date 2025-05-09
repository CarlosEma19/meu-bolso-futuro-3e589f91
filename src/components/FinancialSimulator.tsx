
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransactions } from "@/context/TransactionContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * Schema para o formulário do simulador
 */
const simulatorSchema = z.object({
  initialAmount: z.coerce.number().min(0, {
    message: "O valor inicial não pode ser negativo",
  }),
  monthlyContribution: z.coerce.number().min(0, {
    message: "A contribuição mensal não pode ser negativa",
  }),
  interestRate: z.coerce.number().min(0, {
    message: "A taxa de juros não pode ser negativa",
  }),
  timeInYears: z.coerce.number().min(1, {
    message: "O tempo deve ser de pelo menos 1 ano",
  }).max(50, {
    message: "O tempo não pode exceder 50 anos",
  }),
});

type SimulatorFormValues = z.infer<typeof simulatorSchema>;

/**
 * Interface para os resultados da simulação
 */
interface SimulationResult {
  futureValue: number;
  totalContributions: number;
  interestEarned: number;
  monthlyData: Array<{
    month: number;
    balance: number;
    contribution: number;
    interest: number;
  }>;
}

/**
 * Componente do simulador financeiro
 */
const FinancialSimulator = () => {
  const { balance } = useTransactions();
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const form = useForm<SimulatorFormValues>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      initialAmount: balance > 0 ? balance : 0,
      monthlyContribution: 0,
      interestRate: 0.5, // 0.5% ao mês
      timeInYears: 5,
    },
  });

  /**
   * Calcula os resultados da simulação
   */
  const calculateSimulation = (values: SimulatorFormValues): SimulationResult => {
    const { initialAmount, monthlyContribution, interestRate, timeInYears } = values;
    
    const months = timeInYears * 12;
    const monthlyRate = interestRate / 100;
    
    let currentBalance = initialAmount;
    let totalContributions = initialAmount;
    
    const monthlyData = [];
    
    // Calcula o valor mês a mês
    for (let month = 1; month <= months; month++) {
      // Adiciona a contribuição mensal
      currentBalance += monthlyContribution;
      totalContributions += monthlyContribution;
      
      // Calcula juros do mês
      const monthlyInterest = currentBalance * monthlyRate;
      // Adiciona juros ao saldo
      currentBalance += monthlyInterest;
      
      // Armazena os dados do mês
      monthlyData.push({
        month,
        balance: currentBalance,
        contribution: monthlyContribution,
        interest: monthlyInterest,
      });
    }
    
    const futureValue = currentBalance;
    const interestEarned = futureValue - totalContributions;
    
    return {
      futureValue,
      totalContributions,
      interestEarned,
      monthlyData,
    };
  };

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
   * Manipula o envio do formulário
   */
  const onSubmit = (values: SimulatorFormValues) => {
    const result = calculateSimulation(values);
    setSimulationResult(result);
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Simulador Financeiro</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Inicial (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Quanto você já tem guardado. Por padrão, usamos seu saldo atual.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribuição Mensal (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Quanto você planeja adicionar por mês.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de Juros Mensal (%): {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Taxa de juros mensal estimada para seu investimento.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeInYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo (Anos): {field.value} anos</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={50}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Por quanto tempo você planeja investir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Calcular
              </Button>
            </form>
          </Form>
        </div>

        <div>
          {simulationResult && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium">Resultados da Simulação</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valor Futuro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(simulationResult.futureValue)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(simulationResult.totalContributions)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Rendimentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(simulationResult.interestEarned)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Retorno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {((simulationResult.interestEarned / simulationResult.totalContributions) * 100).toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dicas baseadas na simulação */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Dicas para você</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    ✨ {simulationResult.futureValue > 100000 
                      ? "Você está no caminho para construir um patrimônio significativo!" 
                      : "Continue investindo regularmente para ver seu dinheiro crescer!"}
                  </p>
                  <p>
                    💡 {simulationResult.interestEarned > simulationResult.totalContributions
                      ? "A magia dos juros compostos está trabalhando para você! Seus rendimentos já superam o valor investido."
                      : "Quanto mais tempo deixar o dinheiro investido, mais os juros compostos trabalharão para você."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSimulator;
