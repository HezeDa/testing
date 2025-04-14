"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { setCookie } from "cookies-next"

export default function SimpleAdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Простая проверка пароля (не рекомендуется для продакшена)
      if (password === "admin123") {
        // Устанавливаем cookie напрямую
        setCookie("admin_authenticated", "true", {
          maxAge: 60 * 60 * 24, // 1 день
          path: "/",
        })

        // Просто перезагружаем страницу
        window.location.reload()
      } else {
        setError("Неверный пароль")
      }
    } catch (error) {
      setError("Ошибка при входе")
      console.error(error)
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
          <CardDescription className="text-center">Упрощенный вход в панель управления</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-md">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Используйте пароль: admin123</p>
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
