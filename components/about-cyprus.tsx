"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AboutCyprusProps {
  title: string
  description: string
  image: string
  features: {
    title: string
    description: string
    icon: string
  }[]
}

export default function AboutCyprus({ title, description, image, features }: AboutCyprusProps) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Левая колонка */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
            
            {/* Особенности */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg transition-all duration-300 cursor-pointer",
                    activeTab === index
                      ? "bg-estate-gold/10 border border-estate-gold"
                      : "bg-gray-50 hover:bg-gray-100"
                  )}
                  onClick={() => setActiveTab(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка */}
          <div className="relative h-[300px] md:h-[500px] w-full rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
} 