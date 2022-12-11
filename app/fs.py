from datetime import timedelta
import os
from utils import abs_dir
from minio import Minio
from utils import get_first_frame, change_extension

BUCKET = "dmelchor-assemblyai-hackathon"


def get_client():
    return Minio(
        endpoint=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
        secure=False,
    )


def upload_file(file):
    client = get_client()

    # Save the video to disk
    filename = abs_dir("videos", file.filename)
    file.save(filename)

    # Upload the video
    client.put_object(
        bucket_name=BUCKET,
        object_name=f"data/videos/{file.filename}",
        data=file,
        length=file.content_length,
    )

    # Upload the thumbnail
    img = get_first_frame(filename)
    filename_jpg = change_extension(file.filename, "jpg")
    client.put_object(
        object_name=f"data/images/{filename_jpg}",
        bucket_name=BUCKET,
        data=img,
        length=len(img),
    )

    # Delete the original video
    os.remove(filename)


def get_file_url(filename, file_type="video"):
    client = get_client()
    return client.generate_presigned_url(
        "GET",
        BUCKET,
        f"data/{file_type}/{filename}",
        expires=timedelta(hours=2),
    )
