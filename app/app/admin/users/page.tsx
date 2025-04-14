"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LoadingItems } from "@/components/loading-items"
import { MoreHorizontal, Plus, Search } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "user"
  createdAt: string
}

const roleLabels = {
  admin: { label: "Администратор", className: "bg-red-500" },
  manager: { label: "Менеджер", className: "bg-blue-500" },
  user: { label: "Пользователь", className: "bg-green-500" },
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при загрузке пользователей")
      }

      setUsers(data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Не удалось загрузить список пользователей")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при обновлении роли")
      }

      toast.success("Роль пользователя успешно обновлена")
      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Не удалось обновить роль пользователя")
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при удалении пользователя")
      }

      toast.success("Пользователь успешно удален")
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Не удалось удалить пользователя")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) {
    return <LoadingItems />
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Управление пользователями</h1>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск пользователей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {roleFilter === "all"
                ? "Все роли"
                : roleLabels[roleFilter as keyof typeof roleLabels].label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRoleFilter("all")}>
              Все роли
            </DropdownMenuItem>
            {Object.entries(roleLabels).map(([role, { label }]) => (
              <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Дата регистрации</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={roleLabels[user.role].className}>
                    {roleLabels[user.role].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries(roleLabels).map(([role, { label }]) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => handleRoleChange(user.id, role)}
                          disabled={user.role === role}
                        >
                          Изменить роль на {label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 