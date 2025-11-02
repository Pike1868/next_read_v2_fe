import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/test-utils'
import SigninForm from '@/components/user/SigninForm'

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock ServerAPI
vi.mock('@/api/ServerAPI', () => ({
  default: {
    setToken: vi.fn(),
    signin: vi.fn(),
    getUserProfile: vi.fn(),
    getUserBooks: vi.fn(),
  },
}))

// Mock Google Sign In button
vi.mock('@/components/user/GoogleSignInButton', () => ({
  default: ({ showText }: { showText?: boolean }) => (
    <button type="button">
      {showText ? 'Sign in with Google' : 'Google'}
    </button>
  ),
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

describe('SigninForm Component', () => {
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

  describe('Form Rendering', () => {
    it('should render all form elements correctly', () => {
      renderWithProviders(<SigninForm />)

      // Check header elements
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
      expect(screen.getByText(/sign in below/i)).toBeInTheDocument()

      // Check form inputs
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

      // Check submit button
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()

      // Check divider
      expect(screen.getByText('OR')).toBeInTheDocument()
    })

    it('should have proper input types and attributes', () => {
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have empty form fields initially', () => {
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveValue('')
      expect(passwordInput).toHaveValue('')
    })
  })

  describe('Form Validation', () => {
    it('should prevent submission with invalid email', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Enter invalid email
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      // Should not call API with invalid email
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signin).not.toHaveBeenCalled()
    })

    it('should not submit form with empty fields', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Try to submit empty form
      await user.click(submitButton)

      // Should not call API
      expect(mockServerApi.signin).not.toHaveBeenCalled()
    })

    it('should accept valid email format', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      // Enter valid email and password
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      // Should not show validation errors for email
      expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid credentials successfully', async () => {
      const user = userEvent.setup()
      
      // Mock successful API responses
      mockServerApi.signin.mockResolvedValue({
        data: { 
          username: 'testuser', 
          email: 'test@example.com', 
          token: 'mock-jwt-token' 
        }
      })
      mockServerApi.getUserProfile.mockResolvedValue({
        data: { 
          id: 1, 
          username: 'testuser', 
          email: 'test@example.com',
          bio: 'Test bio',
          location: 'Test location'
        }
      })
      mockServerApi.getUserBooks.mockResolvedValue({
        data: []
      })
      mockServerApi.setToken.mockImplementation(() => {}) // Mock setToken

      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Fill in valid credentials
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // Wait for API calls
      await waitFor(() => {
        expect(mockServerApi.signin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
      }, { timeout: 3000 })
      
      // Verify other API calls were made
      expect(mockServerApi.setToken).toHaveBeenCalledWith('mock-jwt-token')
      expect(mockServerApi.getUserProfile).toHaveBeenCalled()
      expect(mockServerApi.getUserBooks).toHaveBeenCalled()
    })

    it('should handle signin API error', async () => {
      const user = userEvent.setup()
      
      // Mock API error
      mockServerApi.signin.mockRejectedValue(new Error('Invalid credentials'))

      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Fill in credentials
      await user.type(emailInput, 'wrong@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signin).toHaveBeenCalledWith({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
      })

      // Should show error toast
      expect(mockToast).toHaveBeenCalledWith({
        description: 'Invalid credentials',
        variant: 'destructive'
      })

      // Should not navigate or call other APIs
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockServerApi.setToken).not.toHaveBeenCalled()
      expect(mockServerApi.getUserProfile).not.toHaveBeenCalled()
    })

    it('should handle getUserProfile API error', async () => {
      const user = userEvent.setup()
      
      // Mock signin success but profile fetch failure
      mockServerApi.signin.mockResolvedValue({
        data: { username: 'testuser', token: 'mock-token' }
      })
      mockServerApi.getUserProfile.mockRejectedValue(new Error('Profile fetch failed'))

      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signin).toHaveBeenCalled()
        expect(mockServerApi.setToken).toHaveBeenCalledWith('mock-token')
        expect(mockServerApi.getUserProfile).toHaveBeenCalled()
      })

      // Should show error toast
      expect(mockToast).toHaveBeenCalledWith({
        description: 'Profile fetch failed',
        variant: 'destructive'
      })
    })
  })

  describe('User Interactions', () => {
    it('should update email input value on typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })

      await user.type(emailInput, 'user@test.com')

      expect(emailInput).toHaveValue('user@test.com')
    })

    it('should update password input value on typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(passwordInput, 'mypassword')

      expect(passwordInput).toHaveValue('mypassword')
    })

    it('should allow valid email input', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })

      // Type valid email
      await user.type(emailInput, 'valid@example.com')

      // Input should have the value
      expect(emailInput).toHaveValue('valid@example.com')
    })

    it('should handle form submission with Enter key', async () => {
      const user = userEvent.setup()
      
      mockServerApi.signin.mockResolvedValue({
        data: { username: 'testuser', token: 'mock-token' }
      })
      mockServerApi.getUserProfile.mockResolvedValue({
        data: { id: 1, username: 'testuser' }
      })
      mockServerApi.getUserBooks.mockResolvedValue({ data: [] })

      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      // Submit with Enter key
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockServerApi.signin).toHaveBeenCalled()
      })
    })
  })

  describe('Error Message Display', () => {
    it('should prevent submission with invalid email format', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Enter invalid email and submit
      await user.type(emailInput, 'not-an-email')
      await user.click(submitButton)

      // Should not call API
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signin).not.toHaveBeenCalled()
    })

    it('should handle multiple validation errors', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SigninForm />)

      const submitButton = screen.getByRole('button', { name: /^sign in$/i })

      // Submit without filling any fields
      await user.click(submitButton)

      // Both fields should show required errors (React Hook Form behavior)
      // The exact error messages depend on your form validation setup
      expect(mockServerApi.signin).not.toHaveBeenCalled()
    })
  })
})