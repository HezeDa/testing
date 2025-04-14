"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Maximize2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSwipeable } from "react-swipeable"
import { GalleryPagination } from "./gallery-pagination"

interface Image {
  id?: number
  url: string
  alt?: string
  is_primary: boolean
}

interface PropertyGalleryProps {
  images: Image[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  console.log('PropertyGallery received images:', images);
  console.log('PropertyGallery received title:', title);

  if (!images || images.length === 0) {
    console.log('No images available');
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Нет доступных изображений</p>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const MAX_VISIBLE_THUMBNAILS = 4

  // Добавляем логирование для отладки
  useEffect(() => {
    console.log('Gallery received props:', {
      title,
      imagesCount: images?.length || 0,
      images
    })
  }, [images, title])

  // Предзагрузка изображений
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((img) => {
        return new Promise((resolve, reject) => {
          const imgElement = document.createElement('img')
          imgElement.src = img.url
          imgElement.onload = resolve
          imgElement.onerror = reject
        })
      })

      try {
        await Promise.all(imagePromises)
        setIsLoading(false)
      } catch (error) {
        console.error("Ошибка при загрузке изображений:", error)
        setIsLoading(false)
      }
    }

    preloadImages()
  }, [images])

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true)
      setSwipeOffset(eventData.deltaX)
    },
    onSwiped: (eventData) => {
      setIsSwiping(false)
      setSwipeOffset(0)
      if (Math.abs(eventData.deltaX) > 50) {
        if (eventData.deltaX > 0) {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        } else {
          setCurrentIndex((prev) => (prev + 1) % images.length)
        }
      }
    },
    trackMouse: true
  })

  const openModal = () => {
    console.log('Opening modal with images:', images)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  if (isLoading) {
    return (
      <div className="relative h-[300px] md:h-[600px] w-full rounded-lg overflow-hidden bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-estate-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Миниатюры - скрываем на мобильных */}
        <div className="hidden md:flex flex-col gap-2 w-32">
          {images.slice(0, MAX_VISIBLE_THUMBNAILS).map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden cursor-pointer group/thumb transition-all duration-300",
                currentIndex === index 
                  ? "ring-2 ring-estate-gold scale-105" 
                  : "hover:ring-2 hover:ring-estate-gold/50 hover:scale-105"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} - фото ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                sizes="128px"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
          
          {/* Кнопка просмотра всех изображений */}
          {images.length > MAX_VISIBLE_THUMBNAILS && (
            <div
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group/thumb transition-all duration-300 bg-gray-100 hover:bg-gray-200"
              onClick={openModal}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  +{images.length - MAX_VISIBLE_THUMBNAILS} фото
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Основное изображение */}
        <div className="relative group flex-1">
          <div 
            {...handlers}
            className="relative h-[300px] md:h-[600px] w-full rounded-lg overflow-hidden shadow-lg"
          >
            <div 
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `translateX(${swipeOffset}px)`,
                transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
              }}
            >
              <Image
                src={images[currentIndex]?.url || "/placeholder.jpg"}
                alt={images[currentIndex]?.alt || title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={openModal}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Пагинация для мобильных */}
      <div className="md:hidden">
        <GalleryPagination 
          currentIndex={currentIndex} 
          total={images.length} 
          className="mt-4"
        />
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={closeModal}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-4">Все фотографии</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[80vh] p-4 bg-black/20 rounded-lg">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden cursor-pointer group/thumb transition-all duration-300",
                    currentIndex === index 
                      ? "ring-2 ring-estate-gold scale-105" 
                      : "hover:ring-2 hover:ring-estate-gold/50 hover:scale-105"
                  )}
                  onClick={() => {
                    setCurrentIndex(index)
                    closeModal()
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${title} - фото ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
