from django.db import models
from django.conf import settings


class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='categorias')

    def __str__(self):
        return self.nome


class Tarefa(models.Model):
    PRIORIDADE_CHOICES = [
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
    ]

    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    concluida = models.BooleanField(default=False)
    prazo = models.DateField(null=True, blank=True)
    prioridade = models.CharField(max_length=5, choices=PRIORIDADE_CHOICES, default='media')
    categoria = models.ForeignKey(Categoria, null=True, blank=True, on_delete=models.SET_NULL, related_name='tarefas')
    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tarefas')
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class CompartilhamentoTarefa(models.Model):
    PERMISSAO_CHOICES = [
        ('leitura', 'Leitura'),
        ('edicao', 'Edição'),
    ]

    tarefa = models.ForeignKey(Tarefa, on_delete=models.CASCADE, related_name='compartilhamentos')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tarefas_compartilhadas')
    permissao = models.CharField(max_length=7, choices=PERMISSAO_CHOICES, default='leitura')

    class Meta:
        unique_together = ('tarefa', 'usuario')
