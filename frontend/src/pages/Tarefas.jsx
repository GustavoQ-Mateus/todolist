import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa } from '../services/tarefas'

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

  async function handleConcluir(tarefa) {
    try {
      await atualizarTarefa(tarefa.id, { concluida: !tarefa.concluida })
      buscarTarefas()
    } catch {
      setErro('Erro ao atualizar tarefa.')
    }
  }

  async function handleExcluir(id) {
    try {
      await excluirTarefa(id)
      buscarTarefas()
    } catch {
      setErro('Erro ao excluir tarefa.')
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
          <li key={tarefa.id}>
            <input
              type="checkbox"
              checked={tarefa.concluida}
              onChange={() => handleConcluir(tarefa)}
            />
            {tarefa.titulo}
            <button onClick={() => handleExcluir(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
