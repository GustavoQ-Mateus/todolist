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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-primary">ListTodo</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <button
            type="submit"
            className="bg-primary text-white text-sm font-medium py-2 rounded hover:bg-primary-light transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-primary font-medium hover:underline">
            Criar conta
          </Link>
        </p>

      </div>
    </div>
  )
}
