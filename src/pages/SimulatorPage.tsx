
import React from "react";
import FinancialSimulator from "@/components/FinancialSimulator";

/**
 * Página do simulador financeiro
 * Permite ao usuário simular cenários financeiros futuros
 */
const SimulatorPage = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Simulador Financeiro</h1>
      <p className="text-muted-foreground mb-6">
        Use esse simulador para planejar seu futuro financeiro e ver como seus investimentos podem crescer ao longo do tempo.
      </p>
      
      <FinancialSimulator />
    </div>
  );
};

export default SimulatorPage;
