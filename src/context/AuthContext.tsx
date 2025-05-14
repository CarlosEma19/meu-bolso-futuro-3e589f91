
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserCredentials, UserRegistration } from "@/types/User";
import { authenticateUser, registerUser } from "@/services/userService";

type AuthContextType = {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (credentials: UserCredentials) => boolean;
  register: (data: UserRegistration) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provedor do contexto de autenticação
 * Gerencia o estado de autenticação do usuário
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Verifica se o usuário já está autenticado (via localStorage)
  useEffect(() => {
    const authData = localStorage.getItem("meuBolsoFuturo_auth");
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Erro ao recuperar dados de autenticação:", error);
        localStorage.removeItem("meuBolsoFuturo_auth");
      }
    }
  }, []);

  /**
   * Realiza o login verificando as credenciais
   * @param credentials Credenciais do usuário
   * @returns Resultado da autenticação
   */
  const login = (credentials: UserCredentials): boolean => {
    const user = authenticateUser(credentials);
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem("meuBolsoFuturo_auth", JSON.stringify(user));
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.name}!`,
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Registra um novo usuário
   * @param data Dados do novo usuário
   * @returns Resultado do registro
   */
  const register = (data: UserRegistration): boolean => {
    const user = registerUser(data);
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem("meuBolsoFuturo_auth", JSON.stringify(user));
      toast({
        title: "Registro realizado com sucesso",
        description: `Bem-vindo ao Meu Bolso Futuro, ${user.name}!`,
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Erro no registro",
        description: "Email já cadastrado. Tente outro email.",
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
    setCurrentUser(null);
    localStorage.removeItem("meuBolsoFuturo_auth");
    toast({
      title: "Logout realizado",
      description: "Você saiu da aplicação",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, register, logout }}>
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
