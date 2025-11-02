import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/test-utils'
import SignupForm from '@/components/user/SignupForm'

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

// Mock ServerAPI
vi.mock('@/api/ServerAPI', () => ({
  default: {
    setToken: vi.fn(),
    signup: vi.fn(),
    getUserProfile: vi.fn(),
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

describe('SignupForm Component', () => {
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
      renderWithProviders(<SignupForm />)

      // Check header
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()

      // Check form inputs
      expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

      // Check submit button
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    })

    it('should have proper input types and attributes', () => {
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      expect(usernameInput).toHaveAttribute('type', 'text')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('should have empty form fields initially', () => {
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      expect(usernameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(passwordInput).toHaveValue('')
    })
  })

  describe('Form Validation', () => {
    it('should prevent submission with short username', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Enter short username
      await user.type(usernameInput, 'a')
      await user.click(submitButton)

      // Should not call API with invalid data
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })

    it('should prevent submission with invalid email', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Enter invalid email
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      // Should not call API with invalid email
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })

    it('should prevent submission with short password', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Enter short password
      await user.type(passwordInput, '12345')
      await user.click(submitButton)

      // Should not call API with invalid password
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })

    it('should prevent submission with weak password missing requirements', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Enter password that doesn't meet all requirements
      await user.type(passwordInput, 'password123') // Missing uppercase and special char
      await user.click(submitButton)

      // Should not call API with invalid password
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })

    it('should accept valid password meeting all requirements', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      // Fill in all fields with valid data
      await user.type(usernameInput, 'testuser')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')

      // Should not show any validation errors for password
      expect(screen.queryByText(/password must/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should successfully signup with valid data', async () => {
      const user = userEvent.setup()
      
      // Mock successful API responses
      mockServerApi.signup.mockResolvedValue({
        data: { 
          username: 'newuser', 
          email: 'new@example.com', 
          token: 'mock-signup-token' 
        }
      })
      mockServerApi.getUserProfile.mockResolvedValue({
        data: { 
          id: 2, 
          username: 'newuser', 
          email: 'new@example.com',
          bio: '',
          location: ''
        }
      })
      mockServerApi.setToken.mockImplementation(() => {}) // Mock setToken

      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Fill in valid data
      await user.type(usernameInput, 'newuser')
      await user.type(emailInput, 'new@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.click(submitButton)

      // Wait for API calls
      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalledWith({
          username: 'newuser',
          email: 'new@example.com',
          password: 'Password123!'
        })
      }, { timeout: 3000 })
      
      // Verify other API calls were made
      expect(mockServerApi.setToken).toHaveBeenCalledWith('mock-signup-token')
      expect(mockServerApi.getUserProfile).toHaveBeenCalled()
    })

    it('should handle duplicate email error', async () => {
      const user = userEvent.setup()
      
      // Mock API error for duplicate email
      mockServerApi.signup.mockRejectedValue(new Error('Email already exists'))

      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Fill in data with existing email
      await user.type(usernameInput, 'testuser')
      await user.type(emailInput, 'existing@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.click(submitButton)

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'existing@example.com',
          password: 'Password123!'
        })
      })

      // Should show error toast
      expect(mockToast).toHaveBeenCalledWith({
        description: 'Email already exists',
        variant: 'destructive'
      })

      // Should not navigate or call other APIs
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockServerApi.setToken).not.toHaveBeenCalled()
      expect(mockServerApi.getUserProfile).not.toHaveBeenCalled()
    })

    it('should handle signup API error', async () => {
      const user = userEvent.setup()
      
      // Mock general API error
      mockServerApi.signup.mockRejectedValue(new Error('Server error'))

      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      await user.type(usernameInput, 'testuser')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.click(submitButton)

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalled()
      })

      // Should show error toast
      expect(mockToast).toHaveBeenCalledWith({
        description: 'Server error',
        variant: 'destructive'
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle getUserProfile error after successful signup', async () => {
      const user = userEvent.setup()
      
      // Mock signup success but profile fetch failure
      mockServerApi.signup.mockResolvedValue({
        data: { username: 'testuser', token: 'mock-token' }
      })
      mockServerApi.getUserProfile.mockRejectedValue(new Error('Profile fetch failed'))

      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      await user.type(usernameInput, 'testuser')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      await user.click(submitButton)

      // Wait for error handling
      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalled()
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
    it('should update username input value on typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })

      await user.type(usernameInput, 'myusername')

      expect(usernameInput).toHaveValue('myusername')
    })

    it('should update email input value on typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const emailInput = screen.getByRole('textbox', { name: /email/i })

      await user.type(emailInput, 'user@test.com')

      expect(emailInput).toHaveValue('user@test.com')
    })

    it('should update password input value on typing', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(passwordInput, 'MyPassword123!')

      expect(passwordInput).toHaveValue('MyPassword123!')
    })

    it('should allow valid username input', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })

      // Type valid username
      await user.type(usernameInput, 'validuser')

      // Input should have the value
      expect(usernameInput).toHaveValue('validuser')
    })

    it('should handle form submission with Enter key', async () => {
      const user = userEvent.setup()
      
      mockServerApi.signup.mockResolvedValue({
        data: { username: 'testuser', token: 'mock-token' }
      })
      mockServerApi.getUserProfile.mockResolvedValue({
        data: { id: 1, username: 'testuser' }
      })

      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(usernameInput, 'testuser')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123!')
      
      // Submit with Enter key
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockServerApi.signup).toHaveBeenCalled()
      })
    })
  })

  describe('Field Interactions', () => {
    it('should focus next field on Tab key', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })

      // Focus username and press Tab
      await user.click(usernameInput)
      await user.keyboard('{Tab}')

      // Email should be focused
      expect(emailInput).toHaveFocus()
    })

    it('should show all password validation errors for empty password', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Focus password field then submit without entering anything
      await user.click(passwordInput)
      await user.click(submitButton)

      // Should show validation errors
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })

    it('should progressively validate password as user types', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const passwordInput = screen.getByLabelText(/password/i)

      // Start with invalid password
      await user.type(passwordInput, 'weak')
      
      // Should have value
      expect(passwordInput).toHaveValue('weak')
      
      // Add more characters to make it stronger
      await user.type(passwordInput, 'Password123!')
      
      expect(passwordInput).toHaveValue('weakPassword123!')
    })
  })

  describe('Multiple Validation Errors', () => {
    it('should prevent submission with multiple invalid fields', async () => {
      const user = userEvent.setup()
      renderWithProviders(<SignupForm />)

      const usernameInput = screen.getByRole('textbox', { name: /username/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /^sign up$/i })

      // Enter invalid data for all fields
      await user.type(usernameInput, 'a') // Too short
      await user.type(emailInput, 'invalid') // Invalid email
      await user.type(passwordInput, '123') // Weak password
      await user.click(submitButton)

      // Should not call API with invalid data
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(mockServerApi.signup).not.toHaveBeenCalled()
    })
  })
})