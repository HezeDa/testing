"use client"

import Link from "next/link"
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"

export default function Footer() {
  const { settings, loading } = useSettings()

  if (loading) {
    return null
  }

  return (
    <footer className="w-full border-t bg-estate-black text-white py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="font-playfair text-xl font-bold">{settings?.site_name}</span>
            </div>
            <p className="text-sm opacity-90">{settings?.footer_description}</p>
            {settings?.show_social_in_footer && (
              <div className="flex gap-4">
                {settings?.facebook_url && (
                  <Link href={settings.facebook_url} className="hover:text-estate-gold">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                )}
                {settings?.instagram_url && (
                  <Link href={settings.instagram_url} className="hover:text-estate-gold">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                )}
                {settings?.whatsapp_number && (
                  <Link href={`https://wa.me/${settings.whatsapp_number}`} className="hover:text-estate-gold">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">WhatsApp</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm opacity-90 hover:opacity-100 hover:text-estate-gold">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]">
                  Объекты недвижимости
                </Link>
              </li>
              <li>
                <Link href="/about-cyprus" className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]">
                  О Кипре
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Объекты</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?region=limassol"
                  className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                >
                  Недвижимость в Лимассоле
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?region=paphos"
                  className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                >
                  Недвижимость в Пафосе
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?region=protaras"
                  className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                >
                  Недвижимость в Протарасе
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=villa"
                  className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                >
                  Виллы
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=apartment"
                  className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                >
                  Апартаменты
                </Link>
              </li>
            </ul>
          </div>

          {settings?.show_contact_in_footer && (
            <div className="space-y-4">
              <h3 className="font-playfair text-lg font-semibold">Контакты</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span className="text-sm opacity-90">{settings.address}</span>
                </li>
                {settings.contact_phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-5 w-5 shrink-0" />
                    <a
                      href={`tel:${settings.contact_phone}`}
                      className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                    >
                      {settings.contact_phone}
                    </a>
                  </li>
                )}
                {settings.contact_email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-5 w-5 shrink-0" />
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-sm opacity-90 hover:opacity-100 hover:text-[#FFA500]"
                    >
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.show_working_hours_in_footer && settings.working_hours && (
                  <li className="flex items-start gap-2">
                    <span className="text-sm opacity-90">{settings.working_hours}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs opacity-80">{settings?.footer_copyright || `© ${new Date().getFullYear()} ${settings?.site_name}. Все права защищены.`}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs opacity-80 hover:opacity-100 hover:text-estate-gold">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-xs opacity-80 hover:opacity-100 hover:text-estate-gold">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
