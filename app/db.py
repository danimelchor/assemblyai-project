import psycopg2
import psycopg2.extras

from utils import (
    hash_password,
    get_first_frame,
    extract_organization_from_email,
    dict_factory,
)
import os


def connect():
    return psycopg2.connect(
        host=os.environ["POSTGRES_HOST"],
        database=os.environ["POSTGRES_DB"],
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
    )


def get_cursor(connection):
    cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    return cursor


def save_video(filename, user, task_id):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Save the video to the database
    sql = "INSERT INTO videos (organization_id, filename, task_id) VALUES (%s, %s, %s)"
    cursor.execute(sql, (user["organization_id"], filename, task_id))

    # Commit the changes & close
    connection.commit()
    connection.close()


def get_processing_videos(user):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Get the videos that are still processing
    sql = "SELECT id, filename, task_id FROM videos WHERE task_id IS NOT NULL AND organization_id = %s"
    cursor.execute(sql, (user["organization_id"],))
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    return results if len(results) > 0 else []


def get_processed_videos(user):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Get the videos that are still processing
    sql = (
        "SELECT id, filename FROM videos WHERE task_id IS NULL AND organization_id = %s"
    )
    cursor.execute(sql, (user["organization_id"],))
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    return results if len(results) > 0 else []


def search_videos(query, user):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Create the SQL query
    sql = """
        SELECT
            id,
            filename,
            ts_rank_cd(vector, phraseto_tsquery(%s)) AS rank
        FROM videos
        WHERE organization_id = %s
        AND task_id IS NULL
        AND vector @@ phraseto_tsquery(%s)
    """

    # Execute the query
    cursor.execute(sql, (query, user["organization_id"], query))

    # Get the results
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    return results if len(results) > 0 else []


def get_captions(video_id, user):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Create the SQL query
    sql = """
        SELECT start_time, end_time, text
        FROM captions
        JOIN videos ON captions.video_id = videos.id
        WHERE captions.video_id = %s AND videos.organization_id = %s
    """

    # Execute the query
    cursor.execute(sql, (video_id, user["organization_id"]))

    # Get the results
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    return results if len(results) > 0 else None


def get_video(video_id, user):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Create the SQL query
    sql = """
        SELECT videos.filename
        FROM videos
        WHERE videos.id = %s AND videos.organization_id = %s
    """

    # Execute the query
    cursor.execute(sql, (video_id, user["organization_id"]))
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    if len(results) > 0:
        return results[0]["filename"]
    return None


def get_thumbnail(video_id, user):
    filename = get_video(video_id, user)
    if not filename:
        return None

    # Get the first frame of the video
    img = get_first_frame(filename)
    return img


def get_user(email):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Create the SQL query
    sql = """
        SELECT users.id as id, email, users.organization_id as organization_id, organizations.name as organization
        FROM users JOIN organizations ON users.organization_id = organizations.id
        WHERE email = %s
    """

    # Execute the query
    cursor.execute(sql, (email,))

    # Get the results as a dictionary
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    return results[0] if len(results) > 0 else None


def authenticate(email, password):
    # Hash the password
    password = hash_password(password)

    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Create the SQL query
    sql = "SELECT email FROM users WHERE email = %s AND password = %s"

    # Execute the query
    cursor.execute(sql, (email, password))

    # Get the results
    results = cursor.fetchall()

    # Close the connection
    connection.close()

    # Return the results
    return get_user(email) if len(results) > 0 else None


def create_organization(name):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Check if the organization already exists
    sql = "SELECT id FROM organizations WHERE name = %s"
    cursor.execute(sql, (name,))
    results = cursor.fetchall()
    if len(results) > 0:
        return results[0]["id"]

    # Create the SQL query
    sql = "INSERT INTO organizations (name) VALUES (%s) RETURNING id"
    cursor.execute(sql, (name,))
    organization_id = cursor.fetchone()["id"]

    # Commit the changes
    connection.commit()

    # Close the connection
    connection.close()

    # Return the results
    return organization_id


def create_user(email, password):
    # Hash the password
    password = hash_password(password)

    # Get the organization from the email
    organization = extract_organization_from_email(email)
    id = create_organization(organization)

    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Check if the user already exists
    sql = "SELECT email FROM users WHERE email = %s"
    cursor.execute(sql, (email,))
    results = cursor.fetchall()
    if len(results) > 0:
        return None

    # Create the SQL query
    sql = "INSERT INTO users (email, password, organization_id) VALUES (%s, %s, %s)"

    # Execute the query
    cursor.execute(sql, (email, password, id))

    # Commit the changes
    connection.commit()

    # Close the connection
    connection.close()

    # Return the results
    return get_user(email)
