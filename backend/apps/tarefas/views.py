from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tarefa, Categoria, CompartilhamentoTarefa
from .serializers import TarefaSerializer, CategoriaSerializer, CompartilhamentoSerializer
from .filters import TarefaFilter


class TarefaListCreateView(generics.ListCreateAPIView):
    serializer_class = TarefaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TarefaFilter

    def get_queryset(self):
        user = self.request.user
        return Tarefa.objects.filter(
            Q(criado_por=user) | Q(compartilhamentos__usuario=user)
        ).distinct()


class TarefaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TarefaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tarefa.objects.filter(
            Q(criado_por=user) | Q(compartilhamentos__usuario=user)
        ).distinct()


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
        try:
            tarefa = Tarefa.objects.get(pk=self.kwargs['tarefa_id'], criado_por=self.request.user)
        except Tarefa.DoesNotExist:
            raise NotFound('Tarefa não encontrada.')
        serializer.save(tarefa=tarefa)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            context['tarefa'] = Tarefa.objects.get(pk=self.kwargs['tarefa_id'], criado_por=self.request.user)
        except Tarefa.DoesNotExist:
            pass
        return context


class CompartilhamentoDetailView(generics.DestroyAPIView):
    serializer_class = CompartilhamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CompartilhamentoTarefa.objects.filter(
            tarefa__criado_por=self.request.user,
            tarefa_id=self.kwargs['tarefa_id']
        )
