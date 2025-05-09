
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

/**
 * Página de login da aplicação
 * Permite que o usuário se autentique para acessar o sistema
 */
const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Manipula o envio do formulário de login
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Tenta realizar o login
    login(password);
    
    setIsLoading(false);
  };

  // Se já estiver autenticado, redireciona para o dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">Meu Bolso Futuro</CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar sua gestão financeira
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <Input
                  id="password"
                  type="password"
                  placeholder="Senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full"
                  required
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
