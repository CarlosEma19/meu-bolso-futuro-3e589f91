
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Componente de cartão usado no dashboard
 * @param title - Título do cartão
 * @param value - Valor a ser exibido
 * @param icon - Ícone opcional para o cartão
 * @param className - Classes CSS adicionais
 */
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const DashboardCard = ({ title, value, icon, className }: DashboardCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
