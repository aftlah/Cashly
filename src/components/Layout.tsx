'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListOrdered, PlusCircle } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/transactions', icon: <ListOrdered size={20} />, label: 'Transactions' },
    { href: '/add', icon: <PlusCircle size={20} />, label: 'Add New' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-indigo-900">Finance Tracker</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;