import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Foot Life</h3>
            <p className="text-gray-400 mb-4">
              Votre boutique spécialisée dans les maillots de football des plus grandes marques.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  F.A.Q
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition">
                  Retours
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tracking" className="text-gray-400 hover:text-white transition">
                  Suivre votre commande
                </Link>
              </li>
              <li>
                <Link href="/sizes" className="text-gray-400 hover:text-white transition">
                  Guide des tailles
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-gray-400 hover:text-white transition">
                  Entretien des maillots
                </Link>
              </li>
              <li>
                <Link href="/customization" className="text-gray-400 hover:text-white transition">
                  Personnalisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tracking" className="text-gray-400 hover:text-white transition">
                  Suivre votre commande
                </Link>
              </li>
              <li>
                <Link href="/sizes" className="text-gray-400 hover:text-white transition">
                  Guide des tailles
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-gray-400 hover:text-white transition">
                  Entretien des maillots
                </Link>
              </li>
              <li>
                <Link href="/customization" className="text-gray-400 hover:text-white transition">
                  Personnalisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Foot Life. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
