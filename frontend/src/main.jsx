import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/Appcontext.jsx'

createRoot(document.getElementById('root')).render(
  //strictmode --> helps to find bugs in development
  <StrictMode>     
    <BrowserRouter>   
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
)
