import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const ACCOUNTS_KEY = 'rolling_rampage_accounts'
const SESSION_KEY = 'rolling_rampage_session'

interface Account { username: string; password: string }

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as Account[]) : []
  } catch { return [] }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function saveStateKey(username: string) {
  return `rolling_rampage_state_${username.toLowerCase()}`
}

interface AuthContextValue {
  currentUser: string | null
  login: (username: string, password: string) => string | null
  register: (username: string, password: string) => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  )

  const login = useCallback((username: string, password: string): string | null => {
    if (!username.trim() || !password) return 'Username and password required.'
    const accounts = loadAccounts()
    const account = accounts.find(
      (a) => a.username.toLowerCase() === username.toLowerCase()
    )
    if (!account) return 'Account not found.'
    if (account.password !== password) return 'Incorrect password.'
    localStorage.setItem(SESSION_KEY, account.username)
    setCurrentUser(account.username)
    return null
  }, [])

  const register = useCallback((username: string, password: string): string | null => {
    if (!username.trim()) return 'Username cannot be empty.'
    if (username.length < 3) return 'Username must be at least 3 characters.'
    if (username.length > 20) return 'Username must be 20 characters or fewer.'
    if (!password) return 'Password cannot be empty.'
    if (password.length < 4) return 'Password must be at least 4 characters.'
    const accounts = loadAccounts()
    if (accounts.some((a) => a.username.toLowerCase() === username.toLowerCase()))
      return 'Username already taken.'
    saveAccounts([...accounts, { username: username.trim(), password }])
    localStorage.setItem(SESSION_KEY, username.trim())
    setCurrentUser(username.trim())
    return null
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
