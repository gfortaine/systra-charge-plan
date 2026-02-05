import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './main.css'
import App from './App.jsx'

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
