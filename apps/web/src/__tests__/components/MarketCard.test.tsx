import { render, screen } from '@testing-library/react'
import { MarketCard } from '@/components/MarketCard'

const mockMarket = {
  marketName: 'Test Market',
  price: 25.50,
  unit: 'kg',
  lastUpdated: '2024-01-01T00:00:00.000Z'
}

describe('MarketCard', () => {
  it('renders without crashing', () => {
    render(<MarketCard market={mockMarket} />)
    expect(screen.getByText('Test Market')).toBeInTheDocument()
  })

  it('displays market information correctly', () => {
    render(<MarketCard market={mockMarket} />)
    
    expect(screen.getByText('Test Market')).toBeInTheDocument()
    expect(screen.getByText('₱25.50')).toBeInTheDocument()
    expect(screen.getByText('per kg')).toBeInTheDocument()
  })

  it('formats price correctly', () => {
    const marketWithDifferentPrice = {
      ...mockMarket,
      price: 100.75
    }
    
    render(<MarketCard market={marketWithDifferentPrice} />)
    expect(screen.getByText('₱100.75')).toBeInTheDocument()
  })

  it('displays unit correctly', () => {
    const marketWithDifferentUnit = {
      ...mockMarket,
      unit: 'piece'
    }
    
    render(<MarketCard market={marketWithDifferentUnit} />)
    expect(screen.getByText('per piece')).toBeInTheDocument()
  })
})
