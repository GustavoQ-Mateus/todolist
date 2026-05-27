from django.contrib.auth import get_user_model
from rest_framework import serializers

Usuario = get_user_model()


class CadastroSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'senha')

    def create(self, dados_validados):
        return Usuario.objects.create_user(
            username=dados_validados['username'],
            email=dados_validados['email'],
            password=dados_validados['senha'],
        )
