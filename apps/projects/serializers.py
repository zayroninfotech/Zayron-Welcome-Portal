from rest_framework import serializers
from .models import Project, Task, UserStory


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = ['id', 'story', 'created_at']
        read_only_fields = ['id', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    user_stories = UserStorySerializer(many=True, read_only=True)
    screenshot_url = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'project', 'title', 'description', 'status', 'screenshot', 'screenshot_url', 'user_stories', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_screenshot_url(self, obj):
        if obj.screenshot:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.screenshot.url)
        return None


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'task_count', 'tasks', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_task_count(self, obj):
        return obj.tasks.count()


class ProjectListSerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()
    done_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'task_count', 'done_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_task_count(self, obj):
        return obj.tasks.count()

    def get_done_count(self, obj):
        return obj.tasks.filter(status='done').count()
