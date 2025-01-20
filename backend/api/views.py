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
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Record.objects.filter(created_by=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

class RecordDetailUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Record.objects.filter(created_by=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)

class RecordListView(generics.ListAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

class RecordView(generics.RetrieveAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [AllowAny]

class RecordSearchView(APIView):
    serializer_class = RecordSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        tracking_number = request.query_params.get('tracking_number', None)
        return_receipt = request.query_params.get('return_receipt', None)
        company_name = request.query_params.get('company_name', None)
        ceo = request.query_params.get('ceo', None)
        cfo = request.query_params.get('cfo', None)
        hash_value = request.query_params.get('hash', None)

        print(f"Tracking Number: {tracking_number}")
        print(f"Return Receipt: {return_receipt}")
        print(f"Company Name: {company_name}")
        print(f"CEO: {ceo}")
        print(f"CFO: {cfo}")
        print(f"Hash: {hash_value}")

        # All users can search by limited criteria
        records = Record.objects.all()
        if tracking_number:
            records = records.filter(tracking_number=tracking_number)
        if return_receipt:
            records = records.filter(return_receipt=return_receipt)
        if company_name:
            records = records.filter(company_name=company_name)
        if ceo:
            records = records.filter(ceo=ceo)
        if cfo:
            records = records.filter(cfo=cfo)
        if hash_value:
            records = records.filter(hash=hash_value)

        if not records.exists():
            return Response({"error": "No records found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecordSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)