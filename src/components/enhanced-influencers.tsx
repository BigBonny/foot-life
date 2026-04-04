'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Instagram, Twitter, ShoppingBag, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const influencers = [
  {
    id: 1,
    name: 'Kylian Mbappé',
    handle: '@kmbappe',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face',
    followers: '105M',
    sport: 'Football',
    team: 'Real Madrid',
    instagram: 'https://instagram.com/kmbappe',
    twitter: 'https://twitter.com/kmbappe',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Lionel Messi',
    handle: '@leomessi',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    followers: '489M',
    sport: 'Football',
    team: 'Inter Miami',
    instagram: 'https://instagram.com/leomessi',
    twitter: 'https://twitter.com/leomessi',
    rating: 5.0,
  },
  {
    id: 3,
    name: 'Cristiano Ronaldo',
    handle: '@cristiano',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face',
    followers: '631M',
    sport: 'Football',
    team: 'Al Nassr',
    instagram: 'https://instagram.com/cristiano',
    twitter: 'https://twitter.com/cristiano',
    rating: 5.0,
  },
  {
    id: 4,
    name: 'Neymar Jr',
    handle: '@neymarjr',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    followers: '215M',
    sport: 'Football',
    team: 'Al Hilal',
    instagram: 'https://instagram.com/neymarjr',
    twitter: 'https://twitter.com/neymarjr',
    rating: 4.8,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export function EnhancedInfluencers() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-gradient-to-b from-white via-red-50/30 to-white overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Nos Ambassadeurs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les maillots portés par les plus grandes stars du football
          </p>
        </motion.div>

        {/* Influencers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {influencers.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border-0">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <motion.img
                      src={influencer.image}
                      alt={influencer.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Rating Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center"
                    >
                      <Star className="h-4 w-4 mr-1 fill-black" />
                      {influencer.rating}
                    </motion.div>

                    {/* Social Links - Appear on hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <div className="flex space-x-3">
                        <motion.a
                          href={influencer.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/20 backdrop-blur-md hover:bg-pink-500 text-white p-3 rounded-full transition-all duration-300"
                        >
                          <Instagram className="h-5 w-5" />
                        </motion.a>
                        <motion.a
                          href={influencer.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white/20 backdrop-blur-md hover:bg-blue-500 text-white p-3 rounded-full transition-all duration-300"
                        >
                          <Twitter className="h-5 w-5" />
                        </motion.a>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Info Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {influencer.name}
                      </h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {influencer.sport}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {influencer.handle} • {influencer.team}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{influencer.followers}</p>
                        <p className="text-xs text-gray-500">abonnés</p>
                      </div>
                      <div className="text-right">
                        <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-green-600 font-medium">+12.5% ce mois</p>
                      </div>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        asChild
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link href="/products" className="flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Acheter pareil
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 via-red-600 to-blue-800 text-white rounded-3xl p-12 shadow-2xl">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Rejoignez la communauté Foot Life
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="text-lg mb-8 max-w-2xl mx-auto"
            >
              Suivez nos ambassadeurs et découvrez les dernières tendances du football
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" asChild className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 rounded-full">
                  <a href="https://instagram.com/footlife" target="_blank">
                    <Instagram className="h-5 w-5 mr-2" />
                    Nous suivre
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="bg-white/20 text-white hover:bg-white/30 font-semibold px-8 py-6 rounded-full border-2 border-white/50">
                  <Link href="/products">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Voir la collection
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
