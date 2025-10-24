import { render, screen } from '@testing-library/react'
import { MarketCard } from '@/components/MarketCard'

const mockMarket = {
  name: 'Test Market'
}

describe('MarketCard', () => {
  it('renders without crashing', () => {
    render(<MarketCard market={mockMarket} />)
    expect(screen.getByText('Test Market')).toBeInTheDocument()
  })

  it('displays market name correctly', () => {
    render(<MarketCard market={mockMarket} />)
    expect(screen.getByText('Test Market')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<MarketCard market={mockMarket} />)
    const cardElement = screen.getByText('Test Market').closest('div')
    expect(cardElement).toHaveClass('bg-gray-50', 'rounded-lg', 'p-4')
  })
})
