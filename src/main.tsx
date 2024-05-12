import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SnackbarProvider from './hooks/SnackbarProvider.tsx'
import BackdropProvider from './hooks/BackdropProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BackdropProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </BackdropProvider>
  </React.StrictMode>,
)
