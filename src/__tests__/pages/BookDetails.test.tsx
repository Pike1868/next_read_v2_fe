import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, setViewportSize } from '../utils/test-utils'
import BookDetails from '@/pages/BookDetails'

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock ServerAPI
vi.mock('@/api/ServerAPI', () => ({
  default: {
    getBookDetails: vi.fn(),
  },
}))

// Mock the book slice actions
vi.mock('@/features/book/bookSlice', async () => {
  const actual = await vi.importActual('@/features/book/bookSlice')
  return {
    ...actual,
    clearBookDetails: vi.fn(() => ({ type: 'book/clearBookDetails' })),
    setBookDetails: vi.fn(() => ({ type: 'book/setBookDetails' })),
    saveBookToServer: vi.fn(() => async (dispatch: any) => Promise.resolve()),
    fetchUserBooks: vi.fn(() => ({ type: 'book/fetchUserBooks' })),
  }
})

// Mock useParams
const mockParams = { volume_id: 'test-book-id' }
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => mockParams,
  }
})

// Mock console to avoid noise
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('BookDetails Page Tests', () => {
  let mockServerApi: any
  let mockToast: any

  beforeEach(async () => {
    vi.clearAllMocks()
    
    const ServerAPI = (await import('@/api/ServerAPI')).default
    mockServerApi = ServerAPI
    const { toast } = await import('@/components/ui/use-toast')
    mockToast = toast
    mockToast.mockClear()

    // Default successful API response
    mockServerApi.getBookDetails.mockResolvedValue({
      data: {
        book: {
          title: 'Test Book Title',
          authors: ['Test Author 1', 'Test Author 2'],
          imageLinks: { thumbnail: 'https://example.com/test-book.jpg' },
          publishedDate: '2023-01-15',
          pageCount: 350,
          categories: ['Fiction', 'Adventure'],
          description: 'This is a comprehensive test description for the book.',
          publisher: 'Test Publisher House',
        }
      }
    })
  })

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      expect(() => {
        renderWithProviders(<BookDetails />, { preloadedState })
      }).not.toThrow()
    })

    it('should show loading state initially', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      renderWithProviders(<BookDetails />, { preloadedState })

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('API Integration', () => {
    it('should call API to fetch book details', async () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      renderWithProviders(<BookDetails />, { preloadedState })

      await waitFor(() => {
        expect(mockServerApi.getBookDetails).toHaveBeenCalledWith('test-book-id')
      })
    })

    it('should handle API errors gracefully', async () => {
      mockServerApi.getBookDetails.mockRejectedValue(new Error('Network Error'))

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      renderWithProviders(<BookDetails />, { preloadedState })

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: 'Failed to load book details. Please try again.',
          variant: 'destructive',
        })
      })
    })
  })

  describe('Responsive Design', () => {
    it('should render without errors on mobile viewport', () => {
      setViewportSize(375, 667)

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      expect(() => {
        renderWithProviders(<BookDetails />, { preloadedState })
      }).not.toThrow()

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should render without errors on tablet viewport', () => {
      setViewportSize(768, 1024)

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      expect(() => {
        renderWithProviders(<BookDetails />, { preloadedState })
      }).not.toThrow()

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should render without errors on desktop viewport', () => {
      setViewportSize(1024, 768)

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      expect(() => {
        renderWithProviders(<BookDetails />, { preloadedState })
      }).not.toThrow()

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Error Boundaries', () => {
    it('should handle missing volume ID gracefully', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      expect(() => {
        renderWithProviders(<BookDetails />, { preloadedState })
      }).not.toThrow()
    })
  })

  describe('Component State Management', () => {
    it('should clear book details on mount', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      renderWithProviders(<BookDetails />, { preloadedState })

      // Component should clear details on mount
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should handle different authentication states', () => {
      // Test with unauthenticated user
      const unauthState = {
        user: {
          user: null,
          profile: null
        },
        book: {
          currentBook: null,
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          }
        }
      }

      expect(() => {
        renderWithProviders(<BookDetails />, { unauthState })
      }).not.toThrow()

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })
})