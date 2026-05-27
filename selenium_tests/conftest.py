import pytest
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

BASE_URL = 'http://localhost:5173'
API_URL = 'http://localhost:8000/api'


@pytest.fixture(scope='session')
def navegador():
    opcoes = Options()
    opcoes.add_argument('--headless')
    opcoes.add_argument('--no-sandbox')
    opcoes.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=opcoes)
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


@pytest.fixture(scope='session')
def usuario_teste():
    requests.post(f'{API_URL}/usuarios/cadastro/', json={
        'username': 'selenium_user',
        'email': 'selenium@teste.com',
        'senha': 'senha1234',
    })
    return {'email': 'selenium@teste.com', 'senha': 'senha1234'}
