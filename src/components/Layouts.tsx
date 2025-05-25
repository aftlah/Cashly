'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    ListOrdered,
    PlusCircle,
    LogOut,
    User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export const Layouts = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const navItems = [
        { href: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { href: '/add', icon: <PlusCircle size={20} />, label: 'Add New' },
        { href: '/transactions', icon: <ListOrdered size={20} />, label: 'Transactions' },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 ">
            {/* max-w-lg sm:max-w-3xl md:max-w-5xl lg:max-w-7xl */}
            {/* Fixed Header */}
            <header className="fixed top-3 md:top-2 left-0 right-0 z-50 w-full px-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center rounded-lg bg-white shadow-lg justify-between">
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

            {/* Main Content with padding to avoid fixed header overlap */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[76px] pb-20">
                {children}
            </main>

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 inset-x-0 z-50 mb-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex justify-around bg-white shadow-lg rounded-lg   ">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center py-3 px-4 text-sm font-medium transition-colors ${pathname === item.href
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
        </div>
    )
}
