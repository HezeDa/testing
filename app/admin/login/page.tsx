"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Отправка запроса на аутентификацию...")

      // Отправляем запрос на API для аутентификации
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      })

      console.log("Статус ответа:", response.status)

      const data = await response.json()
      console.log("Данные ответа:", data)

      if (!response.ok) {
        throw new Error(data.error || "Ошибка аутентификации")
      }

      console.log("Аутентификация успешна, перенаправление...")
      // Перенаправляем на панель управления
      router.push("/admin")
    } catch (error) {
      console.error("Ошибка при входе:", error)
      setError(error instanceof Error ? error.message : "Неверное имя пользователя или пароль")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-estate-cream">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-estate-gold/20 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-estate-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Cyprus Elite Estates</CardTitle>
          <CardDescription className="text-center">Вход в панель управления</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-md">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-estate-gold hover:bg-estate-gold/90 text-black"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
