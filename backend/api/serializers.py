from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, BlocklistItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

class BlocklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlocklistItem
        fields = ['ip_or_domain', 'added_by', 'added_on']
    
    def validate_ip_or_domain(self, value):
        #Validation
        return value