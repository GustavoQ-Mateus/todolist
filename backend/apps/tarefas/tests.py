import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from .models import Tarefa, Categoria

Usuario = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def usuario(db):
    return Usuario.objects.create_user(
        username='testador',
        email='testador@teste.com',
        password='senha1234',
    )


@pytest.fixture
def client_autenticado(client, usuario):
    resposta = client.post('/api/usuarios/login/', {
        'email': 'testador@teste.com',
        'password': 'senha1234',
    }, format='json')
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {resposta.data["access"]}')
    return client


@pytest.fixture
def tarefa(usuario):
    return Tarefa.objects.create(titulo='Tarefa teste', criado_por=usuario)


@pytest.mark.django_db
def teste_criar_tarefa(client_autenticado):
    resposta = client_autenticado.post('/api/tarefas/', {
        'titulo': 'Nova tarefa',
    }, format='json')
    assert resposta.status_code == 201
    assert resposta.data['titulo'] == 'Nova tarefa'


@pytest.mark.django_db
def teste_listar_tarefas(client_autenticado, tarefa):
    resposta = client_autenticado.get('/api/tarefas/')
    assert resposta.status_code == 200
    assert resposta.data['count'] == 1


@pytest.mark.django_db
def teste_marcar_tarefa_concluida(client_autenticado, tarefa):
    resposta = client_autenticado.patch(f'/api/tarefas/{tarefa.id}/', {
        'concluida': True,
    }, format='json')
    assert resposta.status_code == 200
    assert resposta.data['concluida'] is True


@pytest.mark.django_db
def teste_excluir_tarefa(client_autenticado, tarefa):
    resposta = client_autenticado.delete(f'/api/tarefas/{tarefa.id}/')
    assert resposta.status_code == 204


@pytest.mark.django_db
def teste_filtro_tarefas_por_status(client_autenticado, usuario):
    Tarefa.objects.create(titulo='Pendente', criado_por=usuario, concluida=False)
    Tarefa.objects.create(titulo='Concluida', criado_por=usuario, concluida=True)
    resposta = client_autenticado.get('/api/tarefas/?concluida=true')
    assert resposta.data['count'] == 1
    assert resposta.data['results'][0]['titulo'] == 'Concluida'


@pytest.mark.django_db
def teste_usuario_nao_acessa_tarefa_de_outro(db, client):
    outro = Usuario.objects.create_user(username='outro', email='outro@teste.com', password='senha1234')
    tarefa_outro = Tarefa.objects.create(titulo='Privada', criado_por=outro)
    usuario = Usuario.objects.create_user(username='eu', email='eu@teste.com', password='senha1234')
    resposta_login = client.post('/api/usuarios/login/', {'email': 'eu@teste.com', 'password': 'senha1234'}, format='json')
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {resposta_login.data["access"]}')
    resposta = client.get(f'/api/tarefas/{tarefa_outro.id}/')
    assert resposta.status_code == 404
