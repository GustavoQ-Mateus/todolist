import api from './api'

export function listarTarefas() {
  return api.get('/tarefas/')
}

export function criarTarefa(dados) {
  return api.post('/tarefas/', dados)
}
