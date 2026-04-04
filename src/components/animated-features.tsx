'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Truck, RotateCcw, Award, Clock, Headphones } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: '100% Authentique',
    description: 'Tous nos maillots sont certifiés authentiques et proviennent directement des fabricants officiels',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Truck,
    title: 'Livraison Express',
    description: 'Livraison en 48-72h partout en France. Suivi en temps réel de votre commande',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: RotateCcw,
    title: 'Retours Faciles',
    description: '30 jours pour retourner votre commande. Remboursement sous 48h',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Award,
    title: 'Qualité Premium',
    description: 'Matériaux de haute qualité, coutures renforcées, finitions professionnelles',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Clock,
    title: 'Service 24/7',
    description: 'Notre équipe est disponible à tout moment pour répondre à vos questions',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Headphones,
    title: 'Support Expert',
    description: 'Conseillers passionnés par le football pour vous guider dans vos choix',
    color: 'from-indigo-500 to-indigo-600',
  },
]

export function AnimatedFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            Pourquoi nous choisir ?
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            La Qualité Avant Tout
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nous nous engageons à vous offrir la meilleure expérience d'achat possible
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden relative">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
