import os

from utils import process_segments

from custom_whisper import transcribe
from whisper import load_model


def transcribe_video(celerySelf, video_path):
    # Load the model
    model = load_model("base")

    # Transcribe the video
    result = transcribe(
        model, video_path, language="en", fp16=False, celerySelf=celerySelf
    )

    return {"text": result["text"], "segments": process_segments(result["segments"])}
