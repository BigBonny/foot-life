'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { User, Mail, Phone, MapPin, Edit, Save, X, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
  })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile()
    }
  }, [isLoaded, user])

  const fetchProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available')
      setLoading(false)
      return
    }
    
    console.log('Fetching profile for user:', user.id)
    console.log('Clerk user data:', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses?.[0]?.emailAddress
    })
    
    // Always use Clerk data as the source of truth
    // Supabase is optional for persistence
    const clerkProfile = {
      first_name: user?.firstName || '',
      last_name: user?.lastName || '',
      email: user?.emailAddresses?.[0]?.emailAddress || '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: 'France',
    }
    
    console.log('Setting form data from Clerk:', clerkProfile)
    setFormData(clerkProfile)
    
    // Try to load from Supabase (optional)
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.log('Supabase error (non-critical):', error.message)
      } else if (data) {
        console.log('Profile loaded from Supabase:', data)
        // Merge Supabase data with Clerk data (Supabase wins for extra fields)
        setFormData({
          first_name: data.first_name || clerkProfile.first_name,
          last_name: data.last_name || clerkProfile.last_name,
          email: data.email || clerkProfile.email,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          country: data.country || 'France',
        })
      }
    } catch (error) {
      console.log('Supabase unavailable, using Clerk data only:', error)
    } finally {
      console.log('Loading set to false')
      setLoading(false)
    }
  }

  // Debug: Log current state
  console.log('Current state:', { loading, formData, user })

  // Client-side fallback to sync user to Supabase
  const syncUserToSupabase = async () => {
    if (!user?.id) return
    
    try {
      console.log('Syncing user to Supabase:', user.id)
      
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (checkError) {
        console.error('Error checking existing user:', checkError)
        return
      }
      
      if (!existingUser) {
        console.log('Creating new user profile...')
        const { error: insertError } = await supabase.from('user_profiles').insert({
          user_id: user.id,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          email: user.emailAddresses?.[0]?.emailAddress || '',
          phone: '',
          address: '',
          city: '',
          postal_code: '',
          country: 'France',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        
        if (insertError) {
          console.error('Error inserting user:', insertError)
        } else {
          console.log('User profile created successfully')
        }
      }
    } catch (error) {
      console.error('Error syncing user:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const profileData = {
        user_id: user?.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        country: formData.country,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData)

      if (error) throw error

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été sauvegardées avec succès.',
      })

      setProfile(profileData as UserProfile)
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos informations.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <User className="h-12 w-12 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
          <p className="text-gray-600 mb-8 text-lg">Veuillez vous connecter pour voir votre profil.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="px-8 py-4 rounded-xl text-lg font-semibold">
              <a href="/sign-in">Se connecter</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xl text-gray-600 font-medium">Chargement du profil...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12" ref={ref}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-4">
              <User className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Mon Profil
          </h1>
          <p className="text-xl text-gray-600">
            Gérez vos informations personnelles
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl flex items-center">
                    <User className="h-6 w-6 mr-2" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription className="text-white/80 text-base mt-1">
                    Mettez à jour vos coordonnées
                  </CardDescription>
                </div>
                {!editing ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setEditing(true)}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 border-0"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          setEditing(false)
                          fetchProfile()
                        }}
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.first_name}</span>
                    </div>
                  )}
                </motion.div>

                {/* Last Name */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.last_name}</span>
                    </div>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}} className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.email}</span>
                    </div>
                  )}
                </motion.div>

                {/* Phone */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+33 1 23 45 67 89"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.phone || 'Non renseigné'}</span>
                    </div>
                  )}
                </motion.div>

                {/* Country */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pays
                  </label>
                  {editing ? (
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.country}</span>
                    </div>
                  )}
                </motion.div>

                {/* Address */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}} className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="123 rue du Football"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.address || 'Non renseignée'}</span>
                    </div>
                  )}
                </motion.div>

                {/* City */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ville
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Paris"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.city || 'Non renseignée'}</span>
                    </div>
                  )}
                </motion.div>

                {/* Postal Code */}
                <motion.div whileHover={editing ? { scale: 1.01 } : {}}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Code postal
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="75001"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{formData.postal_code || 'Non renseigné'}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8"
        >
          <Card className="shadow-lg border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">ID utilisateur</span>
                  <span className="font-semibold text-sm text-gray-500">{user?.id?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Email vérifié</span>
                  <span className={`font-semibold ${user?.emailAddresses?.[0]?.verification?.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user?.emailAddresses?.[0]?.verification?.status === 'verified' ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
