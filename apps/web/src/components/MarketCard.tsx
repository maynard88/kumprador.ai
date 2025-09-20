interface Market {
  name: string
}

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900 text-sm">
        {market.name}
      </h3>
    </div>
  )
}
