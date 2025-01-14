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
    pdf_file_url = serializers.SerializerMethodField()
    tracking_mail_receipt_url = serializers.SerializerMethodField()
    return_receipt_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Record
        fields = [
            'id', 'tracking_number', 'return_receipt', 'record_type', 'tracking_type', 'status', 'company_name', 'ceo', 'cfo', 'mailing_address', 
            'city', 'state', 'zip', 'email', 'phone_number', 'created_by', 'created_at', 'updated_at', 'is_deleted', 'pdf_file_url',  'return_receipt_file_url', 'tracking_mail_receipt_url', 'pdf_file', 'tracking_mail_receipt', 'return_receipt_file', 'hash'
        ]
        extra_kwargs = {
            'pdf_file': {'required': False, 'allow_null': True},
            'tracking_mail_receipt': {'required': False, 'allow_null': True},
            'return_receipt_file': {'required': False, 'allow_null': True},
        }

    def get_pdf_file_url(self, obj):
        if obj.pdf_file:
            return obj.pdf_file.url
        return None

    def get_tracking_mail_receipt_url(self, obj):
        if obj.tracking_mail_receipt:
            return obj.tracking_mail_receipt.url
        return None

    def get_return_receipt_file_url(self, obj):
        if obj.return_receipt_file:
            return obj.return_receipt_file.url
        return None