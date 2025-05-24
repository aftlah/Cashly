import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  showDate?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onDelete,
  showDate = true 
}) => {
  const { id, type, amount, date, description } = transaction;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            type === 'income' 
              ? 'bg-emerald-100 text-emerald-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          </div>
          
          <div>
            <p className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs">
              {description}
            </p>
            {showDate && (
              <p className="text-sm text-gray-500">{formatDate(date)}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`font-semibold ${
            type === 'income' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {type === 'income' ? '+' : '-'} Rp {amount.toLocaleString()}
          </span>
          
          <button 
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete transaction"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;