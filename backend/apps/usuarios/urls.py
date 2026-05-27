from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CadastroView, MeView

urlpatterns = [
    path('usuarios/cadastro/', CadastroView.as_view()),
    path('usuarios/login/', TokenObtainPairView.as_view()),
    path('usuarios/token/refresh/', TokenRefreshView.as_view()),
    path('usuarios/me/', MeView.as_view()),
]
