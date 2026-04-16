import { createContext, useContext } from 'react'

export const ValidationContext = createContext(null)
export const useValidation = () => {
  const ctx = useContext(ValidationContext)
  if (!ctx) {
    throw new Error('useValidation must be used within a ValidationContext provider')
  }
  return ctx
}
