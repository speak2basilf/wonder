import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  roles: string[]
  login: (accessToken: string, roles: string[]) => void
  logout: () => void
}

const useAuth = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  roles: [],
  login: (accessToken: string, roles: string[]) => {
    localStorage.setItem('accessToken', accessToken)
    set({ accessToken, isAuthenticated: true, roles })
  },
  logout: () => {
    localStorage.removeItem('accessToken')
    set({ accessToken: null, isAuthenticated: false, roles: [] })
  }
}))

export default useAuth