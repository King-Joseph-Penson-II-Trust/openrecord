from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Record

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
    
class RecordSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = Record
        fields = [
            'id', 'title','tracking_number', 'return_receipt', 'record_type', 'tracking_type', 'status', 'company_name', 'ceo',
             'cfo', 'mailing_address','city', 'state', 'zip', 'email', 'phone_number', 'created_by', 'created_at', 'updated_at', 'is_deleted', 'pdf_file_aws', 'tracking_mail_receipt_aws', 'return_receipt_file_aws','hash','uuid'
        ]
        extra_kwargs = {
            'created_by': {'read_only': True},
            'pdf_file': {'required': False, 'allow_null': True},
            'tracking_mail_receipt': {'required': False, 'allow_null': True},
            'return_receipt_file': {'required': False, 'allow_null': True},
            'tracking_mail_receipt_aws': {'required': False, 'allow_null': True},
            'return_receipt_file_aws': {'required': False, 'allow_null': True},
            
        }
