"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useContactForm } from "@/lib/hooks/use-contact-form"

export default function CatalogModal({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { submitForm, isLoading, error } = useContactForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreed) {
      return
    }

    try {
      await submitForm({
        name,
        email,
        phone,
        message: "Запрос на получение каталога объектов",
        type: "catalog",
      })
      
      setIsSuccess(true)
      setName("")
      setEmail("")
      setPhone("")
      setAgreed(false)
      
      // Сброс успешного состояния через 3 секунды
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (err) {
      // Ошибка уже обработана в хуке
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Получить каталог объектов</DialogTitle>
          <DialogDescription>
            Заполните форму ниже, и мы отправим вам актуальный каталог элитной недвижимости на Кипре.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Спасибо за запрос!</h3>
            <p className="text-muted-foreground">
              Мы отправили каталог на указанный email. Наш менеджер свяжется с вами в ближайшее время.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                required
              />
              <Label htmlFor="terms" className="text-sm leading-tight">
                Я согласен на обработку персональных данных и принимаю условия
                <a href="/privacy" className="text-estate-gold hover:underline">
                  {" "}
                  политики конфиденциальности
                </a>
              </Label>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full bg-estate-gold hover:bg-estate-gold/90 text-black"
                disabled={isLoading || !agreed}
              >
                {isLoading ? "Отправка..." : "Получить каталог"}
              </Button>
            </DialogFooter>
            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
