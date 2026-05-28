from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Tarefa, Categoria, CompartilhamentoTarefa

Usuario = get_user_model()


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']


class TarefaSerializer(serializers.ModelSerializer):
    criado_por_username = serializers.CharField(source='criado_por.username', read_only=True)
    minha_permissao = serializers.SerializerMethodField()

    class Meta:
        model = Tarefa
        fields = ['id', 'titulo', 'descricao', 'concluida', 'prazo', 'prioridade', 'categoria', 'criado_em', 'criado_por_username', 'minha_permissao']
        read_only_fields = ['criado_em', 'criado_por_username', 'minha_permissao']

    def get_minha_permissao(self, obj):
        request = self.context.get('request')
        if not request:
            return None
        if obj.criado_por == request.user:
            return 'dono'
        try:
            return obj.compartilhamentos.get(usuario=request.user).permissao
        except CompartilhamentoTarefa.DoesNotExist:
            return None

    def create(self, validated_data):
        validated_data['criado_por'] = self.context['request'].user
        return super().create(validated_data)


class CompartilhamentoSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(write_only=True)
    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = CompartilhamentoTarefa
        fields = ['id', 'tarefa', 'usuario_username', 'usuario_nome', 'permissao']
        read_only_fields = ['tarefa']

    def validate_usuario_username(self, valor):
        try:
            usuario = Usuario.objects.get(username=valor)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError('Usuário não encontrado.')
        return usuario

    def validate(self, attrs):
        usuario = attrs.get('usuario_username')
        tarefa = self.context.get('tarefa')
        if tarefa and usuario and CompartilhamentoTarefa.objects.filter(tarefa=tarefa, usuario=usuario).exists():
            raise serializers.ValidationError({'usuario_username': 'Esta tarefa já foi compartilhada com este usuário.'})
        return attrs

    def create(self, validated_data):
        usuario = validated_data.pop('usuario_username')
        return CompartilhamentoTarefa.objects.create(usuario=usuario, **validated_data)
