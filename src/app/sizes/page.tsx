export default function SizesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Guide des Tailles</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Size Guide */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Comment bien choisir sa taille</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Maillots Adultes (S, M, L, XL):</strong><br />
                • S: 170-176 cm<br />
                • M: 176-181 cm<br />
                • L: 181-186 cm<br />
                • XL: 187-192 cm<br />
              </p>
              <p className="mt-4">
                <strong>Maillots Enfants (XS, S, M):</strong><br />
                • XS: 158-164 cm<br />
                • S: 165-170 cm<br />
                • M: 171-176 cm
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Nos conseils</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Préférer une taille légèrement plus grande si vous êtes entre deux tailles</li>
                  <li>• Consultez notre guide des tailles détaillé ci-dessous</li>
                  <li>• Les maillots de football ont généralement une coupe ample</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Size Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau des Tailles</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taille
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour de poitrine (cm)
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour de taille (cm)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">XS</td>
                    <td className="border border-gray-200 px-4 py-2">82-86</td>
                    <td className="border border-gray-200 px-4 py-2">71-76</td>
                    <td className="border border-gray-200 px-4 py-2">68-74</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">S</td>
                    <td className="border border-gray-200 px-4 py-2">88-96</td>
                    <td className="border border-gray-200 px-4 py-2">76-82</td>
                    <td className="border border-gray-200 px-4 py-2">73-79</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">M</td>
                    <td className="border border-gray-200 px-4 py-2">96-101</td>
                    <td className="border border-gray-200 px-4 py-2">81-86</td>
                    <td className="border border-gray-200 px-4 py-2">79-84</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-medium">L</td>
                    <td className="border border-gray-200 px-4 py-2">102-107</td>
                    <td className="border border-gray-200 px-4 py-2">86-92</td>
                    <td className="border border-gray-200 px-4 py-2">84-90</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">XL</td>
                    <td className="border border-gray-200 px-4 py-2">108-113</td>
                    <td className="border border-gray-200 px-4 py-2">91-97</td>
                    <td className="border border-gray-200 px-4 py-2">87-93</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
