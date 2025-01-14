from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"), 
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path('records/', views.RecordView.as_view(), name='record_list_create'),
    path('records/<int:id>/', views.RecordView.as_view(), name='record_detail_update_delete'),
]

