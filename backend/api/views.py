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
    permission_classes = [AllowAny]

class RecordDetailUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [AllowAny]

class RecordView(generics.RetrieveAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [AllowAny]