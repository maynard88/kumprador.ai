import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PRICE_DATA } from '@/lib/queries'
import { MarketCard } from '@/components/MarketCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorMessage } from '@/components/ErrorMessage'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant for agricultural commodity price monitoring. Ask me about rice prices, market data, or any commodity information you need.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data, loading, error, refetch } = useQuery(GET_PRICE_DATA, {
    variables: {
      input: {
        commodity: '7',
        region: '070000000',
        count: 23,
      },
    },
    skip: true, // Don't auto-fetch
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simulate AI processing and fetch data
      await refetch()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Here\'s the latest commodity price data I found:',
        timestamp: new Date(),
        data: data
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while fetching the price data. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = (message: Message) => {
    if (message.type === 'user') {
      return (
        <div className="flex justify-end mb-4">
          <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs opacity-75 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex justify-start mb-4">
        <div className="bg-white border rounded-lg px-4 py-2 max-w-xs lg:max-w-2xl shadow-sm">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
              
              {message.data && message.data.syncDTIPriceData && (
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-gray-600">
                    Found {message.data.syncDTIPriceData.length} commodities with price data
                  </div>
                  
                  {message.data.syncDTIPriceData.map((priceData: any, commodityIndex: number) => (
                    <div key={commodityIndex} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {priceData.commodity.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {priceData.commodity.specifications}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {priceData.markets.map((market: any, marketIndex: number) => (
                          <MarketCard key={`${commodityIndex}-${marketIndex}`} market={market} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Bantay Presyo AI</h1>
              <p className="text-sm text-gray-500">Agricultural Price Assistant</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {renderMessage(message)}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <LoadingSpinner />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about commodity prices, market data, or any agricultural information..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • AI will help you find commodity price information
          </p>
        </div>
      </div>
    </div>
  )
}
