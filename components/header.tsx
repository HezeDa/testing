"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Building2, Info, Phone, FileText, Menu, X, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/lib/hooks/use-settings"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { settings, loading } = useSettings()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-estate-cream/95 backdrop-blur supports-[backdrop-filter]:bg-estate-cream/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-estate-gold" />
          <span className="font-playfair text-xl font-bold text-estate-black">
            {loading ? "" : settings?.site_name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold">
            <Home className="h-4 w-4" />
            <span>Главная</span>
          </Link>
          <Link href="/properties" className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold">
            <Building2 className="h-4 w-4" />
            <span>Объекты</span>
          </Link>
          <Link href="/about-cyprus" className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold">
            <Info className="h-4 w-4" />
            <span>О Кипре</span>
          </Link>
          <Link href="/blog" className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold">
            <FileText className="h-4 w-4" />
            <span>Блог</span>
          </Link>
          <Link href="/contacts" className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold">
            <Phone className="h-4 w-4" />
            <span>Контакты</span>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!loading && settings?.show_social_in_header && (
            <>
              {settings.header_phone && (
                <a
                  href={`tel:${settings.header_phone}`}
                  className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold"
                >
                  <Phone className="h-4 w-4" />
                  <span>{settings.header_phone}</span>
                </a>
              )}
              {settings.header_email && (
                <a
                  href={`mailto:${settings.header_email}`}
                  className="flex items-center gap-1 text-sm font-medium hover:text-estate-gold"
                >
                  <Mail className="h-4 w-4" />
                  <span>{settings.header_email}</span>
                </a>
              )}
            </>
          )}
          <Button className="bg-estate-gold hover:bg-estate-gold/90 text-black">Получить каталог</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 bg-estate-cream shadow-lg md:hidden",
          isMenuOpen ? "flex flex-col" : "hidden"
        )}
      >
        <nav className="flex flex-col p-6 space-y-4 bg-estate-cream">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Главная</span>
          </Link>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Building2 className="h-5 w-5" />
            <span>Объекты</span>
          </Link>
          <Link
            href="/about-cyprus"
            className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info className="h-5 w-5" />
            <span>О Кипре</span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>Блог</span>
          </Link>
          <Link
            href="/contacts"
            className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Phone className="h-5 w-5" />
            <span>Контакты</span>
          </Link>
          {!loading && settings?.show_social_in_header && (
            <>
              {settings.header_phone && (
                <a
                  href={`tel:${settings.header_phone}`}
                  className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
                >
                  <Phone className="h-5 w-5" />
                  <span>{settings.header_phone}</span>
                </a>
              )}
              {settings.header_email && (
                <a
                  href={`mailto:${settings.header_email}`}
                  className="flex items-center gap-2 text-lg font-medium p-2 hover:bg-estate-gold/10 rounded-md"
                >
                  <Mail className="h-5 w-5" />
                  <span>{settings.header_email}</span>
                </a>
              )}
            </>
          )}
          <Button className="mt-4 bg-estate-gold hover:bg-estate-gold/90 text-black">Получить каталог</Button>
        </nav>
      </div>
    </header>
  )
}
