"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingItems } from "@/components/loading-items"

interface Settings {
  // Основные настройки
  site_name: string
  meta_description: string
  meta_keywords: string
  maintenance_mode: boolean

  // Контактная информация
  contact_email: string
  contact_phone: string
  address: string
  working_hours: string

  // Социальные сети
  facebook_url: string
  instagram_url: string
  whatsapp_number: string

  // Шапка сайта
  header_phone: string
  header_email: string
  show_social_in_header: boolean

  // Подвал сайта
  footer_description: string
  footer_copyright: string
  show_social_in_footer: boolean
  show_contact_in_footer: boolean
  show_working_hours_in_footer: boolean
}

export default function SettingsPage() {
  const defaultSettings: Settings = {
    // Основные настройки
    site_name: "",
    meta_description: "",
    meta_keywords: "",
    maintenance_mode: false,

    // Контактная информация
    contact_email: "",
    contact_phone: "",
    address: "",
    working_hours: "",

    // Социальные сети
    facebook_url: "",
    instagram_url: "",
    whatsapp_number: "",

    // Шапка сайта
    header_phone: "",
    header_email: "",
    show_social_in_header: true,

    // Подвал сайта
    footer_description: "",
    footer_copyright: "",
    show_social_in_footer: true,
    show_contact_in_footer: true,
    show_working_hours_in_footer: true,
  }

  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при загрузке настроек")
      }

      // Преобразуем null значения в пустые строки
      const formattedData = {
        ...defaultSettings,
        ...data.data,
        meta_description: data.data.meta_description ?? "",
        meta_keywords: data.data.meta_keywords ?? "",
        working_hours: data.data.working_hours ?? "",
        facebook_url: data.data.facebook_url ?? "",
        instagram_url: data.data.instagram_url ?? "",
        whatsapp_number: data.data.whatsapp_number ?? "",
        footer_description: data.data.footer_description ?? "",
        footer_copyright: data.data.footer_copyright ?? "",
      }

      setSettings(formattedData)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Не удалось загрузить настройки")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Подготавливаем данные для отправки
      const dataToSend = {
        ...settings,
        // Преобразуем пустые строки в null для необязательных полей
        meta_description: settings.meta_description || null,
        meta_keywords: settings.meta_keywords || null,
        working_hours: settings.working_hours || null,
        facebook_url: settings.facebook_url || null,
        instagram_url: settings.instagram_url || null,
        whatsapp_number: settings.whatsapp_number || null,
        footer_description: settings.footer_description || null,
        footer_copyright: settings.footer_copyright || null,
      }

      console.log("Отправляемые данные:", dataToSend)

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при сохранении настроек")
      }

      // После успешного сохранения обновляем состояние
      const formattedData = {
        ...defaultSettings,
        ...data.data,
        meta_description: data.data.meta_description ?? "",
        meta_keywords: data.data.meta_keywords ?? "",
        working_hours: data.data.working_hours ?? "",
        facebook_url: data.data.facebook_url ?? "",
        instagram_url: data.data.instagram_url ?? "",
        whatsapp_number: data.data.whatsapp_number ?? "",
        footer_description: data.data.footer_description ?? "",
        footer_copyright: data.data.footer_copyright ?? "",
      }

      setSettings(formattedData)
      toast.success("Настройки успешно сохранены")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить настройки")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  if (loading) {
    return <LoadingItems />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Настройки сайта</h1>
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Основные настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Название сайта</Label>
              <Input
                id="site_name"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                value={settings.meta_description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                name="meta_keywords"
                value={settings.meta_keywords}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onCheckedChange={handleSwitchChange("maintenance_mode")}
              />
              <Label htmlFor="maintenance_mode">Режим обслуживания</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Шапка сайта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="header_phone">Телефон в шапке</Label>
              <Input
                id="header_phone"
                name="header_phone"
                value={settings.header_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="header_email">Email в шапке</Label>
              <Input
                id="header_email"
                name="header_email"
                type="email"
                value={settings.header_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show_social_in_header"
                checked={settings.show_social_in_header}
                onCheckedChange={handleSwitchChange("show_social_in_header")}
              />
              <Label htmlFor="show_social_in_header">Показывать социальные сети в шапке</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email для связи</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={settings.contact_email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Телефон</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Textarea
                id="address"
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="working_hours">Часы работы</Label>
              <Input
                id="working_hours"
                name="working_hours"
                value={settings.working_hours}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Социальные сети</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input
                id="facebook_url"
                name="facebook_url"
                type="url"
                value={settings.facebook_url}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                type="url"
                value={settings.instagram_url}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp номер</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Подвал сайта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footer_description">Описание в подвале</Label>
              <Textarea
                id="footer_description"
                name="footer_description"
                value={settings.footer_description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footer_copyright">Текст копирайта</Label>
              <Input
                id="footer_copyright"
                name="footer_copyright"
                value={settings.footer_copyright}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_social_in_footer"
                  checked={settings.show_social_in_footer}
                  onCheckedChange={handleSwitchChange("show_social_in_footer")}
                />
                <Label htmlFor="show_social_in_footer">Показывать социальные сети</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_contact_in_footer"
                  checked={settings.show_contact_in_footer}
                  onCheckedChange={handleSwitchChange("show_contact_in_footer")}
                />
                <Label htmlFor="show_contact_in_footer">Показывать контактную информацию</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_working_hours_in_footer"
                  checked={settings.show_working_hours_in_footer}
                  onCheckedChange={handleSwitchChange("show_working_hours_in_footer")}
                />
                <Label htmlFor="show_working_hours_in_footer">Показывать часы работы</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
