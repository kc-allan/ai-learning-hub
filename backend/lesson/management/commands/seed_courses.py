"""populate courses"""
from django.core.management.base import BaseCommand
from lesson.models import Course, Module, Quiz, Question, AnswerOption, Assignment
from django.utils.timezone import now


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
            {
                'title': 'Computer Vision with AI',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Learn how AI is used to process and understand images.',
                'is_premium': True,
                'level': 'intermediate'
            },
            {
                'title': 'Natural Language Processing',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Learn about processing and analyzing human language using AI.',
                'is_premium': False,
                'level': 'intermediate'
            },
            {
                'title': 'Reinforcement Learning',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Study the basics of reinforcement learning algorithms.',
                'is_premium': True,
                'level': 'expert'
            },
            {
                'title': 'AI in Healthcare',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Explore how AI is revolutionizing the healthcare industry.',
                'is_premium': False,
                'level': 'intermediate'
            },
            {
                'title': 'AI in Robotics',
                'thumbnail': 'https://via.placeholder.com/150',
                'description': 'Learn how AI and robotics intersect to build intelligent machines.',
                'is_premium': True,
                'level': 'expert'
            }
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
                'course': course_objects[0],
                'title': 'AI Algorithms',
                'description': 'Learn various algorithms used in AI.',
                'content': 'Algorithms in AI are critical for decision making...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[0],
                'title': 'Machine Learning Foundations',
                'description': 'Explore the foundational aspects of machine learning.',
                'content': 'Machine learning is a subset of AI that allows systems to learn from data...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[1],
                'title': 'Deep Learning Techniques',
                'description': 'Deep dive into neural networks and learning techniques.',
                'content': 'Deep learning allows AI to simulate the neural networks of the human brain...',
                'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
                'course': course_objects[1],
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
                'quiz': quiz_objects[0],
                'text': 'Which algorithm is commonly used in AI?'
            },
            {
                'quiz': quiz_objects[0],
                'text': 'What is supervised learning in ML?'
            },
            {
                'quiz': quiz_objects[0],
                'text': 'What is a neural network?'
            },
            {
                'quiz': quiz_objects[0],
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
            # For Question: 'What is Artificial Intelligence?'
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

            # For Question: 'Which algorithm is commonly used in AI?'
            {
                'question': question_objects[1],
                'text': 'Linear Regression',
                'is_correct': True
            },
            {
                'question': question_objects[1],
                'text': 'Dijkstra\'s Algorithm',
                'is_correct': False
            },
            {
                'question': question_objects[1],
                'text': 'Binary Search',
                'is_correct': False
            },

            # For Question: 'What is supervised learning in ML?'
            {
                'question': question_objects[2],
                'text': 'Learning with labeled data to predict outcomes.',
                'is_correct': True
            },
            {
                'question': question_objects[2],
                'text': 'Learning without any labeled data.',
                'is_correct': False
            },
            {
                'question': question_objects[2],
                'text': 'Learning from trial and error.',
                'is_correct': False
            },

            # For Question: 'What is a neural network?'
            {
                'question': question_objects[3],
                'text': 'A system that mimics the brain\'s neural architecture.',
                'is_correct': True
            },
            {
                'question': question_objects[3],
                'text': 'A machine that computes numbers.',
                'is_correct': False
            },
            {
                'question': question_objects[3],
                'text': 'A type of unsupervised learning algorithm.',
                'is_correct': False
            },

            # For Question: 'What are ethical concerns in AI development?'
            {
                'question': question_objects[4],
                'text': 'Bias in decision-making processes.',
                'is_correct': True
            },
            {
                'question': question_objects[4],
                'text': 'Increased job opportunities for workers.',
                'is_correct': False
            },
            {
                'question': question_objects[4],
                'text': 'Decreased human dependency on technology.',
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
            }
        ]
        for assignment_data in assignments_data:
            Assignment.objects.create(**assignment_data)

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
