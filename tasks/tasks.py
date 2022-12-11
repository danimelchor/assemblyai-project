from celery import Celery
import os
import db
import ffmpeg
import s3
from utils import change_extension
from ai import transcribe_video

if os.environ.get("ENVIRONMENT", "DEVELOPMENT") == "DEVELOPMENT":
    print("Loading .env file")
    from dotenv import load_dotenv
    load_dotenv("../.env")

# Celery configuration
celery = Celery("tasks", backend=os.environ["CELERY_BACKEND_URL"], broker=os.environ["CELERY_BROKER_URL"])

# Celery tasks
@celery.task(bind=True, name="tasks.process_video")
def process_video(celerySelf, filename, user):
    # Get the video from S3
    video = s3.get_file(filename, file_type="videos")
    abs_filename = os.path.join("videos", filename)
    with open(abs_filename, "wb") as f:
        f.write(video["Body"].read())

    # Extract audio from the video
    mp3_filename = change_extension(abs_filename, "mp3")
    ffmpeg.input(abs_filename).output(mp3_filename).run(overwrite_output=True)

    # Transcribe the audio
    result = transcribe_video(celerySelf, mp3_filename)
    full_text = result["text"]
    segments = result["segments"]

    # Save the video to the database
    db.save_transcribed_video(filename, user, full_text, segments)

    # Delete the video and audio files
    os.remove(abs_filename)
    os.remove(mp3_filename)