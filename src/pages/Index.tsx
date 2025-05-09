
import { Navigate } from "react-router-dom";

/**
 * Página index que redireciona para o login
 */
const Index = () => {
  return <Navigate to="/login" replace />;
};

export default Index;
