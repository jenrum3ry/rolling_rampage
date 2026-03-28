import { useState, useCallback } from 'react'

const ACCOUNTS_KEY = 'rolling_rampage_accounts'

interface Account {
  username: string
  password: string
}

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as Account[]) : []
  } catch {
    return []
  }
}

function saveAccounts(accounts: Account[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

const SESSION_KEY = 'rolling_rampage_session'

function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function saveStateKey(username: string): string {
  return `rolling_rampage_state_${username.toLowerCase()}`
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<string | null>(loadSession)

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

  const register = useCallback(
    (username: string, password: string): string | null => {
      if (!username.trim()) return 'Username cannot be empty.'
      if (username.length < 3) return 'Username must be at least 3 characters.'
      if (username.length > 20) return 'Username must be 20 characters or fewer.'
      if (!password) return 'Password cannot be empty.'
      if (password.length < 4) return 'Password must be at least 4 characters.'

      const accounts = loadAccounts()
      const exists = accounts.some(
        (a) => a.username.toLowerCase() === username.toLowerCase()
      )
      if (exists) return 'Username already taken.'

      const updated = [...accounts, { username: username.trim(), password }]
      saveAccounts(updated)
      localStorage.setItem(SESSION_KEY, username.trim())
      setCurrentUser(username.trim())
      return null
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }, [])

  return { currentUser, login, register, logout }
}
