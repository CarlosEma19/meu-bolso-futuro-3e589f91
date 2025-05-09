
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provedor do contexto de autenticação
 * Gerencia o estado de autenticação do usuário
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Verifica se o usuário já está autenticado (via localStorage)
  useEffect(() => {
    const auth = localStorage.getItem("meuBolsoFuturo_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Realiza o login verificando a senha
   * @param password Senha fornecida pelo usuário
   * @returns Resultado da autenticação
   */
  const login = (password: string): boolean => {
    // Senha fixa definida
    const correctPassword = "o cadu é o melhor";
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("meuBolsoFuturo_auth", "true");
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Meu Bolso Futuro",
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Realiza o logout do usuário
   */
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("meuBolsoFuturo_auth");
    toast({
      title: "Logout realizado",
      description: "Você saiu da aplicação",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para utilizar o contexto de autenticação
 * @returns Contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
