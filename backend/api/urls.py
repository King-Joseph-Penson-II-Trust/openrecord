from django.urls import path
from . import views
from.views import BlocklistView

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"), 
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("blocklist/", BlocklistView.as_view(), name="blocklist")
]

