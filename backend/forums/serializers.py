from rest_framework.serializers import ModelSerializer
from .models import NewsArticle

class NewsSerializer(ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = "__all__"