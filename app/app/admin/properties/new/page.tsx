"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { DraggableImageGrid, PropertyImage } from "@/components/draggable-image-grid"

// Схема валидации формы
const formSchema = z.object({
  title: z.string().min(3, "Название должно содержать не менее 3 символов"),
  slug: z.string().min(3, "URL должен содержать не менее 3 символов"),
  description: z.string().min(10, "Описание должно содержать не менее 10 символов"),
  price: z.coerce.number().min(1, "Введите корректную цену"),
  type: z.string().min(1, "Выберите тип объекта"),
  status: z.string().min(1, "Выберите статус"),
  region: z.string().min(1, "Выберите регион"),
  location: z.string().min(3, "Введите местоположение"),
  bedrooms: z.coerce.number().min(0, "Введите корректное число спален"),
  bathrooms: z.coerce.number().min(0, "Введите корректное число ванных комнат"),
  area: z.coerce.number().min(1, "Введите корректную площадь"),
  featured: z.boolean().default(false),
  pool: z.boolean().default(false),
  garden: z.boolean().default(false),
  garage: z.boolean().default(false),
  seaView: z.boolean().default(false),
  airConditioning: z.boolean().default(false),
  heating: z.boolean().default(false),
})

export default function NewPropertyPage() {
  const router = useRouter()
  const [images, setImages] = useState<PropertyImage[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      type: "",
      status: "active",
      region: "",
      location: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      featured: false,
      pool: false,
      garden: false,
      garage: false,
      seaView: false,
      airConditioning: false,
      heating: false,
    },
  })

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures((prev) => [...prev, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploadingImages(true)
    try {
      const uploadedImages = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const res = await fetch("/api/admin/properties/upload", {
            method: "POST",
            body: formData,
          })

          if (!res.ok) {
            throw new Error("Ошибка при загрузке изображения")
          }

          const data = await res.json()
          return {
            url: data.url,
            alt: file.name,
            is_primary: images.length === 0 && e.target.files!.length === 1, // Первое изображение основное, если это первая загрузка
          }
        })
      )

      setImages((prev) => [...prev, ...uploadedImages])
      toast({
        title: "Изображения загружены",
        description: `Успешно загружено ${uploadedImages.length} изображений`,
      })
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (images.length === 0) {
      toast({
        title: "Ошибка",
        description: "Загрузите хотя бы одно изображение",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const dataToSend = {
        ...values,
        images: images.map(img => ({
          url: img.url,
          alt: img.alt || "",
          is_primary: img.is_primary || false
        })),
        features,
      }

      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!res.ok) {
        throw new Error("Ошибка при сохранении объекта")
      }

      const result = await res.json()

      if (result.success) {
        toast({
          title: "Объект создан",
          description: "Объект недвижимости успешно создан",
        })
        router.push("/admin/properties")
      } else {
        throw new Error(result.error || "Ошибка при сохранении объекта")
      }
    } catch (error) {
      console.error("Ошибка при сохранении объекта:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при сохранении объекта",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Добавление нового объекта</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Назад
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Основная информация */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Основная информация</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название объекта</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Например: Роскошная вилла с видом на море" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL-адрес</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Например: roskoshnaya-villa-s-vidom-na-more" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип объекта</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Апартаменты</SelectItem>
                        <SelectItem value="villa">Вилла</SelectItem>
                        <SelectItem value="house">Дом</SelectItem>
                        <SelectItem value="penthouse">Пентхаус</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регион</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите регион" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="limassol">Лимассол</SelectItem>
                        <SelectItem value="paphos">Пафос</SelectItem>
                        <SelectItem value="larnaca">Ларнака</SelectItem>
                        <SelectItem value="famagusta">Фамагуста</SelectItem>
                        <SelectItem value="nicosia">Никосия</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Точный адрес</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Например: Лимассол, район Аматус" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (€)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Например: 1500000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус публикации</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Активен</SelectItem>
                        <SelectItem value="draft">Черновик</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Подробное описание объекта недвижимости..."
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Отметить как избранное</FormLabel>
                    <FormDescription>
                      Избранные объекты отображаются на главной странице сайта.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Характеристики объекта */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Характеристики объекта</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество спален</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество ванных комнат</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Площадь (м²)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pool"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Бассейн</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garden"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Сад</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Гараж</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seaView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Вид на море</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="airConditioning"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Кондиционер</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heating"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Отопление</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Изображения */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Изображения</h2>
                <p className="text-sm text-gray-500">
                  Загрузите изображения объекта. Первое изображение будет основным.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploadingImages}
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить изображения
                  </>
                )}
              </Button>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImages}
              />
            </div>

            <DraggableImageGrid images={images} onImagesChange={setImages} />
          </div>

          {/* Особенности */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Особенности</h2>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Введите особенность объекта"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button type="button" onClick={addFeature}>
                Добавить
              </Button>
            </div>

            {features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Отмена
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Создание...
                </>
              ) : (
                "Создать объект"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
