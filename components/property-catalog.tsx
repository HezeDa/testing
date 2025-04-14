"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Bed, Bath, Ruler, MapPin, Maximize } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

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
}

interface PropertyFilters {
  type: string
  region: string
  minPrice: string
  maxPrice: string
  bedrooms: string
  status: string
}

export default function PropertyCatalog() {
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PropertyFilters>({
    type: "all",
    region: "all",
    minPrice: "0",
    maxPrice: "5000000",
    bedrooms: "all",
    status: "active",
  })

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      
      if (data.success) {
        setAllProperties(data.data)
        setFilteredProperties(data.data)
      } else {
        console.error("Error fetching properties:", data.error)
        setAllProperties([])
        setFilteredProperties([])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      setAllProperties([])
      setFilteredProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    const filtered = allProperties.filter(property => {
      const matchesType = filters.type === "all" || property.type === filters.type
      const matchesRegion = filters.region === "all" || property.region === filters.region
      const matchesPrice = property.price >= Number(filters.minPrice) && property.price <= Number(filters.maxPrice)
      const matchesBedrooms = filters.bedrooms === "all" || 
        (filters.bedrooms === "4" ? property.bedrooms >= 4 : property.bedrooms === Number(filters.bedrooms))
      const matchesStatus = property.status === filters.status

      return matchesType && matchesRegion && matchesPrice && matchesBedrooms && matchesStatus
    })

    setFilteredProperties(filtered)
  }, [filters, allProperties])

  const handleFilterChange = (key: keyof PropertyFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: value[0].toString(),
      maxPrice: value[1].toString()
    }))
  }

  const resetFilters = () => {
    setFilters({
      type: "all",
      region: "all",
      minPrice: "0",
      maxPrice: "5000000",
      bedrooms: "all",
      status: "active",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Фильтры */}
      <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg border shadow-sm h-fit">
        <h2 className="font-playfair text-xl font-bold mb-6">Фильтры</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Регион</label>
            <Select 
              value={filters.region} 
              onValueChange={(value) => handleFilterChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все регионы</SelectItem>
                <SelectItem value="limassol">Лимассол</SelectItem>
                <SelectItem value="paphos">Пафос</SelectItem>
                <SelectItem value="protaras">Протарас</SelectItem>
                <SelectItem value="larnaca">Ларнака</SelectItem>
                <SelectItem value="nicosia">Никосия</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Тип недвижимости</label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="villa">Виллы</SelectItem>
                <SelectItem value="apartment">Апартаменты</SelectItem>
                <SelectItem value="townhouse">Таунхаусы</SelectItem>
                <SelectItem value="penthouse">Пентхаусы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Количество спален</label>
            <Select 
              value={filters.bedrooms} 
              onValueChange={(value) => handleFilterChange("bedrooms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите количество" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любое</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Цена</label>
              <span className="text-xs text-muted-foreground">
                {formatPrice(Number(filters.minPrice))} - {formatPrice(Number(filters.maxPrice))}
              </span>
            </div>
            <Slider
              defaultValue={[0, 5000000]}
              min={0}
              max={5000000}
              step={100000}
              value={[Number(filters.minPrice), Number(filters.maxPrice)]}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
          </div>

          <Button
            className="w-full bg-estate-gold hover:bg-estate-gold/90 text-black"
            onClick={resetFilters}
          >
            Сбросить фильтры
          </Button>
        </div>
      </div>

      {/* Список объектов */}
      <div className="w-full lg:w-3/4">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6]"></div>
          </div>
        ) : filteredProperties && filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={property.primary_image || "/placeholder.jpg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#0077B6] font-semibold">
                        {formatPrice(property.price)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Maximize className="h-4 w-4 mr-1" />
                          <span>{property.area} м²</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-estate-gold hover:bg-estate-gold/90 text-black">
                      Подробнее
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Объекты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
