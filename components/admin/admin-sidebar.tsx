"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, FileText, Users, Settings, LayoutDashboard, LogOut, Menu, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { deleteCookie } from "cookies-next"

interface AdminSidebarProps {
  isAuthenticated: boolean
}

export function AdminSidebar({ isAuthenticated }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    deleteCookie("admin_authenticated")
    window.location.href = "/admin/login"
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transform bg-white transition-all duration-500 ease-in-out",
          isOpen ? "w-64" : "w-16",
          "lg:w-64",
          !isOpen && "lg:translate-x-0",
          !isOpen && "max-lg:-translate-x-[150%]"
        )}
      >
        <div className="flex h-full flex-col">
          <div className={cn(
            "flex h-16 items-center justify-center border-b px-4 transition-all duration-500 ease-in-out",
            !isOpen && "px-2"
          )}>
            {isOpen ? (
              <h1 className="text-xl font-bold transition-all duration-500 ease-in-out max-lg:mt-22">Админ-панель</h1>
            ) : (
              <Building2 className="h-6 w-6 transition-all duration-500 ease-in-out" />
            )}
          </div>

          <nav className="flex-1 space-y-1 p-4 transition-all duration-500 ease-in-out max-lg:pt-20">
            <Link
              href="/admin"
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500 ease-in-out",
                pathname === "/admin"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                !isOpen && "max-lg:justify-center max-lg:px-2"
              )}
            >
              <LayoutDashboard className="h-4 w-4 transition-all duration-500 ease-in-out" />
              <span className="transition-all duration-500 ease-in-out lg:block">Дашборд</span>
            </Link>

            <Link
              href="/admin/properties"
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500 ease-in-out",
                pathname === "/admin/properties"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                !isOpen && "max-lg:justify-center max-lg:px-2"
              )}
            >
              <Building2 className="h-4 w-4 transition-all duration-500 ease-in-out" />
              <span className="transition-all duration-500 ease-in-out lg:block">Недвижимость</span>
            </Link>

            <Link
              href="/admin/blog"
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500 ease-in-out",
                pathname === "/admin/blog"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                !isOpen && "max-lg:justify-center max-lg:px-2"
              )}
            >
              <FileText className="h-4 w-4 transition-all duration-500 ease-in-out" />
              <span className="transition-all duration-500 ease-in-out lg:block">Блог</span>
            </Link>

            <Link
              href="/admin/users"
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500 ease-in-out",
                pathname === "/admin/users"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                !isOpen && "max-lg:justify-center max-lg:px-2"
              )}
            >
              <Users className="h-4 w-4 transition-all duration-500 ease-in-out" />
              <span className="transition-all duration-500 ease-in-out lg:block">Пользователи</span>
            </Link>

            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-500 ease-in-out",
                pathname === "/admin/settings"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                !isOpen && "max-lg:justify-center max-lg:px-2"
              )}
            >
              <Settings className="h-4 w-4 transition-all duration-500 ease-in-out" />
              <span className="transition-all duration-500 ease-in-out lg:block">Настройки</span>
            </Link>

            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-500 ease-in-out",
                !isOpen && "max-lg:justify-center max-lg:px-2"
              )}
            >
              <LogOut className="h-4 w-4 transition-all duration-500 ease-in-out" />
              <span className="transition-all duration-500 ease-in-out lg:block">Выйти</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  )
}
