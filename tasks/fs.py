import os
from minio import Minio

BUCKET = "dmelchor-assemblyai-hackathon"


def get_client():
    return Minio(
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
    )


def get_file(filename, file_type="videos"):
    client = get_client()
    print(f"data/{file_type}/{filename}")
    return client.get_object(
        Key=f"data/{file_type}/{filename}",
        Bucket=BUCKET,
    )
