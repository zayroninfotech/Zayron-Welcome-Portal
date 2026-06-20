from django.urls import path
from .views import ProjectListView, ProjectDetailView, TaskListView, TaskDetailView, UserStoryListView, UserStoryDetailView

urlpatterns = [
    path('', ProjectListView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('<int:project_id>/tasks/', TaskListView.as_view()),
    path('tasks/<int:pk>/', TaskDetailView.as_view()),
    path('tasks/<int:task_id>/stories/', UserStoryListView.as_view()),
    path('stories/<int:pk>/', UserStoryDetailView.as_view()),
]
