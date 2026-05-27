import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarTarefas, criarTarefa } from '../services/tarefas'

export default function Tarefas() {
  const { sair } = useAuth()
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarTarefas()
  }, [])

  async function buscarTarefas() {
    try {
      const { data } = await listarTarefas()
      setTarefas(data.results)
    } catch {
      setErro('Erro ao carregar tarefas.')
    }
  }

  async function handleCriar(e) {
    e.preventDefault()
    setErro('')
    try {
      await criarTarefa({ titulo })
      setTitulo('')
      buscarTarefas()
    } catch {
      setErro('Erro ao criar tarefa.')
    }
  }

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <button onClick={sair}>Sair</button>

      <form onSubmit={handleCriar}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      {erro && <p>{erro}</p>}

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>{tarefa.titulo}</li>
        ))}
      </ul>
    </div>
  )
}
