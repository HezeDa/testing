import { useState } from "react"
import Image from "next/image"
import { X, Image as ImageIcon, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface PropertyImageCardProps {
  image: {
    url: string
    alt?: string
    is_primary?: boolean
  }
  onRemove: () => void
  onSetPrimary: () => void
  isPrimary: boolean
  id: string
}

export function PropertyImageCard({
  image,
  onRemove,
  onSetPrimary,
  isPrimary,
  id,
}: PropertyImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300",
        isPrimary ? "border-primary" : "border-gray-200",
        isHovered && "shadow-lg",
        isDragging && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Изображение */}
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
          </div>
        )}
        <Image
          src={image.url}
          alt={image.alt || "Изображение объекта"}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            isHovered && "scale-105"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Наложение с кнопками */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-between p-2 sm:p-3",
          isHovered && "opacity-100"
        )}
      >
        {/* Верхняя часть с кнопкой удаления и перетаскивания */}
        <div className="flex justify-between items-start">
          <button
            {...attributes}
            {...listeners}
            className="p-1 sm:p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-grab active:cursor-grabbing"
            aria-label="Перетащить изображение"
          >
            <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onRemove()
            }}
            className="p-1 sm:p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Удалить изображение"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </button>
        </div>

        {/* Нижняя часть с кнопкой установки основного изображения */}
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSetPrimary()
            }}
            className={cn(
              "px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors",
              isPrimary
                ? "bg-primary text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {isPrimary ? "Основное" : "Сделать основным"}
          </button>
        </div>
      </div>

      {/* Индикатор основного изображения */}
      {isPrimary && (
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-primary text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
          Основное
        </div>
      )}
    </div>
  )
} 