import { useState, useEffect } from 'react'
import { Plus, Trash2, Share2, X } from 'lucide-react'
import Layout from '../components/Layout'
import { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa, compartilharTarefa } from '../services/tarefas'
import { listarCategorias } from '../services/categorias'

export default function Tarefas() {
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
    } catch {}
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
      setErro('Usuário não encontrado.')
    }
  }

  function handleFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  const selectClass = 'border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white text-gray-700'

  return (
    <Layout titulo="Tarefas">

      <div className="flex flex-col gap-6 max-w-3xl">

        <div className="flex flex-wrap gap-2">
          <select name="concluida" value={filtros.concluida} onChange={handleFiltro} className={selectClass}>
            <option value="">Todas</option>
            <option value="true">Concluídas</option>
            <option value="false">Pendentes</option>
          </select>
          <select name="prioridade" value={filtros.prioridade} onChange={handleFiltro} className={selectClass}>
            <option value="">Prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <select name="categoria" value={filtros.categoria} onChange={handleFiltro} className={selectClass}>
            <option value="">Categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleCriar} className="flex gap-2">
          <input
            type="text"
            placeholder="Nova tarefa..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={selectClass}>
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 bg-primary text-white text-sm px-3 py-2 rounded hover:bg-primary-light transition-colors"
          >
            <Plus size={15} />
            Adicionar
          </button>
        </form>

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded bg-white">
          {tarefas.length === 0 && (
            <p className="text-sm text-gray-400 px-4 py-6 text-center">Nenhuma tarefa encontrada.</p>
          )}
          {tarefas.map((tarefa) => (
            <div key={tarefa.id} className="flex flex-col">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={tarefa.concluida}
                  onChange={() => handleConcluir(tarefa)}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className={`flex-1 text-sm ${tarefa.concluida ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {tarefa.titulo}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCompartilhando(compartilhando === tarefa.id ? null : tarefa.id)}
                    className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary-muted transition-colors"
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={() => handleExcluir(tarefa.id)}
                    className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {compartilhando === tarefa.id && (
                <form onSubmit={handleCompartilhar} className="flex items-center gap-2 px-4 py-2 bg-primary-muted border-t border-gray-100">
                  <input
                    type="text"
                    placeholder="Username"
                    value={usernameCompartilhar}
                    onChange={(e) => setUsernameCompartilhar(e.target.value)}
                    required
                    className="border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <select value={permissao} onChange={(e) => setPermissao(e.target.value)} className={selectClass}>
                    <option value="leitura">Leitura</option>
                    <option value="edicao">Edição</option>
                  </select>
                  <button type="submit" className="bg-primary text-white text-sm px-3 py-1.5 rounded hover:bg-primary-light transition-colors">
                    Confirmar
                  </button>
                  <button type="button" onClick={() => setCompartilhando(null)} className="p-1.5 rounded text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  )
}
