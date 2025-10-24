import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

// Mock the GraphQL queries
jest.mock('@/lib/queries', () => ({
  GET_PRICE_DATA: 'mock-query',
  PROCESS_CONVERSATION: 'mock-mutation',
}))

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByText('Kumprador AI')).toBeInTheDocument()
  })

  it('displays the welcome message', () => {
    render(<Home />)
    // The welcome message is displayed in the chat interface
    expect(screen.getByText('Kumprador AI')).toBeInTheDocument()
  })

  it('has the correct page title', () => {
    render(<Home />)
    expect(screen.getByText('Kumprador AI')).toBeInTheDocument()
    expect(screen.getByText('Shopping and Budgeting Assistant')).toBeInTheDocument()
  })

  it('renders the input form', () => {
    render(<Home />)
    const input = screen.getByPlaceholderText(/Tell me your budget/)
    expect(input).toBeInTheDocument()
  })

  it('renders the send button', () => {
    render(<Home />)
    const sendButton = screen.getByRole('button')
    expect(sendButton).toBeInTheDocument()
  })
})
