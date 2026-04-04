'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Mail, Send, CheckCircle, Sparkles, Gift, Bell } from 'lucide-react'

export function EnhancedNewsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    console.log('EnhancedNewsletter form submitted with email:', email)
    setIsLoading(true)

    try {
      console.log('Sending request to /api/newsletter')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      console.log('Newsletter response status:', response.status)
      const data = await response.json()
      console.log('Newsletter response data:', data)

      if (!response.ok) {
        if (response.status === 409) {
          toast({
            title: 'Déjà inscrit',
            description: 'Cet email est déjà abonné à notre newsletter.',
            variant: 'destructive',
          })
        } else {
          throw new Error(data.error || 'Failed to subscribe')
        }
      } else {
        toast({
          title: 'Inscription réussie !',
          description: 'Bienvenue dans la communauté Foot Life',
        })
        
        setIsSubscribed(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Gift, text: '10% de réduction sur votre première commande' },
    { icon: Bell, text: 'Accès exclusif aux nouvelles collections' },
    { icon: Sparkles, text: 'Offres spéciales réservées aux membres' },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-red-600 to-blue-800 relative overflow-hidden" ref={ref}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Decorative Shapes */}
      <motion.div
        className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Mail className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Rejoignez l'Équipe
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Inscrivez-vous à notre newsletter et ne manquez aucune actualité Foot Life
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-white font-medium text-sm">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20"
          >
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg transition-all duration-300 pr-16"
                  />
                  <Mail className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        S'inscrire maintenant
                      </>
                    )}
                  </Button>
                </motion.div>
                
                <p className="text-center text-white/70 text-sm">
                  En vous inscrivant, vous acceptez notre politique de confidentialité
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Bienvenue dans l'équipe !
                </h3>
                <p className="text-white/80">
                  Vous recevrez bientôt nos meilleures offres
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                10 000+ inscrits
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Aucun spam
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Désinscription facile
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
