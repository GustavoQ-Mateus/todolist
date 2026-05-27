import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa, compartilharTarefa } from '../services/tarefas'
import { listarCategorias } from '../services/categorias'

export default function Tarefas() {
  const { sair } = useAuth()
  const [tarefas, setTarefas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [compartilhando, setCompartilhando] = useState(null)
  const [usernameCompartilhar, setUsernameCompartilhar] = useState('')
  const [permissao, setPermissao] = useState('leitura')
  const [filtros, setFiltros] = useState({ concluida: '', categoria: '', prioridade: '' })
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscarTarefas()
    buscarCategorias()
  }, [filtros])

  async function buscarTarefas() {
    try {
      const params = {}
      if (filtros.concluida !== '') params.concluida = filtros.concluida
      if (filtros.categoria !== '') params.categoria = filtros.categoria
      if (filtros.prioridade !== '') params.prioridade = filtros.prioridade
      const { data } = await listarTarefas(params)
      setTarefas(data.results)
    } catch {
      setErro('Erro ao carregar tarefas.')
    }
  }

  async function buscarCategorias() {
    try {
      const { data } = await listarCategorias()
      setCategorias(data.results)
    } catch {
      setErro('Erro ao carregar categorias.')
    }
  }

  async function handleCriar(e) {
    e.preventDefault()
    setErro('')
    const dados = { titulo }
    if (categoria) dados.categoria = categoria
    try {
      await criarTarefa(dados)
      setTitulo('')
      setCategoria('')
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

  async function handleCompartilhar(e) {
    e.preventDefault()
    setErro('')
    try {
      await compartilharTarefa(compartilhando, { usuario_username: usernameCompartilhar, permissao })
      setCompartilhando(null)
      setUsernameCompartilhar('')
      setPermissao('leitura')
    } catch {
      setErro('Erro ao compartilhar. Verifique o username.')
    }
  }

  function handleFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <button onClick={sair}>Sair</button>

      <div>
        <select name="concluida" value={filtros.concluida} onChange={handleFiltro}>
          <option value="">Todas</option>
          <option value="true">Concluídas</option>
          <option value="false">Pendentes</option>
        </select>

        <select name="prioridade" value={filtros.prioridade} onChange={handleFiltro}>
          <option value="">Qualquer prioridade</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>

        <select name="categoria" value={filtros.categoria} onChange={handleFiltro}>
          <option value="">Qualquer categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleCriar}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Sem categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
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
            <button onClick={() => setCompartilhando(tarefa.id)}>Compartilhar</button>
            <button onClick={() => handleExcluir(tarefa.id)}>Excluir</button>

            {compartilhando === tarefa.id && (
              <form onSubmit={handleCompartilhar}>
                <input
                  type="text"
                  placeholder="Username"
                  value={usernameCompartilhar}
                  onChange={(e) => setUsernameCompartilhar(e.target.value)}
                  required
                />
                <select value={permissao} onChange={(e) => setPermissao(e.target.value)}>
                  <option value="leitura">Leitura</option>
                  <option value="edicao">Edição</option>
                </select>
                <button type="submit">Confirmar</button>
                <button type="button" onClick={() => setCompartilhando(null)}>Cancelar</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
