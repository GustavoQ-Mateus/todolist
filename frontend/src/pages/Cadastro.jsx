import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Cadastro() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navegar = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      await api.post('/usuarios/cadastro/', { username, email, senha })
      navegar('/login')
    } catch {
      setErro('Erro ao criar conta. Verifique os dados.')
    }
  }

  return (
    <div>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        {erro && <p>{erro}</p>}
        <button type="submit">Cadastrar</button>
      </form>
      <p><Link to="/login">Já tenho conta</Link></p>
    </div>
  )
}
