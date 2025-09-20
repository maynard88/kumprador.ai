import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PRICE_DATA } from '@/lib/queries'
import { MarketCard } from '@/components/MarketCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorMessage } from '@/components/ErrorMessage'

export default function Home() {
  const [commodity, setCommodity] = useState('7')
  const [region, setRegion] = useState('070000000')
  const [count, setCount] = useState(23)

  const { data, loading, error, refetch } = useQuery(GET_PRICE_DATA, {
    variables: {
      input: {
        commodity,
        region,
        count,
      },
    },
    skip: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bantay Presyo
          </h1>
          <p className="text-lg text-gray-600">
            Real-time price monitoring for agricultural commodities
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="commodity" className="block text-sm font-medium text-gray-700 mb-1">
                  Commodity
                </label>
                <input
                  id="commodity"
                  type="text"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 7"
                />
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <input
                  id="region"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 070000000"
                />
              </div>
              <div>
                <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                  Count
                </label>
                <input
                  id="count"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 23"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Search Prices
            </button>
          </form>

          {loading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error.message} />}

          {data && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {data.getPriceData.commodity.name}
              </h2>
              <p className="text-gray-600 mb-6">
                {data.getPriceData.commodity.specifications}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.getPriceData.markets.map((market: any, index: number) => (
                  <MarketCard key={index} market={market} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
