import os
from minio import Minio

BUCKET = "dmelchor-assemblyai-hackathon"


def get_client():
    return Minio(
        endpoint=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
        secure=False,
    )


def get_file(filename, file_type="videos"):
    client = get_client()
    print(f"data/{file_type}/{filename}")
    return client.get_object(
        object_name=f"data/{file_type}/{filename}",
        bucket_name=BUCKET,
    )
