import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Instagram, Twitter, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const influencers = [
  {
    id: 1,
    name: 'Kylian Mbappé',
    handle: '@kmbappe',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face',
    followers: '105M',
    sport: 'Football',
    team: 'Real Madrid',
    instagram: 'https://instagram.com/kmbappe',
    twitter: 'https://twitter.com/kmbappe'
  },
  {
    id: 2,
    name: 'Lionel Messi',
    handle: '@leomessi',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    followers: '489M',
    sport: 'Football',
    team: 'Inter Miami',
    instagram: 'https://instagram.com/leomessi',
    twitter: 'https://twitter.com/leomessi'
  },
  {
    id: 3,
    name: 'Cristiano Ronaldo',
    handle: '@cristiano',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&h=300&fit=crop&crop=face',
    followers: '631M',
    sport: 'Football',
    team: 'Al Nassr',
    instagram: 'https://instagram.com/cristiano',
    twitter: 'https://twitter.com/cristiano'
  },
  {
    id: 4,
    name: 'Neymar Jr',
    handle: '@neymarjr',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    followers: '215M',
    sport: 'Football',
    team: 'Al Hilal',
    instagram: 'https://instagram.com/neymarjr',
    twitter: 'https://twitter.com/neymarjr'
  }
]

export function Influencers() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Ambassadeurs ⭐
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les maillots portés par les plus grandes stars du football
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={influencer.image}
                    alt={influencer.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-2">
                        <a
                          href={influencer.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition-colors"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                        <a
                          href={influencer.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {influencer.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {influencer.handle} • {influencer.team}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {influencer.followers}
                      </p>
                      <p className="text-xs text-gray-500">abonnés</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {influencer.sport}
                      </p>
                      <p className="text-xs text-gray-500">sport</p>
                    </div>
                  </div>
                  
                  <Button 
                    asChild
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Link href="/products" className="flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Acheter pareil
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Rejoignez la communauté Foot Life
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Suivez nos ambassadeurs et découvrez les dernières tendances du football
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="https://instagram.com/footlife" target="_blank">
                <Instagram className="h-5 w-5 mr-2" />
                Nous suivre
              </a>
            </Button>
            <Button size="lg" asChild>
              <a href="/products">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Voir la collection
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
