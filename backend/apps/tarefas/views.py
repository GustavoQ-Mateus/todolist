from rest_framework import generics, permissions
from .models import Tarefa, Categoria
from .serializers import TarefaSerializer, CategoriaSerializer


class TarefaListCreateView(generics.ListCreateAPIView):
    serializer_class = TarefaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tarefa.objects.filter(criado_por=self.request.user)


class TarefaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TarefaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tarefa.objects.filter(criado_por=self.request.user)


class CategoriaListCreateView(generics.ListCreateAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Categoria.objects.filter(criado_por=self.request.user)

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)


class CategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Categoria.objects.filter(criado_por=self.request.user)
