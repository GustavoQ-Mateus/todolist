import api from './api'

export function listarCategorias() {
  return api.get('/categorias/')
}

export function criarCategoria(dados) {
  return api.post('/categorias/', dados)
}
