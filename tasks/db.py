import psycopg2
import psycopg2.extras

import os

def connect():
    return psycopg2.connect(
        host=os.environ['POSTGRES_HOST'],
        database=os.environ['POSTGRES_DB'],
        user=os.environ['POSTGRES_USER'],
        password=os.environ['POSTGRES_PASSWORD']
    )

def get_cursor(connection):
    cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    return cursor

def save_transcribed_video(filename, user, full_text, segments):
    # Connect to the database
    connection = connect()
    cursor = get_cursor(connection)

    # Get id of the video
    sql = "SELECT id FROM videos WHERE filename = %s AND organization_id = %s"
    cursor.execute(sql, (filename, user["organization_id"]))
    video_id = cursor.fetchone()["id"]

    # Update the video with the full text and status
    sql = "UPDATE videos SET full_captions = %s, task_id = NULL WHERE id = %s"
    cursor.execute(sql, (full_text, video_id))

    # Create segments by sentence and save them to the database
    sql = "INSERT INTO captions (video_id, start_time, end_time, text) VALUES (%s, %s, %s, %s)"
    cursor.executemany(
        sql, [(video_id, s["start"], s["end"], s["text"]) for s in segments]
    )

    # Commit the changes
    connection.commit()
    connection.close()