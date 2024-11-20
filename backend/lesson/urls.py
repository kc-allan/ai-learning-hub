from django.urls import path
from .course_view import list_courses, course_detail, list_quiz_questions

urlpatterns = [
    path('courses/', list_courses, name="courses"),
    path('course/<str:pk>/', course_detail, name="course_detail"),
    path('quizzes/<str:quiz_id>/questions/', list_quiz_questions, name='quiz-questions-list'),
    
]
