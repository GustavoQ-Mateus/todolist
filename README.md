# ListTodo

Este projeto é meu teste prático. O objetivo foi construir um gerenciador de tarefas que fosse além do básico, focando em segurança (JWT), organização (Categorias) e colaboração (Compartilhamento).

---

## Como subir o projeto

Para facilitar a avaliação, a aplicação está totalmente dockerizada.
Clone o repositório:

```bash
git clone https://github.com/GustavoQ-Mateus/todolist.git
cd todolist
```

Crie um arquivo `.env` na raiz:

```env
SECRET_KEY=chave-teste-123
POSTGRES_DB=todolist
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

Rode o comando:

```bash
docker compose up -d --build
```

- Front-end: http://localhost:5173
- API: http://localhost:8000/api

---

## Minhas Decisões de Projeto

Em vez de complicar a arquitetura, tentei ser direto e eficiente, seguindo o que o mercado espera de um código limpo:

# Lógica no Back-end
 Garanti que o Front-end seja apenas uma camada visual. Toda a regra de "quem pode ver o quê" e o vínculo automático do `criado_por` acontece no Django. Isso evita que um usuário mal-intencionado manipule dados via requisições manuais.

# Organização do Código
 Separei as configurações do Django (settings) para que o ambiente de desenvolvimento não misture chaves e comportamentos com o que seria uma produção real.

# Segurança com JWT
 Escolhi o SimpleJWT por ser o padrão de mercado para SPAs, garantindo que a autenticação seja stateless e segura.

# Filtros Eficientes
 Usei o `django-filter` para que a busca por tarefas (concluídas, prioridade, etc.) seja feita diretamente no banco de dados, e não "na mão" via código, o que melhora a performance.

---

## API REST

Autenticação via Bearer Token — `Authorization: Bearer <access_token>`

**Usuários**
- `POST /api/usuarios/cadastro/` — criar conta
- `POST /api/usuarios/login/` — login, retorna `access` e `refresh`
- `POST /api/usuarios/token/refresh/` — renovar token
- `GET /api/usuarios/me/` — dados do usuário autenticado

**Tarefas**
- `GET /api/tarefas/` — listar (suporta filtros)
- `POST /api/tarefas/` — criar
- `GET /api/tarefas/<id>/` — detalhar
- `PATCH /api/tarefas/<id>/` — editar
- `DELETE /api/tarefas/<id>/` — excluir
- `GET /api/tarefas/<id>/compartilhamentos/` — listar compartilhamentos
- `POST /api/tarefas/<id>/compartilhamentos/` — compartilhar com outro usuário

**Categorias**
- `GET /api/categorias/` — listar
- `POST /api/categorias/` — criar
- `DELETE /api/categorias/<id>/` — excluir

**Filtros em `/api/tarefas/`:** `?concluida=true|false` · `?prioridade=baixa|media|alta` · `?categoria=<id>`

---

## Testes e Qualidade

Como o teste foca em Back-end, dei uma atenção à cobertura do pytest:

**Testes Unitários:** Cobrem desde a criação de usuário até as permissões complexas de compartilhamento.

**Selenium:** Criei um fluxo automatizado que abre o navegador, faz login e valida se a interface está respondendo corretamente.

```bash
# Backend
docker compose exec backend pytest -v

# Selenium (localmente)
pip install -r selenium_tests/requirements.txt
pytest selenium_tests/ -v
```

---

## CI/CD

Configurei um workflow no GitHub Actions. Toda vez que faço um push, o GitHub sobe o banco de dados, roda os testes de backend e depois os testes de Selenium. Isso garante que a `main` esteja sempre funcional.

---

## O que eu melhoraria com mais tempo

- **WebSockets (Django Channels):** quando alguém compartilha uma tarefa comigo, ela aparece instantaneamente sem precisar recarregar a página.
- **Documentação automática da API:** geraria um Swagger via `drf-spectacular` para facilitar testes manuais e integrações externas.
- **Refresh automático do token:** hoje, quando o `access` expira, a sessão simplesmente falha. Implementaria o interceptor de resposta no Axios para renovar o token automaticamente com o `refresh`.
