import { useState, useEffect } from 'react'
import { Plus, Trash2, Share2, X, Pencil, Check, Tag } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa, compartilharTarefa, listarCompartilhamentos, removerCompartilhamento } from '../services/tarefas'
import { listarCategorias, criarCategoria, excluirCategoria } from '../services/categorias'

export default function Tarefas() {
  const { usuario } = useAuth()
  const usuarioLogado = usuario?.username
  const [tarefas, setTarefas] = useState([])
  const [categorias, setCategorias] = useState([])

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [prioridade, setPrioridade] = useState('media')
  const [prazo, setPrazo] = useState('')

  const [editando, setEditando] = useState(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editDescricao, setEditDescricao] = useState('')
  const [editPrioridade, setEditPrioridade] = useState('media')
  const [editCategoria, setEditCategoria] = useState('')
  const [editPrazo, setEditPrazo] = useState('')

  const [compartilhando, setCompartilhando] = useState(null)
  const [usernameCompartilhar, setUsernameCompartilhar] = useState('')
  const [permissao, setPermissao] = useState('leitura')
  const [compartilhamentos, setCompartilhamentos] = useState([])
  const [erroCompartilhar, setErroCompartilhar] = useState('')

  const [novaCategoria, setNovaCategoria] = useState('')
  const [criandoCategoria, setCriandoCategoria] = useState(false)

  const [filtros, setFiltros] = useState({ concluida: '', categoria: '', prioridade: '' })
  const [erro, setErro] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    buscarTarefas(1)
    buscarCategorias()
  }, [filtros])

  async function buscarTarefas(pag = pagina) {
    try {
      const params = { page: pag }
      if (filtros.concluida !== '') params.concluida = filtros.concluida
      if (filtros.categoria !== '') params.categoria = filtros.categoria
      if (filtros.prioridade !== '') params.prioridade = filtros.prioridade
      const { data } = await listarTarefas(params)
      setTarefas(data.results)
      setTotalPaginas(Math.ceil(data.count / PAGE_SIZE))
      setPagina(pag)
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
    const dados = { titulo, descricao, prioridade }
    if (categoria) dados.categoria = categoria
    if (prazo) dados.prazo = prazo
    try {
      await criarTarefa(dados)
      setTitulo('')
      setDescricao('')
      setCategoria('')
      setPrioridade('media')
      setPrazo('')
      buscarTarefas()
    } catch {
      setErro('Erro ao criar tarefa.')
    }
  }

  async function handleCriarCategoria(e) {
    e.preventDefault()
    setErro('')
    try {
      await criarCategoria({ nome: novaCategoria })
      setNovaCategoria('')
      setCriandoCategoria(false)
      buscarCategorias()
    } catch {
      setErro('Erro ao criar categoria.')
    }
  }

  async function handleExcluirCategoria(id) {
    try {
      await excluirCategoria(id)
      buscarCategorias()
      buscarTarefas()
    } catch {
      setErro('Erro ao excluir categoria.')
    }
  }

  function abrirEdicao(tarefa) {
    setEditando(tarefa.id)
    setEditTitulo(tarefa.titulo)
    setEditDescricao(tarefa.descricao || '')
    setEditPrioridade(tarefa.prioridade)
    setEditCategoria(tarefa.categoria || '')
    setEditPrazo(tarefa.prazo || '')
    setCompartilhando(null)
  }

  async function handleEditar(e, id) {
    e.preventDefault()
    setErro('')
    const dados = { titulo: editTitulo, descricao: editDescricao, prioridade: editPrioridade, prazo: editPrazo || null }
    dados.categoria = editCategoria || null
    try {
      await atualizarTarefa(id, dados)
      setEditando(null)
      buscarTarefas()
    } catch {
      setErro('Erro ao editar tarefa.')
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

  async function abrirCompartilhamento(tarefaId) {
    if (compartilhando === tarefaId) {
      setCompartilhando(null)
      setErroCompartilhar('')
      return
    }
    setCompartilhando(tarefaId)
    setErroCompartilhar('')
    setEditando(null)
    try {
      const { data } = await listarCompartilhamentos(tarefaId)
      setCompartilhamentos(data.results || data)
    } catch {
      setCompartilhamentos([])
    }
  }

  async function handleRemoverCompartilhamento(tarefaId, compartilhamentoId) {
    try {
      await removerCompartilhamento(tarefaId, compartilhamentoId)
      const { data } = await listarCompartilhamentos(tarefaId)
      setCompartilhamentos(data.results || data)
    } catch {
      setErroCompartilhar('Erro ao remover compartilhamento.')
    }
  }

  async function handleCompartilhar(e) {
    e.preventDefault()
    setErroCompartilhar('')
    try {
      await compartilharTarefa(compartilhando, { usuario_username: usernameCompartilhar, permissao })
      setUsernameCompartilhar('')
      setPermissao('leitura')
      const { data } = await listarCompartilhamentos(compartilhando)
      setCompartilhamentos(data.results || data)
    } catch (err) {
      const data = err.response?.data
      const msg =
        data?.usuario_username?.[0] ||
        data?.non_field_errors?.[0] ||
        data?.detail ||
        'Erro ao compartilhar.'
      setErroCompartilhar(msg)
    }
  }

  function handleFiltro(e) {
    setPagina(1)
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  const prioridadeCor = { baixa: 'text-green-600', media: 'text-yellow-600', alta: 'text-red-500' }
  const prioridadeLabel = { baixa: 'Baixa', media: 'Média', alta: 'Alta' }
  const permissaoLabel = { leitura: 'Leitura', edicao: 'Edição' }

  const inputClass = 'border border-gray-200 rounded px-3 py-2 text-sm focus:border-primary transition-colors'
  const selectClass = 'border border-gray-200 rounded px-3 py-1.5 text-sm focus:border-primary transition-colors bg-white text-gray-700'

  return (
    <Layout titulo="Tarefas">
      <div className="flex flex-col gap-6 max-w-3xl">

        <div className="flex flex-wrap items-center gap-2">
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

          <div className="ml-auto">
            {criandoCategoria ? (
              <form onSubmit={handleCriarCategoria} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  required
                  autoFocus
                  className={inputClass}
                />
                <button type="submit" className="bg-primary text-white text-sm px-3 py-1.5 rounded hover:bg-primary-light transition-colors">
                  Criar
                </button>
                <button type="button" onClick={() => setCriandoCategoria(false)} className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={13} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setCriandoCategoria(true)}
                className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded hover:text-primary hover:border-primary transition-colors"
              >
                <Tag size={13} />
                Nova categoria
              </button>
            )}
          </div>
        </div>

        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categorias.map((cat) => (
              <span key={cat.id} className="flex items-center gap-1 bg-primary-muted text-primary text-xs px-2 py-0.5 rounded">
                {cat.nome}
                <button type="button" onClick={() => handleExcluirCategoria(cat.id)} className="hover:text-red-500 transition-colors" aria-label="Excluir categoria">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleCriar} className="flex flex-col gap-2 bg-white border border-gray-100 rounded p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Título da tarefa..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className={`flex-1 ${inputClass}`}
            />
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} className={selectClass}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={selectClass}>
              <option value="">Sem categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <textarea
              placeholder="Descrição (opcional)..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className={`resize-none flex-1 ${inputClass}`}
            />
            <div className="flex flex-col gap-1 justify-start">
              <label className="text-xs text-gray-400">Prazo</label>
              <input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-1.5 bg-primary text-white text-sm px-4 py-2 rounded hover:bg-primary-light transition-colors">
              <Plus size={14} />
              Adicionar
            </button>
          </div>
        </form>

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded bg-white">
          {tarefas.length === 0 && (
            <p className="text-sm text-gray-400 px-4 py-6 text-center">Nenhuma tarefa encontrada.</p>
          )}
          {tarefas.map((tarefa) => (
            <div key={tarefa.id} className="flex flex-col">

              <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={tarefa.concluida}
                  onChange={() => handleConcluir(tarefa)}
                  className="accent-primary w-4 h-4 mt-0.5 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${tarefa.concluida ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {tarefa.titulo}
                  </p>
                  {tarefa.descricao && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{tarefa.descricao}</p>
                  )}
                  {tarefa.prazo && (
                    <p className="text-xs text-gray-400 mt-0.5">Prazo: {tarefa.prazo}</p>
                  )}
                  {tarefa.minha_permissao !== 'dono' && (
                    <p className="text-xs text-primary mt-0.5">Compartilhada por {tarefa.criado_por_username}</p>
                  )}
                </div>
                <span className={`text-xs font-medium shrink-0 ${prioridadeCor[tarefa.prioridade]}`}>
                  {prioridadeLabel[tarefa.prioridade]}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {(tarefa.minha_permissao === 'dono' || tarefa.minha_permissao === 'edicao') && (
                    <button onClick={() => abrirEdicao(tarefa)} className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary-muted transition-colors" aria-label="Editar">
                      <Pencil size={13} />
                    </button>
                  )}
                  {tarefa.minha_permissao === 'dono' && (
                    <>
                      <button onClick={() => abrirCompartilhamento(tarefa.id)} className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-primary-muted transition-colors" aria-label="Compartilhar">
                        <Share2 size={13} />
                      </button>
                      <button onClick={() => handleExcluir(tarefa.id)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Excluir">
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editando === tarefa.id && (
                <form onSubmit={(e) => handleEditar(e, tarefa.id)} className="flex flex-col gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input type="text" value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} required className={`flex-1 ${inputClass}`} placeholder="Título" />
                    <select value={editPrioridade} onChange={(e) => setEditPrioridade(e.target.value)} className={selectClass}>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                    <select value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} className={selectClass}>
                      <option value="">Sem categoria</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <textarea value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} rows={2} placeholder="Descrição..." className={`resize-none flex-1 ${inputClass}`} />
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400">Prazo</label>
                      <input type="date" value={editPrazo} onChange={(e) => setEditPrazo(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="submit" className="flex items-center gap-1.5 bg-primary text-white text-sm px-3 py-1.5 rounded hover:bg-primary-light transition-colors">
                      <Check size={13} /> Salvar
                    </button>
                    <button type="button" onClick={() => setEditando(null)} className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                </form>
              )}

              {compartilhando === tarefa.id && (
                <div className="flex flex-col gap-2 px-4 py-3 bg-primary-muted border-t border-gray-100">
                  {compartilhamentos.length > 0 && (
                    <div className="flex flex-col gap-1 mb-1">
                      {compartilhamentos.map((c) => (
                        <div key={c.id} className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1">
                          <span className="text-xs text-gray-700 font-medium">{c.usuario_nome}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{permissaoLabel[c.permissao]}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoverCompartilhamento(tarefa.id, c.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                              aria-label="Remover compartilhamento"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleCompartilhar} className="flex flex-wrap items-center gap-2">
                    <input type="text" placeholder="Username do usuário" value={usernameCompartilhar} onChange={(e) => setUsernameCompartilhar(e.target.value)} required className={inputClass} />
                    <select value={permissao} onChange={(e) => setPermissao(e.target.value)} className={selectClass}>
                      <option value="leitura">Leitura</option>
                      <option value="edicao">Edição</option>
                    </select>
                    <button type="submit" className="bg-primary text-white text-sm px-3 py-1.5 rounded hover:bg-primary-light transition-colors">Compartilhar</button>
                    <button type="button" onClick={() => { setCompartilhando(null); setErroCompartilhar('') }} className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors"><X size={13} /></button>
                  </form>
                  {erroCompartilhar && (
                    <p className="text-xs text-red-500">{erroCompartilhar}</p>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => buscarTarefas(pagina - 1)}
              disabled={pagina === 1}
              className="px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => buscarTarefas(p)}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  p === pagina
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => buscarTarefas(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}

      </div>
    </Layout>
  )
}
