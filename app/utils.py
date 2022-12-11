import hashlib
from io import BytesIO
import cv2
from flask import send_file
from PIL import Image


def get_first_frame(video_path):
    try:
        # Open the video (flask file object)
        video = cv2.VideoCapture(video_path)

        # Read the first frame
        _, frame = video.read()

        # Release the video
        video.release()

        # Convert the frame to a PIL image
        img = Image.fromarray(frame)
    except:
        # Load videos/audio.jpg as a fallback
        img = Image.open("images/audio.jpeg")

    # Convert the image to a byte array for s3
    in_mem_file = BytesIO()
    img.save(in_mem_file, format="JPEG")
    in_mem_file.seek(0)

    return in_mem_file


def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, "JPEG", quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype="image/jpeg")


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def extract_organization_from_email(email):
    domain = email.split("@")[1]
    return domain.split(".")[0]


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def remove_extension(filename):
    # Split by the last period
    parts = filename.split(".")

    # Remove the last part
    parts.pop()

    # Join the parts with periods
    return ".".join(parts)


def change_extension(filename, new_ext):
    # Remove the old extension
    filename = remove_extension(filename)

    # Add the new extension
    return filename + "." + new_ext
