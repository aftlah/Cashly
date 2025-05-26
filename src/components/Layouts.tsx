"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, ListOrdered, PlusCircle, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cookies from "js-cookie"

// Mock getUserProfile function
const getUserProfile = async () => {
    // This would normally fetch from your API
    return { username: "John Doe" }
}

interface LayoutsProps {
    children: React.ReactNode
}

export const Layouts = ({ children }: LayoutsProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const [user, setUser] = useState<{ username?: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cachedUsername = Cookies.get("user-username")

        if (cachedUsername) {
            setUser({ username: cachedUsername })
            setLoading(false)
        } else {
            const fetchUser = async () => {
                try {
                    const userData = await getUserProfile()
                    setUser(userData)
                } catch (error) {
                    console.error("Failed to fetch user profile:", error)
                    setUser(null)
                } finally {
                    setLoading(false)
                }
            }
            fetchUser()
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        Cookies.remove("user-username")
        router.push("/auth/login")
    }

    const handleProfileClick = () => {
        router.push("/profile")
    }

    const handleSettingsClick = () => {
        router.push("/settings")
    }

    // Get user initials for avatar
    const getUserInitials = (username?: string) => {
        if (!username) return "U"
        const names = username.split(" ")
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase()
        }
        return username.substring(0, 2).toUpperCase()
    }

    const navItems = [
        { href: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { href: "/add", icon: <PlusCircle size={20} />, label: "Add Transaction" },
        { href: "/transactions", icon: <ListOrdered size={20} />, label: "Transactions" },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center bg-white border-3 border-slate-700 rounded-lg p-8 shadow-[6px_6px_0px_0px_#64748b]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-700 mx-auto mb-4"></div>
                    <p className="text-lg text-slate-800 font-bold">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Fixed Header */}
            <header className="fixed top-3 md:top-2 left-0 right-0 z-50 w-full px-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center bg-white border-3 border-slate-700 rounded-lg shadow-[6px_6px_0px_0px_#64748b] justify-between">
                    <h1 className="text-2xl font-bold text-slate-800">Cashly</h1>
                    <div className="flex items-center space-x-4">
                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center space-x-2 p-3 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-600 rounded-lg shadow-[3px_3px_0px_0px_#475569] hover:shadow-[4px_4px_0px_0px_#475569]"
                                >
                                    {/* Avatar */}
                                    <div className="h-8 w-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm font-bold border-2 border-slate-700">
                                        {/* {getUserInitials(user?.username)} */}
                                        {getUserInitials(Cookies.get("username") || user?.username)}
                                    </div>

                                    {/* Username */}
                                    <span className="hidden md:inline text-sm font-semibold text-slate-800">
                                        {user?.username || "User"}
                                    </span>

                                    <ChevronDown size={14} className="hidden md:inline text-slate-600" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-48 border-3 border-slate-700 bg-white rounded-lg shadow-[4px_4px_0px_0px_#64748b]"
                            >
                                <DropdownMenuItem
                                    onClick={handleProfileClick}
                                    className="font-semibold text-slate-800 hover:bg-slate-100"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={handleSettingsClick}
                                    className="font-semibold text-slate-800 hover:bg-slate-100"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-slate-300" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-700 focus:text-red-700 font-semibold hover:bg-red-50"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content with padding to avoid fixed header overlap */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[76px] pb-20">
                {/* Page Content */}
                {children}
            </main>

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 inset-x-0 z-50 mb-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-around bg-white border-3 border-slate-700 rounded-lg shadow-[6px_6px_0px_0px_#64748b]">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center py-4 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${pathname === item.href
                                        ? "text-slate-800 bg-slate-200 border-2 border-slate-600 shadow-[3px_3px_0px_0px_#475569]"
                                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
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
