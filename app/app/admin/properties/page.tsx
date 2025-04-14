"use client"

import { useEffect, useState } from "react"
import { Property } from "@/types"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { LoadingItems } from "@/components/loading-items"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || "Ошибка при загрузке данных")
      }
      
      setProperties(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleDelete = async () => {
    if (!deleteSlug) return

    try {
      const response = await fetch(`/api/admin/properties/${deleteSlug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Ошибка при удалении объекта")
      }

      toast({
        title: "Успешно",
        description: "Объект был удален",
      })

      // Обновляем список объектов
      fetchProperties()
    } catch (error) {
      console.error("Ошибка при удалении:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить объект",
      })
    } finally {
      setDeleteSlug(null)
    }
  }

  if (loading) {
    return <LoadingItems />
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Объекты недвижимости</h1>
        <Link href="/admin/properties/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить объект
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Изображение</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Локация</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Спальни</TableHead>
            <TableHead>Ванные</TableHead>
            <TableHead>Площадь</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <img
                  src={property.image_url || "/placeholder.svg"}
                  alt={property.title}
                  className="h-12 w-12 rounded-md object-cover"
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{property.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {property.bedrooms} спален • {property.bathrooms} ванных • {property.area} м²
                  </p>
                </div>
              </TableCell>
              <TableCell>{property.location}</TableCell>
              <TableCell>
                <Badge variant={property.type === 'villa' ? 'default' : 'secondary'}>
                  {property.type === 'villa' ? 'Вилла' : 'Апартаменты'}
                </Badge>
              </TableCell>
              <TableCell>{formatPrice(property.price)}</TableCell>
              <TableCell>
                <Badge variant={property.status === 'active' ? 'default' : 'destructive'}>
                  {property.status === 'active' ? 'Активен' : 'Неактивен'}
                </Badge>
              </TableCell>
              <TableCell>{property.bedrooms}</TableCell>
              <TableCell>{property.bathrooms}</TableCell>
              <TableCell>{property.area} м²</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/properties/${property.slug}`}>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white hover:bg-red-50"
                    onClick={() => setDeleteSlug(property.slug)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Объект будет удален безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
