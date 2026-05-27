import { useAuth } from '../contexts/AuthContext'

export default function Header({ titulo }) {
  const { usuario } = useAuth()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <h1 className="text-base font-semibold text-gray-800">{titulo}</h1>
      {usuario && (
        <span className="text-sm text-gray-500">{usuario.username || usuario.email}</span>
      )}
    </header>
  )
}
