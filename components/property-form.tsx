"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { DraggableImageGrid, PropertyImage } from "@/components/draggable-image-grid"

interface PropertyFormProps {
  slug?: string
}

interface PropertyFormData {
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
  images: Array<{
    id?: number
    url: string
    alt?: string
    is_primary: boolean
  }>
  features: string[]
}

export function PropertyForm({ slug }: PropertyFormProps) {
  const isNew = !slug
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    slug: "",
    description: "",
    location: "",
    region: "",
    price: 0,
    type: "apartment",
    status: "active",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    featured: false,
    images: [],
    features: []
  })
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (!isNew && slug) {
      console.log('Fetching property with slug:', slug)
      fetchProperty()
    }
  }, [isNew, slug])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      console.log('Making API request to:', `/api/admin/properties/${slug}`)
      const response = await fetch(`/api/admin/properties/${slug}`)
      const data = await response.json()
      console.log('API response:', data)

      if (!data.success) {
        throw new Error(data.error || "Ошибка при загрузке данных")
      }

      if (!data.data) {
        throw new Error("Данные не получены")
      }

      const propertyData = data.data

      // Преобразуем данные в нужный формат
      const formattedData: PropertyFormData = {
        title: propertyData.title || "",
        slug: propertyData.slug || "",
        description: propertyData.description || "",
        location: propertyData.location || "",
        region: propertyData.region || "",
        price: Number(propertyData.price) || 0,
        type: propertyData.type || "apartment",
        status: propertyData.status || "active",
        bedrooms: Number(propertyData.bedrooms) || 1,
        bathrooms: Number(propertyData.bathrooms) || 1,
        area: Number(propertyData.area) || 0,
        featured: Boolean(propertyData.featured),
        images: Array.isArray(propertyData.images) 
          ? propertyData.images.map((img: any) => ({
              id: img.id,
              url: img.url,
              alt: img.alt || "",
              is_primary: Boolean(img.is_primary)
            }))
          : [],
        features: Array.isArray(propertyData.features) ? propertyData.features : []
      }

      console.log('Setting form data:', formattedData)
      setFormData(formattedData)
    } catch (err) {
      console.error('Error fetching property:', err)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Произошла ошибка при загрузке",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/properties${isNew ? "" : `/${slug}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при сохранении")
      }

      toast({
        title: "Успешно",
        description: isNew ? "Объект создан" : "Изменения сохранены",
      })

      router.push("/admin/properties")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Произошла ошибка при сохранении",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploadingImages(true)
    try {
      const uploadedImages = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const uploadFormData = new FormData()
          uploadFormData.append("file", file)

          const res = await fetch("/api/admin/properties/upload", {
            method: "POST",
            body: uploadFormData,
          })

          if (!res.ok) {
            throw new Error("Ошибка при загрузке изображения")
          }

          const data = await res.json()
          return {
            url: data.url,
            alt: file.name,
            is_primary: formData.images.length === 0 && e.target.files!.length === 1,
          }
        })
      )

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображения",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
      if (e.target) {
        e.target.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleImagesChange = (newImages: PropertyImage[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages.map((img, index) => ({
        ...img,
        is_primary: index === 0
      }))
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full flex flex-wrap">
          <TabsTrigger value="general" className="flex-1 min-w-[120px]">Основная информация</TabsTrigger>
          <TabsTrigger value="images" className="flex-1 min-w-[120px]">Изображения</TabsTrigger>
          <TabsTrigger value="features" className="flex-1 min-w-[120px]">Особенности</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL-slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Select
                value={formData.region || ""}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limassol">Лимассол</SelectItem>
                  <SelectItem value="nicosia">Никосия</SelectItem>
                  <SelectItem value="larnaca">Ларнака</SelectItem>
                  <SelectItem value="paphos">Пафос</SelectItem>
                  <SelectItem value="ayia-napa">Айя-Напа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Цена (€)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Тип</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa">Вилла</SelectItem>
                  <SelectItem value="apartment">Апартаменты</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Спальни</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Ванные</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Площадь (м²)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="featured">Отметить как избранное</Label>
              </div>
              <p className="text-sm text-gray-500">
                Избранные объекты отображаются на главной странице сайта.
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[200px] w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 text-center px-4">
                    <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG или JPEG</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <DraggableImageGrid
              images={formData.images}
              onImagesChange={handleImagesChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="features">
          {/* ... existing features content ... */}
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/properties")}
          className="w-full sm:w-auto"
        >
          Отмена
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Сохранение..." : (isNew ? "Создать" : "Сохранить")}
        </Button>
      </div>
    </form>
  )
}