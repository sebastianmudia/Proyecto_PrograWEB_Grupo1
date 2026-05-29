import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginUsuario from './Componentes/Login/LoginUsuario.jsx'
import PaginaPrincipal from './Componentes/Principal/paginaprincipal.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  
  {
    path: "login",
    element: <LoginUsuario />
  },
  {
    path: "paginaprincipal",
    element: <PaginaPrincipal/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)