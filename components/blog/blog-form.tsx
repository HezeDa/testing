"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  slug: z.string().min(1, "URL-адрес обязателен"),
  excerpt: z.string().min(1, "Краткое описание обязательно"),
  content: z.string().min(1, "Содержание обязательно"),
  category_id: z.number().min(1, "Категория обязательна"),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  featured_image: z.string().optional(),
  published_at: z.string().optional(),
})

type BlogFormValues = z.infer<typeof formSchema>

interface BlogFormProps {
  initialData?: {
    title: string
    slug: string
    excerpt: string
    content: string
    category_id: number
    status: "draft" | "published"
    featured: boolean
    featured_image?: string
    published_at?: string
  }
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category_id: 1,
      status: "draft",
      featured: false,
      featured_image: "",
      published_at: new Date().toISOString(),
    },
  })

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setLoading(true)
      const url = initialData?.slug 
        ? `/api/admin/blog/${initialData.slug}`
        : "/api/admin/blog"
      
      const method = initialData?.slug ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Ошибка при сохранении статьи")
      }

      toast.success(
        initialData?.slug 
          ? "Статья успешно обновлена" 
          : "Статья успешно создана"
      )
      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      toast.error("Произошла ошибка при сохранении статьи")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название статьи</FormLabel>
              <FormControl>
                <Input placeholder="Введите название статьи" {...field} />
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
                <Input placeholder="Введите URL-адрес" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Краткое описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите краткое описание статьи"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Содержание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите содержание статьи"
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value ? field.value.toString() : "1"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Юридические вопросы</SelectItem>
                  <SelectItem value="2">Инвестиции</SelectItem>
                  <SelectItem value="3">Налоги</SelectItem>
                  <SelectItem value="4">Покупка недвижимости</SelectItem>
                  <SelectItem value="5">Образ жизни</SelectItem>
                  <SelectItem value="6">Аналитика рынка</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="published">Опубликовано</SelectItem>
                </SelectContent>
              </Select>
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
                <FormLabel>
                  Отметить как избранную статью
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Главное изображение</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="URL главного изображения"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата публикации</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData?.slug ? "Обновить статью" : "Создать статью"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 