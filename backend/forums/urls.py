from django.urls import path
from .news_views import list_news

urlpatterns = [
    path('news/', list_news, name="news")
]
