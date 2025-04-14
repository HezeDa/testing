"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteCookie } from "cookies-next"
import { useState } from "react"
import { ProfileEditModal } from "@/components/profile-edit-modal"

export default function AdminHeader() {
  const router = useRouter()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)

  const handleLogout = () => {
    deleteCookie("admin_authenticated")
    router.push("/admin/login")
  }

  const handleProfileClick = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()

      if (data.success) {
        setUserData(data.data)
        setIsProfileModalOpen(true)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  return (
    <>
      <header className="h-16 border-b bg-white flex items-center justify-end px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-estate-gold/20 text-estate-gold">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Мой аккаунт</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                Редактировать профиль
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Настройки</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {userData && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialData={userData}
        />
      )}
    </>
  )
}
