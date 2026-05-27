import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { entrar } = useAuth()
  const navegar = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      await entrar(email, senha)
      navegar('/tarefas')
    } catch {
      setErro('Email ou senha inválidos.')
    }
  }

  return (
    <div>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Entrar</button>
      </form>
      <p><Link to="/cadastro">Criar conta</Link></p>
    </div>
  )
}
