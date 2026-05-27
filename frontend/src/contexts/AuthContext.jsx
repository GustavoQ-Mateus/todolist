import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  async function entrar(email, senha) {
    const { data } = await api.post('/usuarios/login/', { email, password: senha })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    setUsuario({ email })
  }

  function sair() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
