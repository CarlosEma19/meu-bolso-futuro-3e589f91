
import { Link } from "react-router-dom";

/**
 * Componente de cabeçalho da aplicação
 * Contém o título da aplicação e links de navegação
 */
const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meu Bolso Futuro</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-primary-foreground/80 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transacoes" className="hover:text-primary-foreground/80 transition-colors">
                Transações
              </Link>
            </li>
            <li>
              <Link to="/simulador" className="hover:text-primary-foreground/80 transition-colors">
                Simulador
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
