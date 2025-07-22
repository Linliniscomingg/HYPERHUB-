from django.shortcuts import render
from django.contrib.auth import login, logout
from django.conf import settings
from django.http import HttpResponseRedirect
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *

# Create your views here.
class UserView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_class = [IsAuthenticated]
    serializer_class = serializers.Serializer

    def get(self, request, format=None):
        try:
            current_user = request.user
            token, _ = Token.objects.get_or_create(user=current_user)
            data = dict()
            data['id'] = current_user.id
            data['username'] = current_user.username
            data['full_name'] = current_user.full_name
            data['phone'] = current_user.phone
            data['authenticated'] = token.key
            return Response(data=data, status=status.HTTP_200_OK)
        except:
            return Response(data={'msg': 'UnAuthorized'}, status=status.HTTP_403_FORBIDDEN)
        
class UserRegisterView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.data.get('username')
        password = serializer.data.get('password')
        full_name = serializer.data.get('full_name')
        phone = serializer.data.get('phone')

        user = User(username=username.lower(), password=password,
                    full_name=full_name, phone=phone)
        user.save()

        return Response(data=UserSerializer(user).data, status=status.HTTP_200_OK)
    
class UserLoginView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.data.get('username')
        password = serializer.data.get('password')

        try:
            user = User.objects.get(username=username.lower(), password=password)

            request.session.set_expiry(0)
            login(request=request, user=user, backend=settings.AUTHENTICATION_BACKENDS[0])
            token, _ = Token.objects.get_or_create(user=user)
            data = dict()
            data['id'] = user.id
            data['username'] = user.username
            data['full_name']= user.full_name
            data['phone'] = user.phone
            data['authenticated'] = token.key

            return Response(data=data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            message = {'message': 'Incorrect username/password. Please try again'}
            return Response(data=message, status=status.HTTP_401_UNAUTHORIZED)
        
class UserLogoutView(GenericAPIView):
    serializer_class = serializers.Serializer
    def post(self, request, format=None):
        logout(request=request)
        return HttpResponseRedirect("/")

