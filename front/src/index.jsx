import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootEl = document.getElementById('app')
if (!rootEl) {
  throw new Error('Expected #app root element')
}
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
