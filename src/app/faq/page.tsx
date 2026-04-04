'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Nous livrons en France métropolitaine sous 48-72h ouvrables. Pour les DOM-TOM et l'international, les délais peuvent varier de 5 à 10 jours ouvrables. Vous recevrez un email de suivi dès que votre commande sera expédiée."
  },
  {
    question: "Puis-je retourner un article ?",
    answer: "Oui, vous pouvez retourner tout article dans un délai de 30 jours après réception. Les articles doivent être neufs, non portés, avec toutes les étiquettes intactes et dans leur emballage d'origine. Les frais de retour sont à notre charge pour les retours sous 14 jours."
  },
  {
    question: "Les maillots sont-ils authentiques ?",
    answer: "Absolument ! Tous nos maillots sont 100% authentiques et proviennent directement des fabricants officiels. Nous garantissons l'authenticité de tous nos produits sous peine de remboursement intégral."
  },
  {
    question: "Quelles sont les méthodes de paiement acceptées ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et les paiements en plusieurs fois via notre partenaire Klarna. Tous les paiements sont sécurisés avec le protocole SSL."
  },
  {
    question: "Comment choisir la bonne taille ?",
    answer: "Nous vous invitons à consulter notre guide des tailles disponible sur chaque page produit. Si vous avez un doute, n'hésitez pas à nous contacter par email ou par téléphone. Nos conseillers sont là pour vous aider à choisir la taille parfaite."
  },
  {
    question: "Proposez-vous la personnalisation des maillots ?",
    answer: "Oui, nous proposons un service de personnalisation avec nom et numéro. Ce service est disponible pour la plupart des maillots de club. Le délai supplémentaire est de 2-3 jours. Les maillots personnalisés ne peuvent être retournés que en cas de défaut de fabrication."
  },
  {
    question: "Que faire si je reçois un article défectueux ?",
    answer: "En cas de défaut de fabrication, contactez-nous dans les 48h suivant la réception. Nous vous proposerons soit un remplacement immédiat, soit un remboursement intégral, y compris les frais de port."
  },
  {
    question: "Suivez-vous les soldes et promotions ?",
    answer: "Oui ! Inscrivez-vous à notre newsletter pour être informé en avant-premier des soldes, promotions exclusives et nouveautés. Nos membres fidèles bénéficient également d'offres spéciales tout au long de l'année."
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer: "Vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été expédiée. Contactez-nous rapidement par téléphone ou email. Une fois la commande expédiée, vous devrez suivre la procédure de retour standard."
  },
  {
    question: "Proposez-vous des cartes cadeaux ?",
    answer: "Oui, nous proposons des cartes cadeaux de 25€ à 500€. Elles sont valables 1 an sur tout notre site et peuvent être utilisées en plusieurs fois. Contactez-nous pour en obtenir une."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Questions Fréquentes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes sur nos produits, services et politiques
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <CardTitle className="text-lg font-medium">
                    {faq.question}
                  </CardTitle>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </CardHeader>
              {openItems.includes(index) && (
                <CardContent>
                  <CardDescription className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Vous ne trouvez pas votre réponse ?</CardTitle>
              <CardDescription className="text-lg">
                Notre service client est disponible pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Si vous n'avez pas trouvé la réponse à votre question dans notre FAQ, 
                n'hésitez pas à nous contacter directement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                >
                  Contacter le support
                </a>
                <a
                  href="mailto:contact@footlife.fr"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 transition-colors"
                >
                  Envoyer un email
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
