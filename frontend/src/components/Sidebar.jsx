import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CheckSquare, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const [colapsada, setColapsada] = useState(false)
  const { sair } = useAuth()

  return (
    <aside className={`flex flex-col bg-primary text-white transition-all duration-200 ${colapsada ? 'w-14' : 'w-52'} min-h-screen shrink-0`}>
      <div className="flex items-center justify-between px-3 py-4 border-b border-primary-light">
        {!colapsada && (
          <span className="font-semibold text-sm tracking-wide">ListTodo</span>
        )}
        <button onClick={() => setColapsada(!colapsada)} className="ml-auto p-1 rounded hover:bg-primary-light">
          {colapsada ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        <NavLink
          to="/tarefas"
          className={({ isActive }) =>
            `flex items-center gap-3 px-2 py-2 rounded text-sm transition-colors ${isActive ? 'bg-primary-light' : 'hover:bg-primary-light'}`
          }
        >
          <CheckSquare size={16} />
          {!colapsada && <span>Tarefas</span>}
        </NavLink>
      </nav>

      <button
        onClick={sair}
        className="flex items-center gap-3 px-4 py-3 text-sm border-t border-primary-light hover:bg-primary-light transition-colors"
      >
        <LogOut size={16} />
        {!colapsada && <span>Sair</span>}
      </button>
    </aside>
  )
}
