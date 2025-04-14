import { useEffect, useState } from "react"

interface Settings {
  site_name: string
  meta_description: string
  meta_keywords: string
  maintenance_mode: boolean
  contact_email: string
  contact_phone: string
  address: string
  working_hours: string
  facebook_url: string
  instagram_url: string
  whatsapp_number: string
  header_phone: string
  header_email: string
  show_social_in_header: boolean
  footer_description: string
  footer_copyright: string
  show_social_in_footer: boolean
  show_contact_in_footer: boolean
  show_working_hours_in_footer: boolean
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings")
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Ошибка при загрузке настроек")
        }

        setSettings(data.data)
        setError(null)
      } catch (error) {
        console.error("Error fetching settings:", error)
        setError("Не удалось загрузить настройки")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
} 