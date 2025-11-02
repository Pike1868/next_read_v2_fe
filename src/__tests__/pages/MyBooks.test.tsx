import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, setViewportSize } from '../utils/test-utils'
import MyBooks from '@/pages/MyBooks'
import { BookStatuses } from '@/constants/bookStatuses'

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock the book slice actions with working implementations
vi.mock('@/features/book/bookSlice', async () => {
  const actual = await vi.importActual('@/features/book/bookSlice')
  return {
    ...actual,
    fetchUserBooks: vi.fn(() => async (dispatch: any) => {
      // Mock successful fetch - no action needed for this test
      return Promise.resolve()
    }),
    removeBookFromServer: vi.fn(() => async (dispatch: any) => {
      return Promise.resolve()
    }),
    saveBookToServer: vi.fn(() => async (dispatch: any) => {
      return Promise.resolve()
    }),
  }
})

// Mock console to avoid noise
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('MyBooks Page - Working Tests', () => {
  const mockCurrentlyReadingBooks = [
    {
      id: 1,
      user_book_id: 1,
      google_books_id: 'currently-reading-1',
      title: 'Currently Reading Book 1',
      authors: ['Reading Author 1'],
      thumbnail_url: 'https://example.com/reading1.jpg',
      status: BookStatuses.CURRENTLY_READING,
      current_page: 150,
      page_count: 300,
      start_date: '2024-10-01',
      rating: null,
      progress_percent: 50,
    }
  ]

  const mockCompletedBooks = [
    {
      id: 2,
      user_book_id: 2,
      google_books_id: 'completed-1',
      title: 'Completed Book 1',
      authors: ['Completed Author 1'],
      thumbnail_url: 'https://example.com/completed1.jpg',
      status: BookStatuses.PREVIOUSLY_READ,
      current_page: 400,
      page_count: 400,
      start_date: '2024-09-01',
      end_date: '2024-09-15',
      rating: 5,
      progress_percent: 100,
    }
  ]

  const mockWantToReadBooks = [
    {
      id: 3,
      user_book_id: 3,
      google_books_id: 'want-to-read-1',
      title: 'Want To Read Book 1',
      authors: ['Want Author 1'],
      thumbnail_url: 'https://example.com/want1.jpg',
      status: BookStatuses.WANT_TO_READ,
      current_page: 0,
      page_count: 350,
      start_date: null,
      rating: null,
      progress_percent: 0,
    }
  ]

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  describe('Basic Page Rendering', () => {
    it('should render page header and navigation', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      expect(screen.getByText(/my library/i)).toBeInTheDocument()
      expect(screen.getByText(/manage your reading collection/i)).toBeInTheDocument()
    })

    it('should show tab navigation with book counts', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: mockCompletedBooks,
            wantToRead: mockWantToReadBooks,
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      expect(screen.getByRole('button', { name: /reading.*1/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /completed.*1/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /want to read.*1/i })).toBeInTheDocument()
    })

    it('should display books in currently reading tab by default', async () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      // Wait for loading to complete and books to appear
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })
      expect(screen.getByText('Reading Author 1')).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('should switch to completed books tab', async () => {
      const user = userEvent.setup()
      
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: mockCompletedBooks,
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      const completedTab = screen.getByRole('button', { name: /completed.*1/i })
      await user.click(completedTab)

      expect(screen.getByText('Completed Book 1')).toBeInTheDocument()
      expect(screen.getByText('Completed Author 1')).toBeInTheDocument()
      expect(screen.queryByText('Currently Reading Book 1')).not.toBeInTheDocument()
    })

    it('should switch to want to read tab', async () => {
      const user = userEvent.setup()
      
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: mockWantToReadBooks,
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      const wantToReadTab = screen.getByRole('button', { name: /want to read.*1/i })
      await user.click(wantToReadTab)

      expect(screen.getByText('Want To Read Book 1')).toBeInTheDocument()
      expect(screen.getByText('Want Author 1')).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should show empty state when no books in currently reading', async () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      // Wait for loading to complete first
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      })

      expect(screen.getByText(/no books yet/i)).toBeInTheDocument()
      expect(screen.getByText(/start adding books to your/i)).toBeInTheDocument()
    })

    it('should show zero counts in tab navigation when empty', () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: [],
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      expect(screen.getByRole('button', { name: /reading.*0/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /completed.*0/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /want to read.*0/i })).toBeInTheDocument()
    })
  })

  describe('Book Management', () => {
    it('should show remove buttons for each book', async () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      // Wait for loading to complete and books to appear
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })

      // Look for button containing the trash icon or remove text
      const removeButton = screen.getByRole('button', { name: /remove/i })
      expect(removeButton).toBeInTheDocument()
    })

    it('should show status dropdown for each book', async () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      // Wait for loading to complete and books to appear
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })

      // Look for the combobox (dropdown) for changing status
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should show confirmation dialog when remove is clicked', async () => {
      const user = userEvent.setup()

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      // Wait for loading to complete and books to appear
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove/i })
      await user.click(removeButton)

      expect(screen.getByText(/remove this book/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should adapt layout for mobile (375px)', async () => {
      setViewportSize(375, 667)

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      expect(screen.getByText(/my library/i)).toBeInTheDocument()
      
      // Wait for loading to complete before checking for books
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })
    })

    it('should adapt layout for tablet (768px)', async () => {
      setViewportSize(768, 1024)

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      expect(screen.getByText(/my library/i)).toBeInTheDocument()
      
      // Wait for loading to complete before checking for books
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })
    })

    it('should adapt layout for desktop (1024px)', async () => {
      setViewportSize(1024, 768)

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      expect(screen.getByText(/my library/i)).toBeInTheDocument()
      
      // Wait for loading to complete before checking for books
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })
    })
  })

  describe('Status Badges', () => {
    it('should show correct status badge for currently reading books', async () => {
      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: mockCurrentlyReadingBooks,
            previouslyRead: [],
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      // Wait for loading to complete first
      await waitFor(() => {
        expect(screen.getByText('Currently Reading Book 1')).toBeInTheDocument()
      })

      // Look for the status badge specifically (it has the colored background)
      const statusBadges = screen.getAllByText(/^reading$/i)
      expect(statusBadges.length).toBeGreaterThan(0)
    })

    it('should show correct status badge for completed books', async () => {
      const user = userEvent.setup()

      const preloadedState = {
        user: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          profile: null
        },
        book: {
          savedBooks: {
            currentlyReading: [],
            previouslyRead: mockCompletedBooks,
            wantToRead: [],
          },
          currentBook: null,
        }
      }

      renderWithProviders(<MyBooks />, { preloadedState })

      const completedTab = screen.getByRole('button', { name: /completed.*1/i })
      await user.click(completedTab)

      // Wait for books to load after tab switch
      await waitFor(() => {
        expect(screen.getByText('Completed Book 1')).toBeInTheDocument()
      })

      // Look for status badge within the book card area
      const statusBadges = screen.getAllByText(/^completed$/i)
      expect(statusBadges.length).toBeGreaterThan(0)
    })
  })
})