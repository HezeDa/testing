"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Phone, Mail, ChevronRight } from "lucide-react"
import PropertyGallery from "@/components/property-gallery"
import ContactForm from "@/components/contact-form"

interface Property {
  id: number
  title: string
  slug: string
  description: string
  location: string
  region: string
  price: number
  type: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  featured: boolean
  primary_image: string
  images: Array<{
    url: string
    alt?: string
    is_primary: boolean
  }>
}

interface PropertyDetailsProps {
  property: Property
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      {/* Навигация */}
      <div className="mb-6">
        <Link
          href="/properties"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-[#0077B6]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться к каталогу
        </Link>
      </div>

      {/* Заголовок и основная информация */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <div className="inline-block bg-estate-light-gold text-black font-medium px-4 py-2 rounded-md text-lg">
          {formatPrice(property.price)}
        </div>
      </div>

      {/* Галерея */}
      <PropertyGallery images={property.images} title={property.title} />

      {/* Основная информация и контакты */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          {/* Характеристики */}
          <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
            <h2 className="font-playfair text-2xl font-bold mb-6">Характеристики</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-estate-gold/10 rounded-lg">
                <Bed className="h-6 w-6 text-estate-gold mb-2" />
                <span className="text-sm text-muted-foreground">Спальни</span>
                <span className="font-bold">{property.bedrooms}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-estate-gold/10 rounded-lg">
                <Bath className="h-6 w-6 text-estate-gold mb-2" />
                <span className="text-sm text-muted-foreground">Ванные</span>
                <span className="font-bold">{property.bathrooms}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-estate-gold/10 rounded-lg">
                <Maximize className="h-6 w-6 text-estate-gold mb-2" />
                <span className="text-sm text-muted-foreground">Площадь</span>
                <span className="font-bold">{property.area} м²</span>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
            <h2 className="font-playfair text-2xl font-bold mb-4">Описание</h2>
            <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
          </div>
        </div>

        {/* Контактная форма */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="font-playfair text-xl font-bold mb-4">Запросить информацию</h2>
            <ContactForm propertyId={property.id.toString()} />
          </div>
        </div>
      </div>
    </>
  )
} 