
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail, User, Lock } from "lucide-react";

/**
 * Página de registro da aplicação
 * Permite que novos usuários criem uma conta
 */
const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Manipula o envio do formulário de registro
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      setPasswordError("As senhas não conferem");
      return;
    }
    
    setIsLoading(true);
    
    // Tenta realizar o registro
    register({ name, email, password });
    
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
          <CardTitle className="text-2xl text-center font-bold">Criar nova conta</CardTitle>
          <CardDescription className="text-center">
            Registre-se para começar a usar o Meu Bolso Futuro
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full ${passwordError ? "border-red-500" : ""}`}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm">
              Já tem uma conta? {" "}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
