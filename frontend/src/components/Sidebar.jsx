import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CheckSquare, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const [colapsada, setColapsada] = useState(false)
  const { sair } = useAuth()
  const navegar = useNavigate()

  function handleSair() {
    sair()
    navegar('/login')
  }

  return (
    <aside className={`flex flex-col bg-white border-r border-gray-100 transition-all duration-200 ${colapsada ? 'w-14' : 'w-52'} min-h-screen shrink-0`}>

      <div className="flex items-center justify-between px-3 py-4 border-b border-gray-100">
        {!colapsada && (
          <span className="font-semibold text-sm text-primary tracking-wide">ListTodo</span>
        )}
        <button
          onClick={() => setColapsada(!colapsada)}
          className="ml-auto p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary-muted transition-colors duration-150 cursor-pointer"
          aria-label={colapsada ? 'Expandir menu' : 'Recolher menu'}
        >
          {colapsada ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        <NavLink
          to="/tarefas"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors duration-150 cursor-pointer ${
              isActive
                ? 'bg-primary-muted text-primary font-medium border-l-2 border-primary'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`
          }
        >
          <CheckSquare size={15} />
          {!colapsada && <span>Tarefas</span>}
        </NavLink>
      </nav>

      <button
        onClick={handleSair}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 border-t border-gray-100 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
        aria-label="Sair"
      >
        <LogOut size={15} />
        {!colapsada && <span>Sair</span>}
      </button>

    </aside>
  )
}
