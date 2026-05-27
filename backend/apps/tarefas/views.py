from rest_framework import generics, permissions
from .models import Tarefa, Categoria, CompartilhamentoTarefa
from .serializers import TarefaSerializer, CategoriaSerializer, CompartilhamentoSerializer


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


class CompartilhamentoListCreateView(generics.ListCreateAPIView):
    serializer_class = CompartilhamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CompartilhamentoTarefa.objects.filter(tarefa__criado_por=self.request.user, tarefa_id=self.kwargs['tarefa_id'])

    def perform_create(self, serializer):
        tarefa = Tarefa.objects.get(pk=self.kwargs['tarefa_id'], criado_por=self.request.user)
        serializer.save(tarefa=tarefa)
