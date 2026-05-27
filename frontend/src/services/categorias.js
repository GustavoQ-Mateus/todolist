import api from './api'

export function listarCategorias() {
  return api.get('/categorias/')
}

export function criarCategoria(dados) {
  return api.post('/categorias/', dados)
}

export function excluirCategoria(id) {
  return api.delete(`/categorias/${id}/`)
}
