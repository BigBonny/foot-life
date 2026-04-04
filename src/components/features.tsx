import { Truck, Shield, CreditCard, RefreshCw } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Livraison Rapide',
    description: 'Livraison sous 48-72h en France métropolitaine',
  },
  {
    icon: Shield,
    title: 'Qualité Garantie',
    description: 'Produits 100% authentiques et de haute qualité',
  },
  {
    icon: CreditCard,
    title: 'Paiement Sécurisé',
    description: 'Paiement 100% sécurisé par carte bancaire',
  },
  {
    icon: RefreshCw,
    title: 'Retour Facile',
    description: 'Retour possible sous 30 jours',
  },
]

export function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-center mb-4">
                <feature.icon className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
