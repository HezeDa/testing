"use client"

import { useState } from "react"
import { useContactForm } from "@/lib/hooks/use-contact-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface ContactFormProps {
  type?: string
  propertyId?: string
  onSuccess?: () => void
}

export default function ContactForm({ type = "general", propertyId, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [agreed, setAgreed] = useState(false)

  const { submitForm, isLoading, error } = useContactForm()

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Форма отправлена")
    e.preventDefault()
    
    if (!agreed) {
      console.log("Пользователь не согласился с условиями")
      toast.error("Пожалуйста, примите условия обработки персональных данных")
      return
    }
    
    try {
      console.log("Отправка данных формы:", { ...formData, type, propertyId })
      await submitForm({
        ...formData,
        type,
        propertyId,
      })
      
      // Очистка формы после успешной отправки
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
      setAgreed(false)
      
      // Вызов колбэка при успешной отправке
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error("Ошибка в handleSubmit:", err)
      // Ошибка уже обработана в хуке
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Имя *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ваше имя"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Ваш email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ваш телефон"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Сообщение *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Ваше сообщение"
          rows={4}
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => {
            console.log("Согласие изменено:", checked)
            setAgreed(checked as boolean)
          }}
          required
        />
        <Label htmlFor="terms" className="text-sm leading-tight">
          Я согласен на обработку персональных данных и принимаю условия
          <a href="/privacy" className="text-estate-gold hover:underline ml-1">
            политики конфиденциальности
          </a>
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-estate-gold hover:bg-estate-gold/90 text-black"
        disabled={isLoading || !agreed}
      >
        {isLoading ? "Отправка..." : "Отправить сообщение"}
      </Button>

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}
    </form>
  )
}
