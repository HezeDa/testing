import { useState } from "react"
import { toast } from "sonner"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  type?: string
  propertyId?: string
}

export function useContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitForm = async (data: ContactFormData) => {
    console.log("Начало отправки формы:", data)
    setIsLoading(true)
    setError(null)

    try {
      console.log("Отправка запроса на /api/contact")
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("Получен ответ:", response.status)
      const result = await response.json()
      console.log("Результат:", result)

      if (!response.ok) {
        throw new Error(result.error || "Произошла ошибка при отправке формы")
      }

      toast.success("Ваше сообщение успешно отправлено")
      return result
    } catch (err) {
      console.error("Ошибка при отправке формы:", err)
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    submitForm,
    isLoading,
    error,
  }
} 