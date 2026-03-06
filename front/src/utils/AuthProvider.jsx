import { useState, useCallback, useEffect } from 'react'
import { useAuth, AuthContext } from './auth'

export const AuthProvider = ({ children }) => {
  const { checkAuth } = useAuth()
  const [user, setUser] = useState(null)
  const login = useCallback(async () => {
    const user = await checkAuth()
    setUser(user)
    return user
  }, [checkAuth, setUser])
  const logout = useCallback(() => setUser(null), [setUser])
  useEffect(() => {
    login()
  }, [login]) // once on mount
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
