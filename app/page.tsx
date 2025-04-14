import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Umbrella, Shield, Euro, ChevronRight } from "lucide-react"
import PropertySlider from "@/components/property-slider"
import CatalogModal from "@/components/catalog-modal"
import { ContactModal } from "@/components/contact-modal"
import { pool } from "@/lib/db"

async function getFeaturedProperties() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.location,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.slug,
        p.description,
        pi.url as featured_image
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
      WHERE p.featured = true
      ORDER BY p.created_at DESC
      LIMIT 6
    `)
    return result.rows
  } catch (error) {
    console.error("Ошибка при загрузке объектов:", error)
    return []
  }
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px]">
        <Image
          src="/banner.jpg?height=1080&width=1920"
          alt="Элитная вилла на Кипре"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl max-w-4xl font-bold mb-6">
            Инвестируйте в рай: элитная недвижимость на Кипре — ваш ключ к безмятежности
          </h1>
          <p className="max-w-2xl text-lg md:text-xl mb-8 opacity-90">
            Эксклюзивные виллы и апартаменты премиум-класса с видом на Средиземное море
          </p>
          <CatalogModal>
            <Button size="lg" className="bg-estate-gold hover:bg-estate-gold/90 text-black">
              Получить каталог объектов
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CatalogModal>
        </div>
      </section>

      {/* Why Cyprus Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-tight">Почему Кипр?</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Кипр — идеальное место для инвестиций в недвижимость, предлагающее уникальные преимущества
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="rounded-full bg-estate-gold/10 p-3 mb-4">
                <Euro className="h-8 w-8 text-estate-gold" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-2">Налоговые льготы</h3>
              <p className="text-muted-foreground">
                0% налог на недвижимость и одна из самых низких ставок корпоративного налога в Европе (12.5%)
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="rounded-full bg-estate-gold/10 p-3 mb-4">
                <Sun className="h-8 w-8 text-estate-gold" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-2">Идеальный климат</h3>
              <p className="text-muted-foreground">
                340 солнечных дней в году, мягкая зима и комфортное лето с морским бризом
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="rounded-full bg-estate-gold/10 p-3 mb-4">
                <Shield className="h-8 w-8 text-estate-gold" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-2">Безопасность</h3>
              <p className="text-muted-foreground">
                Один из самых низких уровней преступности в Европе и стабильная политическая ситуация
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="rounded-full bg-estate-gold/10 p-3 mb-4">
                <Umbrella className="h-8 w-8 text-estate-gold" />
              </div>
              <h3 className="font-playfair text-xl font-bold mb-2">Качество жизни</h3>
              <p className="text-muted-foreground">
                Чистые пляжи, развитая инфраструктура, международные школы и медицинские центры
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="w-full py-16 md:py-24 bg-estate-light-gray/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-tight">Избранные объекты</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Откройте для себя эксклюзивные объекты недвижимости, доступные для покупки прямо сейчас
            </p>
          </div>

          <PropertySlider properties={featuredProperties} />

          <div className="flex justify-center mt-12">
            <Link href="/properties">
              <Button size="lg" className="bg-estate-black hover:bg-estate-black/90 text-white">
                Смотреть все объекты
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Golden Visa Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-estate-light-gold px-3 py-1 text-sm text-black font-medium">
                Golden Visa
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-tight">
                Гражданство Кипра за инвестиции в недвижимость
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Программа Golden Visa позволяет получить вид на жительство на Кипре при покупке недвижимости от
                €300,000. Через 7 лет постоянного проживания вы можете претендовать на гражданство ЕС.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5" />
                  <span>Вид на жительство для всей семьи</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5" />
                  <span>Безвизовый въезд в более чем 170 стран мира</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5" />
                  <span>Доступ к европейскому образованию и здравоохранению</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-[#0077B6] shrink-0 mt-0.5" />
                  <span>Возможность жить, работать и учиться в любой стране ЕС</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/about-cyprus#golden-visa">
                  <Button className="bg-estate-gold hover:bg-estate-gold/90 text-black">
                    Узнать подробнее
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/image1.jpg?height=800&width=600"
                alt="Паспорт Кипра и ключи от недвижимости"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-estate-black">
        <div className="container px-4 md:px-6 text-white">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-tight">
              Готовы инвестировать в свое будущее на Кипре?
            </h2>
            <p className="max-w-[700px] opacity-90 md:text-lg">
              Наши эксперты помогут вам найти идеальный объект недвижимости и проведут через весь процесс покупки
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <CatalogModal>
                <Button size="lg" className="bg-estate-gold hover:bg-estate-gold/90 text-black">
                  Получить каталог объектов
                </Button>
              </CatalogModal>
              <Link href="/contacts">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-tight">Наш блог</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Полезные статьи о покупке недвижимости и жизни на Кипре
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/blog/how-to-get-cyprus-citizenship" className="group">
              <div className="flex flex-col rounded-lg border bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Как получить гражданство Кипра через недвижимость"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col p-6">
                  <p className="text-sm text-muted-foreground mb-2">12 апреля 2024</p>
                  <h3 className="font-playfair text-xl font-bold mb-2 group-hover:text-[#0077B6]">
                    Как получить гражданство Кипра через недвижимость
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    Подробное руководство по программе Golden Visa и процессу получения гражданства Кипра через
                    инвестиции в недвижимость.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/blog/top-5-areas-for-investment" className="group">
              <div className="flex flex-col rounded-lg border bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Топ-5 районов для инвестиций в 2024 году"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col p-6">
                  <p className="text-sm text-muted-foreground mb-2">28 марта 2024</p>
                  <h3 className="font-playfair text-xl font-bold mb-2 group-hover:text-[#0077B6]">
                    Топ-5 районов для инвестиций в 2024 году
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    Анализ самых перспективных районов Кипра для инвестиций в недвижимость в 2024 году с учетом
                    инфраструктуры и потенциала роста цен.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/blog/tax-benefits-cyprus" className="group">
              <div className="flex flex-col rounded-lg border bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Налоговые преимущества при покупке недвижимости на Кипре"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col p-6">
                  <p className="text-sm text-muted-foreground mb-2">15 февраля 2024</p>
                  <h3 className="font-playfair text-xl font-bold mb-2 group-hover:text-[#0077B6]">
                    Налоговые преимущества при покупке недвижимости на Кипре
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    Обзор налоговых льгот и преимуществ, которые получают владельцы недвижимости на Кипре, включая
                    освобождение от налога на недвижимость.
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-estate-gold text-estate-gold hover:bg-estate-gold hover:text-black"
              >
                Читать все статьи
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Добавляем кнопку и модальное окно */}
      <div className="fixed bottom-8 right-8 z-50">
        <ContactModal />
      </div>
    </div>
  )
}
