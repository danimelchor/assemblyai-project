import jwt
import time
from functools import wraps
from flask import request
import os
import db


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get the jwt token from the cookies
        token = request.cookies.get("jwt")

        # Try to load the user
        try:
            payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        except:
            print("Error decoding token")
            return {"error": "Please log in first"}, 401

        # Get the user
        email = payload.get("user", None).get("email", None)
        user = db.get_user(email)

        # Check if the user exists
        if user is None:
            print("User does not exist")
            return {"error": "Please log in first"}, 401

        # Check if the token is expired
        if payload["exp"] < time.time():
            print("Token expired")
            return {"error": "Please log in first"}, 401

        # Add the user to the request
        request.user = user

        # Call the original function
        return f(*args, **kwargs)

    return decorated_function


def login_user(user):
    # Generate the token
    token = jwt.encode(
        {"user": user, "exp": time.time() + 60 * 60 * 24},
        os.getenv("SECRET_KEY"),
        algorithm="HS256",
    )

    # Create the cookie header with no same-site restriction
    cookie = f"jwt={token}; SameSite=None; Secure; Max-Age=86400"

    return {"Set-Cookie": cookie}


def get_user_from_token(token):
    # Try to load the user
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
    except:
        return None

    # Get the user
    user = payload.get("user", None)

    # Check if the user exists
    if user is None:
        return None

    # Check if the token is expired
    if payload["exp"] < time.time():
        return None

    return user
