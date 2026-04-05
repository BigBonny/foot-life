export default function CustomizationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Personnalisation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Options de Personnalisation</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">📝 Nom et Numéro</h3>
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    ⚡ Personnalisation de base : +3€
                  </p>
                  <p className="text-xs text-blue-700">
                    Ajoutez votre nom et numéro personnalisés sur votre maillot
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom (max 12 caractères)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="Ex: JOHNSON"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro (max 2 chiffres)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="Ex: 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">🎨 Options Supplémentaires (Optionnelles)</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Ces options sont facultatives et s'ajoutent à la personnalisation de base
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="patch"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="patch" className="text-sm text-gray-700">
                      Ajouter un patch (logo officiel) (+15€)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="shortsleeve"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shortsleeve" className="text-sm text-gray-700">
                      Manches courtes (+10€)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="premiereleague"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="premiereleague" className="text-sm text-gray-700">
                      Patch Ligue des Champions (+15€)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">⚡ Service Express (Optionnel)</h3>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    Recevez votre maillot personnalisé rapidement !
                  </p>
                  <p className="text-xs text-gray-600">
                    Service disponible pour les commandes passées avant 14h (+15€)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Tarifs</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-3">Personnalisation Standard</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Nom et Numéro</span>
                    <span className="font-bold text-blue-600">3€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Patch officiel</span>
                    <span className="font-bold text-green-600">15€</span>
                  </div>
                </div>
              </div>
              
              <div className="pb-4">
                <h3 className="font-medium mb-2">Personnalisation Premium</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Service Express</span>
                    <span className="font-bold text-blue-600">18€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Patch Ligue des Champions</span>
                    <span className="font-bold text-blue-600">18€</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">💎 Pack Complet</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Nom + Numéro + Patch + Manches courtes + Service Express
                </p>
                <p className="text-2xl font-bold text-blue-600">48€</p>
                <p className="text-xs text-gray-600">
                  Économisez 15€ par rapport au prix individuel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Comment ça marche ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Choisissez votre maillot</h3>
              <p className="text-sm text-gray-600">
                Ajoutez le maillot de votre choix au panier
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Personnalisez</h3>
              <p className="text-sm text-gray-600">
                Sélectionnez les options de personnalisation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Validez</h3>
              <p className="text-sm text-gray-600">
                Finalisez votre commande et recevez rapidement
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Commencer la personnalisation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
