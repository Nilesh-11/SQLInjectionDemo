from fastapi import FastAPI, Request, HTTPException, Depends
import psycopg2
import urllib.parse
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.environ.get('DBHOST'),  # Use 'db' as the hostname (Docker service name)
            port=os.environ.get('DBPORT'),
            dbname=os.environ.get('DBNAME'),
            user=os.environ.get('DBUSER'),
            password=os.environ.get('DBPASSWORD')
        )
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")

is_hacker = False

# Read the oauth_token file (ensure it exists in Docker)
try:
    with open('oauth_token', 'r') as fd:
        flag = fd.read().strip()
except FileNotFoundError:
    flag = "default_flag"

# Initialize the database
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS oauth_tokens (oauth_token TEXT)")
    cursor.execute("CREATE TABLE IF NOT EXISTS media (id SERIAL PRIMARY KEY, artist TEXT, song TEXT)")
    cursor.execute("INSERT INTO oauth_tokens VALUES (%s) ON CONFLICT DO NOTHING", (flag,))
    conn.commit()
    cursor.close()
    conn.close()

init_db()  # Initialize DB on startup

def catch_hacker(input_text):
    global is_hacker
    if any(char in input_text for char in ['\'', ' --', '-- ', ";", "#"]):
        is_hacker = True
    return urllib.parse.unquote(input_text)

@app.get("/")
def shuru():
    return {"error": None}

@app.post("/add-song")
def add_song(request: Request):
    global is_hacker
    is_hacker = False
    params = request.query_params
    artist = catch_hacker(params.get("artist", ""))
    song = catch_hacker(params.get("song", ""))

    try:
        assert not is_hacker, "Hacker detected"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO media (artist, song) VALUES (%s, %s)", (artist, song))
        conn.commit()
        cursor.execute("SELECT id, artist, song FROM media")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        return {"is_hacker": is_hacker, "error": f"An error occurred: {e}"}

    return {"is_hacker": is_hacker, "error": None, "playlist": results}

@app.post("/play-artist")
def play_artist(request: Request):
    global is_hacker
    is_hacker = False
    params = request.query_params
    artist = catch_hacker(params.get("artist", ""))

    try:
        assert not is_hacker, "Hacker detected"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, artist, song FROM media WHERE artist = %s", (artist,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        return {"is_hacker": is_hacker, "error": f"An error occurred: {e}"}

    return {"is_hacker": is_hacker, "error": None, "playlist": results}

@app.post("/play-song")
def play_song(request: Request):
    global is_hacker
    is_hacker = False
    params = request.query_params
    song = catch_hacker(params.get("song", ""))

    try:
        assert not is_hacker, "Hacker detected"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, artist, song FROM media WHERE song = %s", (song,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception as e:
        return {"is_hacker": is_hacker, "error": f"An error occurred: {e}"}

    return {"is_hacker": is_hacker, "error": None, "playlist": results}

@app.post("/shuffle-artist")
def shuffle_artist():
    try:
        assert not is_hacker, "Hacker detected"
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT artist FROM media ORDER BY RANDOM()")
        artist_row = cursor.fetchone()
        if artist_row:
            artist = artist_row[0]
            cursor.execute("SELECT id, artist, song FROM media WHERE artist = '{}' LIMIT 1".format(artist))
            results = cursor.fetchall()
        else:
            results = []
        cursor.close()
        conn.close()
        return {"is_hacker": is_hacker, "error": None, "playlist": results}
    except Exception as e:
        return {"is_hacker": is_hacker, "error": f"An error occurred: {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
