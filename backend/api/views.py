from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from .serializers import UserSerializer, NoteSerializer, RecordSerializer
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from .models import Note, Record
from uuid import UUID
import logging
from django.utils import timezone
import requests

logger = logging.getLogger(__name__)


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] #AllowAny

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RecordListCreate(generics.ListCreateAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Record.objects.filter(created_by=user)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class RecordDetailUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Record.objects.filter(created_by=user)
    
    def perform_update(self, serializer):
        serializer.save()

class RecordListView(generics.ListAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

class RecordView(generics.RetrieveAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [AllowAny]

class RecordSearchView(generics.ListAPIView):
    serializer_class = RecordSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        tracking_number = self.request.query_params.get('tracking_number', None)
        return_receipt = self.request.query_params.get('return_receipt', None)
        queryset = Record.objects.all()

        if tracking_number:
            queryset = queryset.filter(tracking_number=tracking_number)
        if return_receipt:
            queryset = queryset.filter(return_receipt=return_receipt)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = super().list(request, *args, **kwargs)

        for record in queryset:
            access_log = {
                'ip_address': request.META.get('REMOTE_ADDR'),
                'timestamp': timezone.now().isoformat(),
                'user_agent': request.META.get('HTTP_USER_AGENT'),
                'location': self.get_location(request.META.get('REMOTE_ADDR')),
            }
            record.access_logs.append(access_log)
            record.save()

        return response

    def get_location(self, ip_address):
        try:
            response = requests.get(f'https://ipinfo.io/{ip_address}/json')
            return response.json()
        except requests.RequestException:
            return {}