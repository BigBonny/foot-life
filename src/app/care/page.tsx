export default function CarePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Entretien des Maillots</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Washing Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions de Lavage</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium mb-2">🧼 Lavage à la Machine</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Lavez le maillot à l'envers (intérieur extérieur)</li>
                  <li>Utilisez un cycle de lavage délicat (30°C maximum)</li>
                  <li>Lavez le maillot avec d'autres vêtements de couleur</li>
                  <li>Ne laissez pas tremper le maillot</li>
                  <li>Séchez les instructions sur l'étiquette</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">✋ Lavage à la Main</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remplissez un évier d'eau froide</li>
                  <li>Utilisez une lessive douce (sans javel)</li>
                  <li>Lavez le maillot à l'envers</li>
                  <li>Frottez doucement, pas de frotter</li>
                  <li>Rincez abondamment à l'eau claire</li>
                  <li>Laissez sécher à l'air libre, pas au soleil direct</li>
                  <li>Ne pas utiliser de sèche-linge</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Drying Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions de Séchage</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium mb-2">🌞 Séchage à l'Air Libre</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Étendez le maillot sur une surface plane</li>
                  <li>Accrochez-le avec des pinces aux épaules et à la taille</li>
                  <li>Laissez sécher à l'ombre, pas au soleil direct</li>
                  <li>Assurez-vous que le maillot est complètement sec avant de le ranger</li>
                  <li>Ne pas utiliser de sèche-linge</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">📱 Séchage à l'Intérieur</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Utilisez un cintre chauffant ou un sèche-linge à basse température</li>
                  <li>Placez le maillot à plat</li>
                  <li>Laissez sécher complètement avant de le repasser</li>
                  <li>Ne pas surchauffer le maillot</li>
                </ul>
              </div>
            </div>
          </div>

          {/* General Tips */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">💡 Conseils Généraux</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium mb-2">Pour préserver les couleurs</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Lavez les nouveaux maillots avant de les porter</li>
                  <li>Suivez toujours les instructions du fabricant</li>
                  <li>Évitez l'exposition prolongée au soleil</li>
                  <li>Stockez les maillots dans un endroit frais et sec</li>
                  <li>Utilisez des sacs de rangement respirables</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Pour les taches et les transferts</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Utilisez du ruban adhésif pour les petites réparations</li>
                  <li>Repassez les coutures défaillantes avec du fil spécial</li>
                  <li>Pour les taches tenaces, utilisez un fer à repasser</li>
                  <li>Ne pas utiliser d'eau de Javel sur les maillots colorés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
