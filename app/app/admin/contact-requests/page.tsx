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

interface ContactRequest {
  id: number
  name: string
  email: string
  phone: string
  message: string
  type: string
  status: string
  notes: string | null
  created_at: string
}

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/contact-requests?page=${page}&limit=10`)
      const data = await response.json()
      
      if (response.ok) {
        setRequests(data.requests)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast.error(data.error || "Ошибка при загрузке заявок")
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Ошибка при загрузке заявок")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [page])

  const handleStatusUpdate = async (requestId: number, status: string, notes: string) => {
    try {
      const response = await fetch("/api/admin/contact-requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: requestId, status, notes }),
      })

      if (response.ok) {
        toast.success("Заявка успешно обновлена")
        fetchRequests()
        setIsEditModalOpen(false)
      } else {
        const data = await response.json()
        toast.error(data.error || "Ошибка при обновлении заявки")
      }
    } catch (error) {
      console.error("Error updating request:", error)
      toast.error("Ошибка при обновлении заявки")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Заявки на контакт</h1>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.name}</h3>
                  <p className="text-sm text-gray-500">{request.email}</p>
                  {request.phone && (
                    <p className="text-sm text-gray-500">{request.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    request.status === "new" ? "bg-blue-100 text-blue-800" :
                    request.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {request.status === "new" ? "Новая" :
                     request.status === "in_progress" ? "В работе" : "Завершена"}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(request.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                  </p>
                </div>
              </div>
              <p className="mt-2">{request.message}</p>
              {request.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
              )}
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSelectedRequest(request)
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
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Редактирование заявки</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <Select
                  defaultValue={selectedRequest.status}
                  onValueChange={(value) => setSelectedRequest({ ...selectedRequest, status: value })}
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
                  value={selectedRequest.notes || ""}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, notes: e.target.value })}
                  placeholder="Добавьте заметки..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(
                    selectedRequest.id,
                    selectedRequest.status,
                    selectedRequest.notes || ""
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