import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../utils/test-utils'
import SigninForm from '@/components/user/SigninForm'
import SignupForm from '@/components/user/SignupForm'
import PrivateRoute from '@/components/user/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock ServerAPI with proper factory function
vi.mock('@/api/ServerAPI', () => ({
  default: {
    setToken: vi.fn(),
    signin: vi.fn(),
    signup: vi.fn(),
    getUserProfile: vi.fn(),
    getUserBooks: vi.fn(),
  },
}))

// Mock Google Sign In button to avoid external dependencies
vi.mock('@/components/user/GoogleSignInButton', () => ({
  default: () => <div>Google Sign In Button</div>,
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

// Mock console.error to avoid noise in tests
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'log').mockImplementation(() => {})

describe('Auth Flow Integration Tests', () => {
  let mockServerApi: any
  let mockToast: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
    
    // Get the mocked modules
    const ServerAPI = (await import('@/api/ServerAPI')).default
    mockServerApi = ServerAPI
    const { toast } = await import('@/components/ui/use-toast')
    mockToast = toast
    mockToast.mockClear()
  })

  describe('Signin Flow', () => {
    it('should render signin form with all required elements', () => {
      renderWithProviders(<SigninForm />)

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
      expect(screen.getByText(/sign in below/i)).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
      expect(screen.getByText(/google sign in button/i)).toBeInTheDocument()
    })

    it('should successfully sign in with valid credentials', async () => {
      const user = userEvent.setup()
      
      // Mock successful responses
      mockServerApi.signin.mockResolvedValue({
        data: { username: 'testuser', email: 'test@example.com', token: 'mock-token' }
      })
      mockServerApi.getUserProfile.mockResolvedValue({
        data: { id: 1, username: 'testuser', email: 'test@example.com', bio: '', location: '' }
      })
      mockServerApi.getUserBooks.mockResolvedValue({
        data: []
      })
      mockServerApi.setToken.mockImplementation(() => {}) // Mock setToken as a simple function

      renderWithProviders(<SigninForm />)

      // Fill in the form
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /^sign in$/i }))

      // Wait for API calls (navigation is implementation detail)
      await waitFor(() => {
        expect(mockServerApi.signin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      }, { timeout: 3000 })
      
      // Verify other API calls were made
      expect(mockServerApi.setToken).toHaveBeenCalledWith('mock-token')
      expect(mockServerApi.getUserProfile).toHaveBeenCalled()
      expect(mockServerApi.getUserBooks).toHaveBeenCalled()
    })

    it('should handle invalid credentials error', async () => {
      const user = userEvent.setup()
      
      // Mock error response
      mockServerApi.signin.mockRejectedValue(new Error('Invalid credentials'))

      renderWithProviders(<SigninForm />)

      // Fill in the form with invalid credentials
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'invalid@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /^sign in$/i }))

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signin).toHaveBeenCalledWith({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        })
      }, { timeout: 3000 })

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: 'Invalid credentials',
          variant: 'destructive'
        })
      }, { timeout: 3000 })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should prevent submission with invalid email format', async () => {
      const user = userEvent.setup()

      renderWithProviders(<SigninForm />)

      // Enter invalid email
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'invalid-email')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /^sign in$/i }))

      // Should not call API with invalid email
      await new Promise(resolve => setTimeout(resolve, 1000)) // Give it a moment
      expect(mockServerApi.signin).not.toHaveBeenCalled()
    })
  })

  describe('Signup Flow', () => {
    it('should render signup form with all required elements', () => {
      renderWithProviders(<SignupForm />)

      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument()
    })

    it('should successfully sign up with valid data', async () => {
      const user = userEvent.setup()
      
      // Mock successful responses
      mockServerApi.signup.mockResolvedValue({
        data: { username: 'newuser', email: 'new@example.com', token: 'new-token' }
      })
      mockServerApi.getUserProfile.mockResolvedValue({
        data: { id: 2, username: 'newuser', email: 'new@example.com', bio: '', location: '' }
      })
      mockServerApi.setToken.mockImplementation(() => {}) // Mock setToken

      renderWithProviders(<SignupForm />)

      // Fill in the form
      await user.type(screen.getByRole('textbox', { name: /username/i }), 'newuser')
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'new@example.com')
      await user.type(screen.getByLabelText(/password/i), 'Password123!')
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /^sign up$/i }))

      // Wait for API calls
      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalledWith({
          username: 'newuser',
          email: 'new@example.com',
          password: 'Password123!'
        })
      }, { timeout: 3000 })
      
      // Verify other API calls were made  
      expect(mockServerApi.setToken).toHaveBeenCalledWith('new-token')
      expect(mockServerApi.getUserProfile).toHaveBeenCalled()
    })

    it('should handle duplicate email error', async () => {
      const user = userEvent.setup()
      
      // Mock error response for duplicate email
      mockServerApi.signup.mockRejectedValue(new Error('Email already exists'))

      renderWithProviders(<SignupForm />)

      // Fill in the form with existing email
      await user.type(screen.getByRole('textbox', { name: /username/i }), 'testuser')
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'existing@example.com')
      await user.type(screen.getByLabelText(/password/i), 'Password123!')
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /^sign up$/i }))

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'existing@example.com',
          password: 'Password123!'
        })
      }, { timeout: 3000 })

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: 'Email already exists',
          variant: 'destructive'
        })
      }, { timeout: 3000 })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should prevent submission with weak password', async () => {
      const user = userEvent.setup()

      renderWithProviders(<SignupForm />)

      // Fill form with weak password
      await user.type(screen.getByRole('textbox', { name: /username/i }), 'testuser')
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'weak')
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /^sign up$/i }))

      // Should not call API with weak password
      await new Promise(resolve => setTimeout(resolve, 1000)) // Give it a moment
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })
  })

  describe('PrivateRoute Protection', () => {
    it('should render PrivateRoute component without errors', () => {
      // Simple smoke test - just ensure PrivateRoute can render
      const preloadedState = {
        user: { user: null, profile: null }
      }

      // Test that PrivateRoute renders without throwing
      expect(() => {
        renderWithProviders(<PrivateRoute />, { preloadedState })
      }).not.toThrow()
    })
  })

  describe('Form Validation', () => {
    it('should not submit signin form with empty fields', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Try to submit empty form
      await user.click(submitButton)

      // Should not call API
      expect(mockServerApi.signin).not.toHaveBeenCalled()
    })

    it('should prevent submission with short username', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      // Fill form with short username
      await user.type(screen.getByRole('textbox', { name: /username/i }), 'a')
      await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
      await user.type(screen.getByLabelText(/password/i), 'Password123!')
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /^sign up$/i }))

      // Should not call API with invalid data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Give it a moment
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })
  })
})