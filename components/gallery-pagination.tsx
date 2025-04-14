import { cn } from "@/lib/utils"

interface GalleryPaginationProps {
  currentIndex: number
  total: number
  className?: string
}

export function GalleryPagination({ currentIndex, total, className }: GalleryPaginationProps) {
  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            currentIndex === index ? "bg-estate-gold w-4" : "bg-estate-gold/50"
          )}
        />
      ))}
    </div>
  )
} 