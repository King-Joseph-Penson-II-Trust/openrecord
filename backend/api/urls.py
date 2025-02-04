from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"), 
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path('records/', views.RecordListCreate.as_view(), name='record_list_create'),
    path('records/<int:pk>/', views.RecordDetailUpdateDelete.as_view(), name='record_detail_update_delete'),
    path('records/view/<int:pk>/', views.RecordView.as_view(), name='record_view'),
    path('records/search/', views.RecordSearchView.as_view(), name='record-search'),
    path('records/list/', views.RecordListView.as_view(), name='record_list'),
    path('templates/scanplaceholders/', views.ScanPlaceholdersView.as_view(), name='scan-placeholders'),
    path('templates/upload', views.UploadTemplateView.as_view(), name='upload-template'),
    path('templates/', views.DocumentTemplateListView.as_view(), name='document-template-list-create'),
    path('templates/document/generate/', views.GenerateDocumentsView.as_view(), name='generate-document'),
]

