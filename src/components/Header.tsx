
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Componente de cabeçalho da aplicação
 * Exibe o menu de navegação
 */
const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Meu Bolso Futuro</h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/transacoes" 
            className={({ isActive }) => 
              isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            Transações
          </NavLink>
          <NavLink 
            to="/simulador" 
            className={({ isActive }) => 
              isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            Simulador
          </NavLink>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="ml-2"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
