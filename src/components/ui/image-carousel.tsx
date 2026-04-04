'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: {
    front: string
    back: string
  }
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const imageList = [images.front, images.back].filter(Boolean)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
  }

  if (imageList.length === 0) return null

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <Image
          src={imageList[currentIndex]}
          alt={alt}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Navigation Buttons */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}
