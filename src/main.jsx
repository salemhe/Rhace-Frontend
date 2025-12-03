import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { WebSocketProvider } from './contexts/WebSocketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
          <WebSocketProvider url="https://rhace-backend-mkne.onrender.com">
            <App />
            <Toaster />
          </WebSocketProvider>
        </BrowserRouter>
  </StrictMode>,
)
