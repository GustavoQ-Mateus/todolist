import { useAuth } from '../contexts/AuthContext'

export default function Header({ titulo }) {
  const { usuario } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
      <h1 className="text-sm font-semibold text-gray-800">{titulo}</h1>
      {usuario && (
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
          {usuario.username || usuario.email}
        </span>
      )}
    </header>
  )
}
