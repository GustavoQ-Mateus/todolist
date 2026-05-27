from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Tarefa, Categoria, CompartilhamentoTarefa

Usuario = get_user_model()


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']


class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = ['id', 'titulo', 'descricao', 'concluida', 'prazo', 'prioridade', 'categoria', 'criado_em']
        read_only_fields = ['criado_em']

    def create(self, validated_data):
        validated_data['criado_por'] = self.context['request'].user
        return super().create(validated_data)


class CompartilhamentoSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(write_only=True)

    class Meta:
        model = CompartilhamentoTarefa
        fields = ['id', 'tarefa', 'usuario_username', 'permissao']
        read_only_fields = ['tarefa']

    def validate_usuario_username(self, valor):
        try:
            return Usuario.objects.get(username=valor)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError('Usuário não encontrado.')

    def create(self, validated_data):
        usuario = validated_data.pop('usuario_username')
        return CompartilhamentoTarefa.objects.create(usuario=usuario, **validated_data)
