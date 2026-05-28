from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = 'http://localhost:5173'


def teste_pagina_login_carrega(navegador):
    navegador.get(f'{BASE_URL}/login')
    assert 'Entrar' in navegador.page_source


def teste_link_para_cadastro(navegador):
    navegador.get(f'{BASE_URL}/login')
    link = navegador.find_element(By.LINK_TEXT, 'Criar conta')
    link.click()
    WebDriverWait(navegador, 5).until(EC.url_contains('/cadastro'))
    assert '/cadastro' in navegador.current_url


def teste_pagina_cadastro_carrega(navegador):
    navegador.get(f'{BASE_URL}/cadastro')
    assert 'Crie sua conta' in navegador.page_source


def teste_link_para_login(navegador):
    navegador.get(f'{BASE_URL}/cadastro')
    link = navegador.find_element(By.LINK_TEXT, 'Entrar')
    link.click()
    WebDriverWait(navegador, 5).until(EC.url_contains('/login'))
    assert '/login' in navegador.current_url


def teste_login_com_credenciais_validas(navegador, usuario_teste):
    navegador.get(f'{BASE_URL}/login')
    navegador.find_element(By.CSS_SELECTOR, 'input[type="email"]').send_keys(usuario_teste['email'])
    navegador.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys(usuario_teste['senha'])
    navegador.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    WebDriverWait(navegador, 5).until(EC.url_contains('/tarefas'))
    assert '/tarefas' in navegador.current_url


def teste_login_com_credenciais_invalidas(navegador):
    navegador.get(f'{BASE_URL}/login')
    navegador.find_element(By.CSS_SELECTOR, 'input[type="email"]').send_keys('errado@teste.com')
    navegador.find_element(By.CSS_SELECTOR, 'input[type="password"]').send_keys('errada')
    navegador.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    WebDriverWait(navegador, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'inválidos')]"))
    )
    assert 'inválidos' in navegador.page_source
