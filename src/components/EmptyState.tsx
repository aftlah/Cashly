import { CircleDollarSign } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLink?: string;
  actionText?: string;
}

const EmptyState = ({
  title = 'No transactions yet',
  description = 'Start by adding your first transaction',
  actionLink = '/add',
  actionText = 'Add Transaction',
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
        <CircleDollarSign size={32} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <Link
        href={actionLink}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        {actionText}
      </Link>
    </div>
  );
};

export default EmptyState;