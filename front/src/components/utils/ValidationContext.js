import { createContext, useContext } from 'react'
export const ValidationContext = createContext()
export const useValidation = () => useContext(ValidationContext)
