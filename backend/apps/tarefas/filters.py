from django_filters import rest_framework as filters
from .models import Tarefa


class TarefaFilter(filters.FilterSet):
    class Meta:
        model = Tarefa
        fields = ['concluida', 'categoria', 'prioridade']
