
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Componente de proteção de rotas
 * Verifica se o usuário está autenticado antes de permitir acesso
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, permite acesso à rota
  return <Outlet />;
};

export default ProtectedRoute;
