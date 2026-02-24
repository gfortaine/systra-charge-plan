import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { backUrl } from './config'
// styles
import '@scss/main.scss'

console.assert(backUrl)

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
