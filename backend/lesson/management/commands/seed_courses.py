# your_app/management/commands/seed_db.py

from django.core.management.base import BaseCommand
from lesson.models import Course, Module, Quiz, Question, AnswerOption, UserCourseProgress, \
    UserModuleProgress, UserQuizAttempt, UserQuizResponse, Assignment, AssignmentSubmission
from django.utils.timezone import now
import random


class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        # Seed Courses
        self.stdout.write(self.style.SUCCESS('Seeding Courses...'))
        courses = [
            {
                'title': 'Introduction to AI',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'A basic introduction to AI concepts.',
                'is_premium': False,
                'level': 'beginner'
            },
            {
                'title': 'Intermediate AI Concepts',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Dive deeper into AI technologies and methodologies.',
                'is_premium': False,
                'level': 'intermediate'
            },
            {
                'title': 'AI and Machine Learning',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Explore machine learning techniques in AI.',
                'is_premium': True,
                'level': 'expert'
            },
            {
                'title': 'Neural Networks and Deep Learning',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Understanding deep learning models and architectures.',
                'is_premium': True,
                'level': 'expert'
            },
            {
                'title': 'AI Ethics and Future',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Understanding the ethical issues in AI development.',
                'is_premium': False,
                'level': 'beginner'
            },
        ]
        course_objects = []
        for course_data in courses:
            course = Course.objects.create(**course_data)
            course_objects.append(course)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(course_objects)} courses.'))

        # Seed Modules for each Course
        self.stdout.write(self.style.SUCCESS('Seeding Modules...'))
        modules = [
            {
                'course': course_objects[0],
                'title': 'AI Overview',
                'description': 'Introduction to AI and its applications.',
                'content': 'AI is the simulation of human intelligence processes...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[1],
                'title': 'AI Algorithms',
                'description': 'Learn various algorithms used in AI.',
                'content': 'Algorithms in AI are critical for decision making...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[2],
                'title': 'Machine Learning Foundations',
                'description': 'Explore the foundational aspects of machine learning.',
                'content': 'Machine learning is a subset of AI that allows systems to learn from data...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[3],
                'title': 'Deep Learning Techniques',
                'description': 'Deep dive into neural networks and learning techniques.',
                'content': 'Deep learning allows AI to simulate the neural networks of the human brain...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[4],
                'title': 'Ethics in AI',
                'description': 'Understanding the impact of AI on society and ethics.',
                'content': 'Ethical considerations are vital in the development and deployment of AI systems...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
        ]
        for module_data in modules:
            Module.objects.create(**module_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(modules)} modules.'))

        # Seed Quizzes and Questions
        self.stdout.write(self.style.SUCCESS('Seeding Quizzes and Questions...'))
        quizzes = [
            {
                'module': Module.objects.get(title='AI Overview'),
                'title': 'Intro to AI Quiz'
            },
            {
                'module': Module.objects.get(title='AI Algorithms'),
                'title': 'Algorithms Quiz'
            },
            {
                'module': Module.objects.get(title='Machine Learning Foundations'),
                'title': 'ML Foundations Quiz'
            },
            {
                'module': Module.objects.get(title='Deep Learning Techniques'),
                'title': 'Deep Learning Quiz'
            },
            {
                'module': Module.objects.get(title='Ethics in AI'),
                'title': 'AI Ethics Quiz'
            },
        ]
        quiz_objects = []
        for quiz_data in quizzes:
            quiz = Quiz.objects.create(**quiz_data)
            quiz_objects.append(quiz)

        # Seed Questions for each Quiz
        questions_data = [
            {
                'quiz': quiz_objects[0],
                'text': 'What is Artificial Intelligence?'
            },
            {
                'quiz': quiz_objects[1],
                'text': 'Which algorithm is commonly used in AI?'
            },
            {
                'quiz': quiz_objects[2],
                'text': 'What is supervised learning in ML?'
            },
            {
                'quiz': quiz_objects[3],
                'text': 'What is a neural network?'
            },
            {
                'quiz': quiz_objects[4],
                'text': 'What are ethical concerns in AI development?'
            },
        ]
        question_objects = []
        for question_data in questions_data:
            question = Question.objects.create(**question_data)
            question_objects.append(question)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(question_objects)} questions.'))

        # Seed Answer Options for each Question
        answer_options_data = [
            {
                'question': question_objects[0],
                'text': 'A machine that mimics human behavior.',
                'is_correct': True
            },
            {
                'question': question_objects[0],
                'text': 'A device used for calculations.',
                'is_correct': False
            },
            {
                'question': question_objects[0],
                'text': 'A programming language for AI.',
                'is_correct': False
            },
            {
                'question': question_objects[0],
                'text': 'None of the above.',
                'is_correct': False
            },
        ]
        for answer_option_data in answer_options_data:
            AnswerOption.objects.create(**answer_option_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded answer options.'))

        # Seed Assignments
        self.stdout.write(self.style.SUCCESS('Seeding Assignments...'))
        assignments_data = [
            {
                'title': 'AI Fundamentals Assignment',
                'module': Module.objects.get(title='AI Overview'),
                'text': 'Explain the basics of AI and its applications.'
            },
            {
                'title': 'AI Algorithms Assignment',
                'module': Module.objects.get(title='AI Algorithms'),
                'text': 'List and explain the most commonly used AI algorithms.'
            },
            {
                'title': 'ML Foundations Assignment',
                'module': Module.objects.get(title='Machine Learning Foundations'),
                'text': 'Discuss the different types of machine learning models.'
            },
            {
                'title': 'Deep Learning Assignment',
                'module': Module.objects.get(title='Deep Learning Techniques'),
                'text': 'Explain the architecture of a neural network.'
            },
            {
                'title': 'Ethics in AI Assignment',
                'module': Module.objects.get(title='Ethics in AI'),
                'text': 'Discuss the ethical implications of AI in society.'
            },
        ]
        for assignment_data in assignments_data:
            Assignment.objects.create(**assignment_data)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
