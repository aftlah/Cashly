"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, ListOrdered, PlusCircle, LogOut, User, Settings, ChevronDown, Calendar } from "lucide-react"
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
import { getUserProfile } from "@/lib/getUser"

interface LayoutsProps {
    children: React.ReactNode
    showWelcome?: boolean
}

export const Layouts = ({ children, showWelcome = false }: LayoutsProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const [user, setUser] = useState<{ username?: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())

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

    useEffect(() => {
        if (showWelcome) {
            const timer = setInterval(() => {
                setCurrentTime(new Date())
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [showWelcome])

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

    const getGreeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 17) return "Good Afternoon"
        return "Good Evening"
    }

    const formatDate = () => {
        return currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = () => {
        return currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <header className="fixed top-3 md:top-2 left-0 right-0 z-50 w-full px-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center rounded-lg bg-white shadow-lg justify-between">
                    <h1 className="text-2xl font-bold text-indigo-900">Cashly</h1>
                    <div className="flex items-center space-x-4">
                        {/* Simple Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {/* Simple Avatar */}
                                    <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {getUserInitials(user?.username)}
                                    </div>

                                    {/* Username */}
                                    <span className="hidden md:inline text-sm font-medium text-gray-700">{user?.username || "User"}</span>

                                    <ChevronDown size={14} className="hidden md:inline text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={handleProfileClick}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={handleSettingsClick}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
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
                {/* Welcome Section - Only show on dashboard */}
                {showWelcome && (
                    <div className="py-6 space-y-6">
                        {/* Welcome Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        {getGreeting()}
                                        {user?.username ? `, ${user.username}!` : "!"}
                                    </h1>
                                    <p className="text-indigo-100 text-sm md:text-base">Welcome back to your financial dashboard</p>
                                    <div className="flex items-center space-x-4 text-indigo-200 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <Calendar size={16} />
                                            <span>{formatDate()}</span>
                                        </div>
                                        <div className="hidden md:block">•</div>
                                        <div className="hidden md:block">{formatTime()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                {children}
            </main>

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 inset-x-0 z-50 mb-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-around bg-white shadow-lg rounded-lg">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center py-3 px-4 text-sm font-medium transition-colors ${pathname === item.href ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
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
