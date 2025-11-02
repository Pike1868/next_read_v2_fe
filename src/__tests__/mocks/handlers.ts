import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:5000'

export const handlers = [
  http.post(`${BASE_URL}/api/users/sign-up`, async ({ request }) => {
    const body = await request.json() as { username: string; email: string; password: string }
    
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { msg: 'Email already exists' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      {
        username: body.username,
        email: body.email,
        token: 'mock-jwt-token-signup',
      },
      { status: 201 }
    )
  }),

  http.post(`${BASE_URL}/api/users/sign-in`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json(
        {
          username: 'testuser',
          email: body.email,
          token: 'mock-jwt-token-signin',
        },
        { status: 200 }
      )
    }

    return HttpResponse.json(
      { msg: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.get(`${BASE_URL}/api/users/profile`, ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return HttpResponse.json(
        { msg: 'Unauthorized' },
        { status: 401 }
      )
    }

    return HttpResponse.json(
      {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        bio: 'Test bio',
        location: 'Test Location',
        image_url: null,
        created_at: '2024-01-01T00:00:00Z',
      },
      { status: 200 }
    )
  }),

  http.post(`${BASE_URL}/api/users/profile/edit`, async ({ request }) => {
    const body = await request.json() as { bio?: string; location?: string; image_url?: string }
    
    return HttpResponse.json(
      {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        bio: body.bio || 'Test bio',
        location: body.location || 'Test Location',
        image_url: body.image_url || null,
        created_at: '2024-01-01T00:00:00Z',
      },
      { status: 200 }
    )
  }),

  http.post(`${BASE_URL}/api/users/delete`, () => {
    return HttpResponse.json(
      { msg: 'User deleted successfully' },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/books/search`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    const startIndex = url.searchParams.get('startIndex') || '0'

    if (!query) {
      return HttpResponse.json(
        { books: [], query: '', startIndex: 0 },
        { status: 200 }
      )
    }

    return HttpResponse.json(
      {
        books: [
          {
            google_books_id: 'test-id-1',
            title: `Book 1 - ${query}`,
            authors: ['Author 1'],
            thumbnail_url: 'https://example.com/thumb1.jpg',
            published_date: '2023-01-01',
            page_count: 300,
            categories: ['Fiction'],
            retail_price: 15.99,
            currency_code: 'USD',
            description: 'Test description',
            publisher: 'Test Publisher',
            average_rating: 4.5,
            cached: false,
          },
          {
            google_books_id: 'test-id-2',
            title: `Book 2 - ${query}`,
            authors: ['Author 2'],
            thumbnail_url: 'https://example.com/thumb2.jpg',
            published_date: '2023-02-01',
            page_count: 280,
            categories: ['Mystery'],
            retail_price: 14.99,
            currency_code: 'USD',
            description: 'Another test description',
            publisher: 'Another Publisher',
            average_rating: 4.2,
            cached: false,
          },
        ],
        query,
        startIndex: parseInt(startIndex),
      },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/books/search-genre/:genre`, ({ params }) => {
    const { genre } = params

    return HttpResponse.json(
      {
        books: [
          {
            google_books_id: `test-genre-id-1`,
            title: `Genre Book 1 - ${genre}`,
            authors: ['Genre Author 1'],
            thumbnail_url: 'https://example.com/genre-thumb1.jpg',
            published_date: '2023-01-01',
            page_count: 350,
            categories: [genre as string],
            retail_price: 16.99,
            currency_code: 'USD',
            description: 'Genre description',
            publisher: 'Genre Publisher',
            average_rating: 4.6,
            cached: false,
          },
        ],
        genre,
        startIndex: 0,
      },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/books/detail/:volumeId`, ({ params }) => {
    const { volumeId } = params

    return HttpResponse.json(
      {
        google_books_id: volumeId,
        title: 'Test Book Details',
        authors: ['Test Author'],
        description: 'Detailed description of the test book',
        thumbnail_url: 'https://example.com/detail-thumb.jpg',
        published_date: '2023-01-01',
        page_count: 300,
        categories: ['Fiction'],
        retail_price: 15.99,
        currency_code: 'USD',
        publisher: 'Test Publisher',
        language: 'en',
        average_rating: 4.5,
        ratings_count: 1000,
        preview_link: 'https://example.com/preview',
      },
      { status: 200 }
    )
  }),

  http.post(`${BASE_URL}/api/books/save-book`, async ({ request }) => {
    const body = await request.json() as { google_books_id: string; status: string }
    
    return HttpResponse.json(
      {
        msg: 'Book added to library',
        user_book_id: 42,
        google_books_id: body.google_books_id,
        status: body.status,
      },
      { status: 201 }
    )
  }),

  http.post(`${BASE_URL}/api/books/:volumeId/remove`, () => {
    return HttpResponse.json(
      { msg: 'Book removed from library' },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/books/user-books`, () => {
    return HttpResponse.json(
      {
        books: [
          {
            id: 1,
            user_book_id: 1,
            google_books_id: 'user-book-1',
            title: 'User Saved Book 1',
            authors: ['Author 1'],
            thumbnail_url: 'https://example.com/user-book1.jpg',
            status: 'currently_reading',
            current_page: 150,
            page_count: 300,
            start_date: '2024-10-01',
            rating: null,
            progress_percent: 50,
          },
          {
            id: 2,
            user_book_id: 2,
            google_books_id: 'user-book-2',
            title: 'User Saved Book 2',
            authors: ['Author 2'],
            thumbnail_url: 'https://example.com/user-book2.jpg',
            status: 'completed',
            current_page: 320,
            page_count: 320,
            start_date: '2024-09-01',
            end_date: '2024-10-15',
            rating: 5,
            progress_percent: 100,
          },
        ],
      },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/books/featured`, () => {
    return HttpResponse.json(
      {
        bestsellers: [
          {
            google_books_id: 'featured-1',
            title: 'Featured Book 1',
            authors: ['Featured Author 1'],
            thumbnail_url: 'https://example.com/featured1.jpg',
            description: 'Featured description',
            page_count: 400,
            average_rating: 4.8,
            categories: ['Bestseller'],
          },
        ],
      },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/quiz/questions`, () => {
    return HttpResponse.json(
      {
        questions: [
          {
            id: 1,
            question: 'What is your favorite genre?',
            options: ['Fiction', 'Mystery', 'Romance', 'Science Fiction'],
          },
          {
            id: 2,
            question: 'How often do you read?',
            options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
          },
        ],
      },
      { status: 200 }
    )
  }),

  http.post(`${BASE_URL}/api/quiz/submit`, async ({ request }) => {
    const body = await request.json() as { answers: Record<string, unknown> }
    
    return HttpResponse.json(
      {
        message: 'Quiz submitted',
        recommendations: [
          {
            google_books_id: 'rec-1',
            title: 'Recommended Book 1',
            authors: ['Rec Author'],
            thumbnail_url: 'https://example.com/rec1.jpg',
          },
        ],
      },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/quiz/user`, () => {
    return HttpResponse.json(
      {
        id: 1,
        user_id: 1,
        answers: { q1: 'Fiction', q2: 'Weekly' },
        completed_at: '2024-10-26T00:00:00Z',
      },
      { status: 200 }
    )
  }),

  http.post(`${BASE_URL}/api/quiz/retake`, () => {
    return HttpResponse.json(
      { message: 'Quiz reset, ready for retake' },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/recommendations/user`, ({ request }) => {
    const url = new URL(request.url)
    const limit = url.searchParams.get('limit') || '10'

    return HttpResponse.json(
      {
        books: Array.from({ length: parseInt(limit) }, (_, i) => ({
          google_books_id: `rec-book-${i}`,
          title: `Recommendation ${i + 1}`,
          authors: [`Rec Author ${i + 1}`],
          thumbnail_url: `https://example.com/rec-${i}.jpg`,
          description: 'Recommended for you',
          average_rating: 4.5,
        })),
      },
      { status: 200 }
    )
  }),

  http.get(`${BASE_URL}/api/recommendations/book/:bookId`, ({ params }) => {
    const { bookId } = params

    return HttpResponse.json(
      {
        books: [
          {
            google_books_id: `similar-to-${bookId}-1`,
            title: 'Similar Book 1',
            authors: ['Similar Author 1'],
            thumbnail_url: 'https://example.com/similar1.jpg',
            description: 'Similar to the book you searched',
            average_rating: 4.4,
          },
          {
            google_books_id: `similar-to-${bookId}-2`,
            title: 'Similar Book 2',
            authors: ['Similar Author 2'],
            thumbnail_url: 'https://example.com/similar2.jpg',
            description: 'Also similar to your search',
            average_rating: 4.3,
          },
        ],
      },
      { status: 200 }
    )
  }),

  http.post(`${BASE_URL}/api/recommendations/regenerate`, () => {
    return HttpResponse.json(
      { message: 'Recommendations regenerated', total: 10 },
      { status: 200 }
    )
  }),
]
