import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ContactForm from "@/components/contact-form"
import { pool } from "@/lib/db"

export const metadata: Metadata = {
  title: "Контакты | Cyprus Elite Estates",
  description:
    "Свяжитесь с нами для получения информации о недвижимости на Кипре. Наши эксперты помогут вам найти идеальный объект.",
}

async function getSettings() {
  const client = await pool.connect()
  
  try {
    console.log("Fetching site settings...")
    
    const result = await client.query(`
      SELECT 
        site_name,
        address,
        contact_phone,
        contact_email,
        working_hours,
        facebook_url,
        instagram_url,
        whatsapp_number
      FROM settings
      LIMIT 1
    `)
    
    console.log("Settings fetched:", result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return null
  } finally {
    client.release()
  }
}

export default async function ContactsPage() {
  let settings = null
  try {
    settings = await getSettings()
    console.log("Settings in page:", settings)
  } catch (error) {
    console.error("Error in ContactsPage:", error)
  }

  // Если настройки не загружены, показываем запасные значения
  const defaultSettings = {
    address: "28 Октября, Лимассол 3035, Кипр",
    phone: "+357 25 123 456",
    email: "info@cypruseliteestates.com",
    business_hours: "Понедельник - Пятница: 9:00 - 18:00\nСуббота: 10:00 - 14:00\nВоскресенье: Закрыто"
  }

  settings = settings || defaultSettings

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Контакты</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Контактная информация */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="font-playfair text-2xl font-bold mb-6">Наш офис на Кипре</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-estate-gold shrink-0 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Адрес:</p>
                    <p className="text-muted-foreground">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Телефон:</p>
                    <p className="text-muted-foreground">
                      <a href={`tel:${settings.contact_phone}`} className="hover:text-estate-gold">
                        {settings.contact_phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Email:</p>
                    <p className="text-muted-foreground">
                      <a href={`mailto:${settings.contact_email}`} className="hover:text-[#0077B6]">
                        {settings.contact_email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Часы работы:</p>
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: settings.working_hours.replace(/\n/g, "<br>") 
                      }} 
                      className="text-muted-foreground" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="font-playfair text-2xl font-bold mb-6">Наша команда</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Елена Константинидис"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Елена Константинидис</p>
                    <p className="text-sm text-muted-foreground mb-1">Директор по продажам</p>
                    <p className="text-sm">
                      <a href="tel:+35799123456" className="text-estate-gold hover:underline">
                        +357 99 123 456
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Андреас Пападопулос"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Андреас Пападопулос</p>
                    <p className="text-sm text-muted-foreground mb-1">Менеджер по недвижимости</p>
                    <p className="text-sm">
                      <a href="tel:+35799234567" className="text-estate-gold hover:underline">
                        +357 99 234 567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Мария Георгиу"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Мария Георгиу</p>
                    <p className="text-sm text-muted-foreground mb-1">Юридический консультант</p>
                    <p className="text-sm">
                      <a href="tel:+35799345678" className="text-estate-gold hover:underline">
                        +357 99 345 678
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Никос Христодулу"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Никос Христодулу</p>
                    <p className="text-sm text-muted-foreground mb-1">Финансовый консультант</p>
                    <p className="text-sm">
                      <a href="tel:+35799456789" className="text-estate-gold hover:underline">
                        +357 99 456 789
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="font-playfair text-2xl font-bold mb-6">Карта</h2>
              <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Карта расположения офиса Cyprus Elite Estates"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="bg-white/90 px-4 py-2 rounded-lg text-sm">
                    Здесь будет карта Google Maps с расположением офиса
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="font-playfair text-2xl font-bold mb-6">Свяжитесь с нами</h2>
            <p className="text-muted-foreground mb-6">
              Заполните форму ниже, и наш специалист свяжется с вами в ближайшее время для предоставления подробной
              информации о недвижимости на Кипре.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
