import api from './api'

export function listarTarefas(filtros = {}) {
  return api.get('/tarefas/', { params: filtros })
}

export function criarTarefa(dados) {
  return api.post('/tarefas/', dados)
}

export function atualizarTarefa(id, dados) {
  return api.patch(`/tarefas/${id}/`, dados)
}

export function excluirTarefa(id) {
  return api.delete(`/tarefas/${id}/`)
}

export function compartilharTarefa(tarefaId, dados) {
  return api.post(`/tarefas/${tarefaId}/compartilhamentos/`, dados)
}
