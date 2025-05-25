'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ListOrdered,
    PlusCircle,
    LogOut,
    User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';

export const Layouts = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const navItems = [
        { href: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { href: '/transactions', icon: <ListOrdered size={20} />, label: 'Transactions' },
        { href: '/add', icon: <PlusCircle size={20} />, label: 'Add New' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="mt-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold text-indigo-900">Cashly</h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/profile" passHref>
                            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                                <User size={20} />
                                <span className="hidden md:inline">Profile</span>
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            <span className="hidden md:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 inset-x-0 z-50 mb-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center py-3 px-4 text-sm font-medium transition-colors ${
                                    pathname === item.href 
                                    ? 'text-indigo-600' 
                                    : 'text-gray-600 hover:text-indigo-600'
                                }`}
                            >
                                {item.icon}
                                <span className="mt-1">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* <nav className=" fixed bottom-0 inset-x-0 z-50 mb-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg">
                    <Tabs
                        value={pathname}
                        onValueChange={(value) => {
                            if (value !== pathname) router.push(value);
                        }}
                    >
                        <TabsList className="flex justify-around">
                            {navItems.map((item) => (
                                <TabsTrigger
                                    key={item.href}
                                    value={item.href}
                                    className="flex flex-col items-center py-3 px-4 text-sm font-medium"
                                >
                                    {item.icon}
                                    <span className="mt-1">{item.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </nav> */}
        </div>
    );
};



// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { LayoutDashboard, ListOrdered, PlusCircle, LogOut, User } from 'lucide-react';

// import { createClient } from '@/lib/supabase/client';

// import { Button } from '@/components/ui/button';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// export const Layouts = ({ children }: { children: React.ReactNode }) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const supabase = createClient();

//   const navItems = [
//     { href: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
//     { href: '/transactions', icon: <ListOrdered size={20} />, label: 'Transactions' },
//     { href: '/add', icon: <PlusCircle size={20} />, label: 'Add New' },
//   ];

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push('/login');
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-indigo-900">Cashly</h1>
//           <div className="flex items-center space-x-4">
//             <Link href="/profile" passHref>
//               <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
//                 <User size={20} />
//                 <span className="hidden md:inline">Profile</span>
//               </Button>
//             </Link>
//             <Button
//               variant="ghost"
//               className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
//               onClick={handleLogout}
//             >
//               <LogOut size={20} />
//               <span className="hidden md:inline">Logout</span>
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {children}
//       </main>

//       <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Tabs
//             value={pathname}
//             onValueChange={(value: string) => {
//               if (value !== pathname) router.push(value);
//             }}
//           >
//             <TabsList className="flex justify-around">
//               {navItems.map((item) => (
//                 <TabsTrigger
//                   key={item.href}
//                   value={item.href}
//                   className="flex flex-col items-center py-3 px-4 text-sm font-medium"
//                 >
//                   {item.icon}
//                   <span className="mt-1">{item.label}</span>
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//           </Tabs>
//         </div>
//       </nav>
//     </div>
//   );
// };
