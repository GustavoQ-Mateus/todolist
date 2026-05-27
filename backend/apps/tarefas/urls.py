from django.urls import path
from .views import TarefaListCreateView, TarefaDetailView

urlpatterns = [
    path('tarefas/', TarefaListCreateView.as_view()),
    path('tarefas/<int:pk>/', TarefaDetailView.as_view()),
]
