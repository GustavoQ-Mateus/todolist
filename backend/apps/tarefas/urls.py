from django.urls import path
from .views import TarefaListCreateView

urlpatterns = [
    path('tarefas/', TarefaListCreateView.as_view()),
]
