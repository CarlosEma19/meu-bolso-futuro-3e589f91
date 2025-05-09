
import { Navigate } from "react-router-dom";

/**
 * Página index que redireciona para o dashboard
 */
const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
