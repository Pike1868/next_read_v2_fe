import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, setViewportSize } from '../utils/test-utils'
import Search from '@/pages/Search'

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock ServerAPI
vi.mock('@/api/ServerAPI', () => ({
  default: {
    searchBooks: vi.fn(),
  },
}))

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock console to avoid noise
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('Search Page - Working Tests', () => {
  let mockServerApi: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    
    // Get the mocked modules
    const ServerAPI = (await import('@/api/ServerAPI')).default
    mockServerApi = ServerAPI
  })

  describe('Basic Page Rendering', () => {
    it('should render search form components', () => {
      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      // Check for core search functionality
      expect(screen.getByText(/find your next read/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search by title, author, or genre/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should show empty state when no books found after search', () => {
      const preloadedState = {
        search: {
          query: 'nonexistent book',  // Show it's after a search
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      expect(screen.getByText(/no books found/i)).toBeInTheDocument()
      expect(screen.getByText(/try searching for something else/i)).toBeInTheDocument()
    })

    it('should display books when results are available', () => {
      const mockBooks = [
        {
          google_books_id: 'test-id-1',
          title: 'Test Book Title',
          authors: ['Test Author'],
          thumbnail_url: 'https://example.com/thumb.jpg',
          published_date: '2023-01-01',
          page_count: 300,
          categories: ['Fiction'],
          retail_price: 15.99,
          currency_code: 'USD',
          description: 'Test description',
          publisher: 'Test Publisher',
        }
      ]

      const preloadedState = {
        search: {
          query: 'test query',
          results: mockBooks,
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      expect(screen.getByText('Test Book Title')).toBeInTheDocument()
      expect(screen.getByText('Test Author')).toBeInTheDocument()
      expect(screen.queryByText(/no books found/i)).not.toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('should call search API when user searches', async () => {
      const user = userEvent.setup()
      
      mockServerApi.searchBooks.mockResolvedValue({
        data: {
          books: [],
          query: 'Harry Potter',
          startIndex: 0,
        }
      })

      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      const searchInput = screen.getByPlaceholderText(/search by title, author, or genre/i)
      await user.type(searchInput, 'Harry Potter')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      await waitFor(() => {
        expect(mockServerApi.searchBooks).toHaveBeenCalledWith('Harry Potter', 0)
      })

      expect(mockNavigate).toHaveBeenCalledWith('/book/search')
    })

    it('should search on Enter key press', async () => {
      const user = userEvent.setup()
      
      mockServerApi.searchBooks.mockResolvedValue({
        data: {
          books: [],
          query: 'Fiction',
          startIndex: 0,
        }
      })

      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      const searchInput = screen.getByPlaceholderText(/search by title, author, or genre/i)
      await user.type(searchInput, 'Fiction{enter}')

      await waitFor(() => {
        expect(mockServerApi.searchBooks).toHaveBeenCalledWith('Fiction', 0)
      })
    })

    it('should not search with empty query', async () => {
      const user = userEvent.setup()
      
      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      expect(mockServerApi.searchBooks).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup()
      
      mockServerApi.searchBooks.mockRejectedValue(new Error('API Error'))

      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      const searchInput = screen.getByPlaceholderText(/search by title, author, or genre/i)
      await user.type(searchInput, 'test query')
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      await waitFor(() => {
        expect(mockServerApi.searchBooks).toHaveBeenCalledWith('test query', 0)
      })

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled()
      })
    })
  })

  describe('Responsive Design', () => {
    it('should render properly on mobile (375px)', () => {
      setViewportSize(375, 667)

      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      expect(screen.getByText(/find your next read/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search by title, author, or genre/i)).toBeInTheDocument()
    })

    it('should render properly on tablet (768px)', () => {
      setViewportSize(768, 1024)

      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      expect(screen.getByText(/find your next read/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should render properly on desktop (1024px)', () => {
      setViewportSize(1024, 768)

      const preloadedState = {
        search: {
          query: '',
          results: [],
          sorting: 'none',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      expect(screen.getByText(/find your next read/i)).toBeInTheDocument()
      expect(screen.getByText(/sort by/i)).toBeInTheDocument()
    })
  })

  describe('Sort Functionality', () => {
    it('should display sort options', () => {
      const preloadedState = {
        search: {
          query: 'test',
          results: [{
            google_books_id: 'test-1',
            title: 'Test Book',
            authors: ['Test Author'],
            thumbnail_url: '',
            published_date: '2023-01-01',
            page_count: 300,
            categories: ['Fiction'],
            retail_price: 15.99,
            currency_code: 'USD',
            description: 'Description',
            publisher: 'Publisher',
          }],
          sorting: 'a-z',
          startIndex: 0,
        }
      }

      renderWithProviders(<Search />, { preloadedState })

      expect(screen.getByText(/sort by/i)).toBeInTheDocument()
      // Books display is handled by the BooksContainer component
      // Just verify the page renders with books data and SearchFilters
      expect(screen.getByText(/find your next read/i)).toBeInTheDocument()
    })
  })
})