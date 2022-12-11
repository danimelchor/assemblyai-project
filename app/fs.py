import os
from app.utils import abs_dir
from minio import Minio
from utils import get_first_frame, change_extension

BUCKET = "dmelchor-assemblyai-hackathon"


def get_client():
    return Minio(
        endpoint=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
    )


def upload_file(file):
    client = get_client()

    # Save the video to disk
    filename = abs_dir(os.path.join("videos", file.filename))
    file.save(filename)

    # Upload the video
    client.put_object(
        Bucket=BUCKET,
        Key=f"data/videos/{file.filename}",
        Body=file,
    )

    # Upload the thumbnail
    img = get_first_frame(filename)
    filename_jpg = change_extension(file.filename, "jpg")
    client.put_object(
        Key=f"data/images/{filename_jpg}",
        Bucket=BUCKET,
        Body=img,
    )

    # Delete the original video
    os.remove(filename)


def get_file_url(filename, file_type="video"):
    client = get_client()
    return client.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": BUCKET,
            "Key": f"data/{file_type}/{filename}",
        },
        ExpiresIn=3600,
    )
