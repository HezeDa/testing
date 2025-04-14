"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  message: string
  status: string
  notes: string | null
  created_at: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/inquiries?page=${page}&limit=10`)
      const data = await response.json()
      
      if (response.ok) {
        setInquiries(data.inquiries)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.error || "Ошибка при загрузке заявок")
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error)
      toast.error("Ошибка при загрузке заявок")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [page])

  const handleStatusUpdate = async (inquiryId: number, status: string, notes: string) => {
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: inquiryId, status, notes }),
      })

      if (response.ok) {
        toast.success("Заявка успешно обновлена")
        fetchInquiries()
        setIsEditModalOpen(false)
      } else {
        const data = await response.json()
        toast.error(data.error || "Ошибка при обновлении заявки")
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
      toast.error("Ошибка при обновлении заявки")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Заявки</h1>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{inquiry.name}</h3>
                  <p className="text-sm text-gray-500">{inquiry.email}</p>
                  <p className="text-sm text-gray-500">{inquiry.phone}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    inquiry.status === "new" ? "bg-blue-100 text-blue-800" :
                    inquiry.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {inquiry.status === "new" ? "Новая" :
                     inquiry.status === "in_progress" ? "В работе" : "Завершена"}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(inquiry.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                  </p>
                </div>
              </div>
              <p className="mt-2">{inquiry.message}</p>
              {inquiry.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">{inquiry.notes}</p>
                </div>
              )}
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSelectedInquiry(inquiry)
                  setIsEditModalOpen(true)
                }}
              >
                Редактировать
              </Button>
            </div>
          ))}

          <div className="flex justify-center space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Назад
            </Button>
            <span className="py-2">
              Страница {page} из {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование заявки</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <Select
                  defaultValue={selectedInquiry.status}
                  onValueChange={(value) => setSelectedInquiry({ ...selectedInquiry, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="completed">Завершена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Заметки</label>
                <Textarea
                  value={selectedInquiry.notes || ""}
                  onChange={(e) => setSelectedInquiry({ ...selectedInquiry, notes: e.target.value })}
                  placeholder="Добавьте заметки..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(
                    selectedInquiry.id,
                    selectedInquiry.status,
                    selectedInquiry.notes || ""
                  )}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
