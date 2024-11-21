from django.db import models
from lesson.custom import UUID_field


class NewsArticle(models.Model):
    """
    AI news that are fetched from news Api and seeded into db
    """
    id = UUID_field()
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(unique=True)  # Ensure no duplicate articles
    image_url = models.URLField(null=True, blank=True)
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


    