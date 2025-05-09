
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { TransactionProvider } from "@/context/TransactionContext";

/**
 * Componente de layout principal da aplicação
 * Inclui o cabeçalho e aplica provedores de contexto
 */
const Layout = () => {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2025 Meu Bolso Futuro - Aplicação para Gestão Financeira Pessoal</p>
          </div>
        </footer>
      </div>
    </TransactionProvider>
  );
};

export default Layout;
