import { useAuth } from '../contexts/AuthContext'

export default function Tarefas() {
  const { sair } = useAuth()

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <button onClick={sair}>Sair</button>
    </div>
  )
}
