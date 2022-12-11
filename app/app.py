import os
from flask import Flask, request
from celery import Celery
from flask_cors import CORS

import db
import fs

from auth import get_user_from_token, login_required, login_user
from utils import change_extension

if os.environ.get("ENVIRONMENT", "DEVELOPMENT") == "DEVELOPMENT":
    from dotenv import load_dotenv
    load_dotenv("../.env")

app = Flask(__name__)
app.secret_key = os.environ["SECRET_KEY"].encode()
CORS(app, supports_credentials=True)

# Celery configuration
celery = Celery(
    "tasks",
    backend=os.environ["CELERY_BACKEND_URL"],
    broker=os.environ["CELERY_BROKER_URL"],
)


# Routes
@app.route("/")
def health():
    return "OK"


@app.route("/upload", methods=["POST"])
@login_required
def upload():
    # Get user
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)

    # Get the files from post request
    files = request.files.getlist("files")
    for file in files:
        # Save actual file
        fs.upload_file(file)

        # Process the video
        task_id = celery.send_task("tasks.process_video", args=[file.filename, user]).id

        # Save the video to the database
        db.save_video(file.filename, user, task_id)

    return "File successfully uploaded"


@app.route("/search", methods=["GET"])
@login_required
def search():
    # Get user
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)

    # Get the query from the URL
    query = request.args.get("q")

    # Search for videos
    results = db.search_videos(query, user)

    # Add their status
    for r in results:
        r["status"] = "SUCCESS"

    # Return the results
    return {"results": results}


@app.route("/processing", methods=["GET"])
@login_required
def processing():
    # Get user
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)

    # Search for videos
    processing = db.get_processing_videos(user)
    processed = db.get_processed_videos(user)

    # Get their status
    for r in processing:
        result = celery.AsyncResult(r["task_id"])
        r["status"] = result.state
        if result.state == "PROGRESS":
            r["progress"] = result.info.get("progress", 0)
    for r in processed:
        r["status"] = "SUCCESS"

    # Return the results
    return {"processing": processing, "processed": processed}


@app.route("/thumbnail/<video_id>")
@login_required
def frame(video_id):
    # Get user
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)

    # Get the video path
    video = db.get_video(video_id, user)

    if video is None:
        return {"error": "You are not authorized to view this video"}, 401

    # Return the video (as a response)
    filename_jpg = change_extension(video, "jpg")
    video_url = fs.get_file_url(filename_jpg, file_type="images")
    return {"src": video_url}


@app.route("/video/<video_id>")
@login_required
def video(video_id):
    # Get user
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)

    # Get the video path
    video = db.get_video(video_id, user)

    if video is None:
        return {"error": "You are not authorized to view this video"}, 401

    # Return the video (as a response)
    video_url = fs.get_file_url(video, file_type="videos")
    return {"src": video_url}


@app.route("/captions/<video_id>")
@login_required
def captions(video_id):
    # Get user
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)

    # Get the subtitles
    captions = db.get_captions(video_id, user)
    if captions is None:
        return {"error": "You are not authorized to view this video"}, 401

    # Return the subtitles
    return {"captions": captions}


# Authentication
@app.route("/login", methods=["POST"])
def login():
    # Get the email and password from the request json
    email = request.json.get("email")
    password = request.json.get("password")

    # authenticate the user
    if user := db.authenticate(email, password):
        # Log the user in
        cookie = login_user(user)

        # Return a success message
        return user, 200, cookie

    # Return a failure message
    return {"error": "Invalid email or password"}, 401


@app.route("/register", methods=["POST"])
def register():
    # Get the email and password from the request json
    email = request.json.get("email")
    password = request.json.get("password")

    # Create the user
    user = db.create_user(email, password)
    if user is None:
        return {"error": "Email already exists"}, 400

    # Log the user in
    cookie = login_user(user)

    # Return a success message
    return user, 200, cookie


@app.route("/logout")
@login_required
def logout():
    return (
        {"message": "Logged out successfully"},
        200,
        {"Set-Cookie": "jwt=; Max-Age=0"},
    )


@app.route("/whoami")
def whoami():
    jwt = request.cookies.get("jwt")
    user = get_user_from_token(jwt)
    email = user.get("email") if user else None
    real_user = db.get_user(email)
    if real_user is None:
        return {"error": "You are not logged in"}, 401
    return user


if __name__ == "__main__":
    app.run(port=5001, host="0.0.0.0", debug=True)
