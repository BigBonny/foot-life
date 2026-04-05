import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, Trophy } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-red-600 to-blue-800 text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1554068395-465a9057a3b4?w=1920&h=1080&fit=crop"
          alt="Football stadium"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
            <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400 mb-2 sm:mb-0 sm:mr-4" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
              Prime Kicks
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Les maillots de football des plus grands clubs et équipes nationales
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Link href="/products" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-center">
              <ShoppingBag className="h-5 w-5 mr-2 inline" />
              Voir la collection
            </Link>
            
            <Link href="/best-sellers" className="w-full sm:w-auto border border-white text-white hover:bg-white hover:text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-center">
              Meilleures ventes
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
