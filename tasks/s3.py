import boto3

BUCKET = "dmelchor-assemblyai-hackathon"

def get_s3_client():
    return boto3.client("s3")

def get_file(filename, file_type="videos"):
    s3 = get_s3_client()
    print(f"data/{file_type}/{filename}")
    return s3.get_object(
        Key=f"data/{file_type}/{filename}",
        Bucket=BUCKET,
    )
