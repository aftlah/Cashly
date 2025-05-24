import React from 'react';
import { ArrowUpRight, ArrowDownRight, CircleDollarSign } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  showIcon?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  type,
  showIcon = true,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'income':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-600',
          icon: <ArrowUpRight size={24} />,
        };
      case 'expense':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          icon: <ArrowDownRight size={24} />,
        };
      case 'balance':
      default:
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-600',
          icon: <CircleDollarSign size={24} />,
        };
    }
  };

  const { bg, text, icon } = getTypeStyles();

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {showIcon && <div className={`${bg} ${text} p-3 rounded-full`}>{icon}</div>}
      </div>
      <p className={`text-2xl font-bold mt-2 ${text}`}>
        {type === 'expense' ? '-' : type === 'income' ? '+' : ''} Rp {amount.toLocaleString()}
      </p>
    </div>
  );
};

export default SummaryCard;