"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Property {
  id: number
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  featured_image: string
  slug: string
  description: string
}

interface PropertySliderProps {
  properties: Property[]
}

export default function PropertySlider({ properties = [] }: PropertySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2)
      } else {
        setVisibleCount(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + visibleCount >= properties.length ? 0 : prevIndex + visibleCount
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - visibleCount < 0 ? 
        properties.length - (properties.length % visibleCount || visibleCount) : 
        prevIndex - visibleCount
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Нет доступных объектов</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
        >
          {properties.map((property) => (
            <div 
              key={property.id}
              className="w-full px-4"
              style={{ minWidth: `${100 / visibleCount}%` }}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden group h-full flex flex-col">
                <div className="relative h-64">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-md font-bold">
                      €{property.price.toLocaleString()}
                    </div>
                  </div>
                  <Image
                    src={property.featured_image || '/placeholder.svg'}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-muted-foreground mb-4">{property.location}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {property.description}
                  </p>
                  <div className="flex justify-start items-center mt-auto">
                    <Link href={`/properties/${property.slug}`}>
                      <Button>Подробнее</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
