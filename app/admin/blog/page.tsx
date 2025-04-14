"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pencil, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { LoadingItems } from "@/components/loading-items"

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  status: string
  created_at: string
}

export default function BlogPage() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/blog")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при загрузке статей")
      }

      setPosts(data.data)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Произошла ошибка при загрузке статей",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту статью?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Ошибка при удалении статьи")
      }

      toast({
        title: "Успешно",
        description: "Статья удалена",
      })

      fetchPosts()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Произошла ошибка при удалении статьи",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Блог</h1>
        <Link href="/admin/blog/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Добавить статью
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingItems />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>URL-slug</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.slug}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/blog/${post.slug}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(post.slug)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
