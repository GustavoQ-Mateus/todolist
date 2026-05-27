from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CadastroSerializer


class CadastroView(generics.CreateAPIView):
    serializer_class = CadastroSerializer
    permission_classes = (permissions.AllowAny,)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'username': request.user.username, 'email': request.user.email})
