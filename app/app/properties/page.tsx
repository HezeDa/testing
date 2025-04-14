import type { Metadata } from "next"
import PropertyCatalog from "@/components/property-catalog"

export const metadata: Metadata = {
  title: "Каталог недвижимости | Cyprus Elite Estates",
  description:
    "Элитная недвижимость на Кипре - виллы, апартаменты и пентхаусы в Лимассоле, Пафосе и Протарасе. Найдите свой идеальный дом на Средиземном море.",
}

export default function PropertiesPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Каталог недвижимости</h1>
        <PropertyCatalog />
      </div>
    </div>
  )
}
