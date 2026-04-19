import type { LoginCredentials, LoginResponse } from '@/types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Mock response — replace with real API call later
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!credentials.phone || !credentials.password) {
      throw new Error('Invalid credentials')
    }

    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        phone: credentials.phone,
        name: 'Office Manager',
        role: 'company-admin',
        companyId: 'company-1',
        companyName: 'Acme Corporation',
      },
    }
  },

  async changePassword(_currentPassword: string, _newPassword: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { success: true }
  },
}
