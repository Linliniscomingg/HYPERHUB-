from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'full_name', 'phone')

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(validators=[])
    password = serializers.CharField()
    class Meta:
        fields = ('username', 'password')