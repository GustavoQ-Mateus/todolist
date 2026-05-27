import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

Usuario = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def usuario_criado(db):
    return Usuario.objects.create_user(
        username='testador',
        email='testador@teste.com',
        password='senha1234',
    )


@pytest.fixture
def client_autenticado(client, usuario_criado):
    resposta = client.post('/api/usuarios/login/', {
        'email': 'testador@teste.com',
        'password': 'senha1234',
    }, format='json')
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {resposta.data["access"]}')
    return client


@pytest.mark.django_db
def teste_cadastro_usuario(client):
    resposta = client.post('/api/usuarios/cadastro/', {
        'username': 'novo',
        'email': 'novo@teste.com',
        'senha': 'senha1234',
    }, format='json')
    assert resposta.status_code == 201
    assert resposta.data['email'] == 'novo@teste.com'


@pytest.mark.django_db
def teste_login_sucesso(client, usuario_criado):
    resposta = client.post('/api/usuarios/login/', {
        'email': 'testador@teste.com',
        'password': 'senha1234',
    }, format='json')
    assert resposta.status_code == 200
    assert 'access' in resposta.data


@pytest.mark.django_db
def teste_login_credenciais_invalidas(client):
    resposta = client.post('/api/usuarios/login/', {
        'email': 'naoexiste@teste.com',
        'password': 'errada',
    }, format='json')
    assert resposta.status_code == 401
