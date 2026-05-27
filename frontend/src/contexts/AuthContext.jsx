import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const access = localStorage.getItem('access')
    const username = localStorage.getItem('username')
    const email = localStorage.getItem('email')
    if (access && (username || email)) {
      setUsuario({ username, email })
    }
  }, [])

  async function entrar(email, senha) {
    const { data } = await api.post('/usuarios/login/', { email, password: senha })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('email', email)
    const perfil = await api.get('/usuarios/me/', { headers: { Authorization: `Bearer ${data.access}` } })
    localStorage.setItem('username', perfil.data.username)
    setUsuario({ username: perfil.data.username, email })
  }

  function sair() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
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
