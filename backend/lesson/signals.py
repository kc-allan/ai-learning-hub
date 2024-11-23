from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Module
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, VideoUnavailable

@receiver(post_save, sender=Module)
def fetch_transcript(sender, instance, created, **kwargs):
    """Fetch trancript of the video"""
    if created:
        try:
            video_url = instance.video_url
            if "youtube.com" in video_url or "youtu.be" in video_url:

                if "youtu.be" in video_url:
                    video_id = video_url.split("/")[-1]
                else:
                    video_id = video_url.split("v=")[-1].split("&")[0]

                transcript = YouTubeTranscriptApi.get_transcript(video_id)
                transcript_text = "\n".join([entry['text'] for entry in transcript])
                print(transcript_text[0:10])

                Module.objects.filter(id=instance.id).update(content=transcript_text)

        except TranscriptsDisabled:
            print("Transcripts are disabled for this video.")
        except VideoUnavailable:
            print("The video is unavailable.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
