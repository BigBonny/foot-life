'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    console.log('Newsletter form submitted with email:', email)
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
          description: 'Merci de vous être inscrit à notre newsletter.',
        })
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

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Abonnez-vous à notre newsletter
        </h2>
        <p className="text-xl mb-8">
          Recevez nos offres exclusives et nouveautés
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white text-purple-600 hover:bg-gray-100 px-6"
          >
            {isLoading ? 'Inscription...' : 'S\'abonner'}
          </Button>
        </form>
      </div>
    </section>
  )
}
