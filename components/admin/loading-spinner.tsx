"use client"

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-estate-gold/20 border-t-estate-gold animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-estate-gold/40 border-b-estate-gold animate-spin"></div>
        </div>
      </div>
    </div>
  )
} 