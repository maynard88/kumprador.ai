import { render, screen } from '@testing-library/react'
import { ErrorMessage } from '@/components/ErrorMessage'

describe('ErrorMessage', () => {
  it('renders without crashing', () => {
    render(<ErrorMessage message="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('displays the error message', () => {
    const errorMessage = 'Something went wrong'
    render(<ErrorMessage message={errorMessage} />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<ErrorMessage message="Test error" />)
    const errorElement = screen.getByText('Test error')
    expect(errorElement).toHaveClass('text-red-600')
  })
})
