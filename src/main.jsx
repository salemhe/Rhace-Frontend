import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LocationProvider } from './contexts/LocationContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <LocationProvider>
          <App />
        </LocationProvider>
        <Toaster />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
