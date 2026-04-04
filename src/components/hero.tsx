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
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 text-yellow-400 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Foot Life
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Les maillots de football authentiques des plus grands clubs et équipes nationales
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg transition-colors">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Voir la collection
            </Link>
            
            <Link href="/best-sellers" className="border border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-lg transition-colors">
              Meilleures ventes
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">100%</h3>
                <p className="text-lg">Authentique</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">48h</h3>
                <p className="text-lg">Livraison</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">30j</h3>
                <p className="text-lg">Retour gratuit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
