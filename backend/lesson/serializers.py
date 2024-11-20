from rest_framework import serializers
from .models import Course, Module, Quiz, Question, AnswerOption, Assignment

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"

class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ['id', 'text', 'is_correct']
    
class QuestionSerializer(serializers.ModelSerializer):
    question_options = AnswerOptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'question_options']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title']


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'text']

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = "__all__"
    
class ModuleDetailedSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)
    module_assignments = AssignmentSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'content', 'video_url', 'quizzes', 'module_assignments']
        
class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = "__all__"

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'text']