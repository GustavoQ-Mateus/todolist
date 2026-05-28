from django.urls import path
from .views import TarefaListCreateView, TarefaDetailView, CategoriaListCreateView, CategoriaDetailView, CompartilhamentoListCreateView, CompartilhamentoDetailView

urlpatterns = [
    path('tarefas/', TarefaListCreateView.as_view()),
    path('tarefas/<int:pk>/', TarefaDetailView.as_view()),
    path('tarefas/<int:tarefa_id>/compartilhamentos/', CompartilhamentoListCreateView.as_view()),
    path('tarefas/<int:tarefa_id>/compartilhamentos/<int:pk>/', CompartilhamentoDetailView.as_view()),
    path('categorias/', CategoriaListCreateView.as_view()),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view()),
]
