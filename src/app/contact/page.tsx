'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, HelpCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Sending contact form via EmailJS...')
      
      // Initialize EmailJS with public key
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '')
      
      // Send email
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'contact@footlife.com', // Your business email
        }
      )
      
      console.log('EmailJS response:', response)
      
      if (response.status === 200) {
        toast({
          title: 'Message envoyé!',
          description: 'Nous vous répondrons dans les plus brefs délais.',
        })
        
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer votre message. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-blue-100 rounded-full p-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre équipe est là pour vous aider avec toutes vos questions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="text-white">Informations de contact</CardTitle>
                <CardDescription className="text-white/80">
                  Différentes façons de nous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {[
                  { icon: Mail, title: 'Email', value: 'contact@footlife.fr', color: 'bg-blue-100 text-blue-600' },
                  { icon: Phone, title: 'Téléphone', value: '+33 1 23 45 67 89', color: 'bg-green-100 text-green-600' },
                  { icon: MapPin, title: 'Adresse', value: '123 Rue du Football\n75001 Paris, France', color: 'bg-red-100 text-red-600' },
                  { icon: Clock, title: 'Horaires', value: 'Lun-Ven: 9h-18h\nSam: 10h-16h', color: 'bg-orange-100 text-orange-600' },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="mt-6 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Questions fréquentes
                  </CardTitle>
                  <CardDescription>
                    Réponses rapides aux questions communes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { q: 'Quels sont les délais de livraison?', a: 'Livraison rapide en France métropolitaine.' },
                    { q: 'Puis-je retourner un article?', a: 'Oui, retour possible.' },
                    { q: 'Quelle est la qualité des produits?', a: 'Oui, tous nos <Link href="/products" className="text-blue-600 hover:underline">produits</Link> sont de grande qualité.' },
                  ].map((faq, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <h4 className="font-semibold mb-2 text-gray-900">{faq.q}</h4>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </motion.div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <a href="/faq">Voir toutes les FAQ</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <CardTitle className="text-white flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription className="text-white/80">
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Message envoyé avec succès!
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 }}
                      >
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Votre nom"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 }}
                      >
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="votre@email.com"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 }}
                    >
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Le sujet de votre message"
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 }}
                    >
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Décrivez votre question ou demande en détail..."
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-between pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-sm text-gray-500">
                        * Champs obligatoires
                      </p>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
