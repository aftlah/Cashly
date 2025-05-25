import { getUserFromCookies } from "@/lib/auth";
import { Transaction } from "@/types";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await getUserFromCookies();
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(5) as { data: Transaction[] | null };

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              ${transactions?.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0).toFixed(2) ?? '0.00'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              ${transactions?.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0).toFixed(2) ?? '0.00'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Balance</h3>
            <p className="text-2xl font-bold">
              ${transactions?.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0).toFixed(2) ?? '0.00'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                  <div className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>
      </div>
    </main>
  );
}
