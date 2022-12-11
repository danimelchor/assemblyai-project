import boto3
import ffmpeg
import os
from utils import get_first_frame, change_extension

BUCKET = "dmelchor-assemblyai-hackathon"

def get_s3_client():
    return boto3.client("s3")
    
def upload_file(file):
    s3 = get_s3_client()

    # Save the video to disk
    filename = os.path.join("videos", file.filename)
    file.save(filename)
    
    # Upload the video
    s3.upload_file(
        Key=f"data/videos/{file.filename}",
        Bucket=BUCKET,
        Filename=filename,
    )
    
    # Upload the thumbnail
    img = get_first_frame(filename)
    filename_jpg = change_extension(file.filename, "jpg")
    s3.put_object(
        Key=f"data/images/{filename_jpg}",
        Bucket=BUCKET,
        Body=img,
    )

    # Delete the original video
    os.remove(filename)


def get_file_url(filename, file_type="video"):
    s3 = get_s3_client()
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": BUCKET,
            "Key": f"data/{file_type}/{filename}",
        },
        ExpiresIn=3600,
    )

def get_all_files(file_type="video"):
    s3 = get_s3_client()
    response = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix=f"data/{file_type}/",
    )
    return response["Contents"]

def delete_all():
    videos = get_all_files("videos")
    images = get_all_files("images")
    s3 = get_s3_client()
    for video in videos:
        s3.delete_object(
            Bucket=BUCKET,
            Key=video["Key"],
        )
    for image in images:
        s3.delete_object(
            Bucket=BUCKET,
            Key=image["Key"],
        )
