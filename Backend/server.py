from fastapi import FastAPI, Request
import psycopg2
import urllib.parse
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
db = psycopg2.connect(
    host=os.environ.get('DBHOST'),
    port=os.environ.get('DBPORT'),
    dbname=os.environ.get('DBNAME'),
    user=os.environ.get('DBUSER'),
    password=os.environ.get('DBPASSWORD')
)

cursor = db.cursor()
is_hacker = False

with open('oauth_token') as fd:
    flag = fd.read()

cursor.execute("CREATE TABLE IF NOT EXISTS oauth_tokens (oauth_token TEXT)")
cursor.execute("CREATE TABLE IF NOT EXISTS media (id SERIAL PRIMARY KEY, artist TEXT, song TEXT)")
cursor.execute("INSERT INTO oauth_tokens VALUES (%s) ON CONFLICT DO NOTHING", (flag,))
db.commit()

def catch_hacker(input):
    global is_hacker
    print(input)
    if any(char in input for char in ['\'', ' --', '-- ', ";", "#"]):
        is_hacker = True
    print(urllib.parse.unquote(input))
    return urllib.parse.unquote(input)

@app.get("/")
def shuru():
    try:
        return {"error": None}
    except:
        return {"error": "An unknown error occurred"}

@app.post("/add-song")
def add_song(request: Request):
    global is_hacker
    is_hacker = False
    params = request.query_params
    artist = catch_hacker(params.get("artist", ""))
    song = catch_hacker(params.get("song", ""))
    try:
        assert not is_hacker, "Hacker found"
        cursor.execute("INSERT INTO media (artist, song) VALUES (%s, %s)", (artist, song))
        db.commit()
        cursor.execute("SELECT id, artist, song FROM media")
        results = cursor.fetchall()
    except Exception as e:
        return { "is_hacker": is_hacker, "error": f"An error occurred : {e}" }
    except:
        return { "is_hacker": is_hacker, "error": "An unknown error occurred" }
    return { "is_hacker": is_hacker,  "error": None, "playlist": results }

@app.post("/play-artist")
def play_artist(request: Request):
    global is_hacker
    is_hacker = False
    params = request.query_params
    artist = catch_hacker(params.get("artist", ""))
    try:
        assert not is_hacker, "Hacker found"
        cursor.execute("SELECT id, artist, song FROM media WHERE artist = %s", (artist,))
        results = cursor.fetchall()
    except Exception as e:
        return { "is_hacker": is_hacker, "error": f"An error occurred : {e}" }
    except:
        return { "is_hacker": is_hacker, "error": f"An unknown error occurred" }
    return {"is_hacker": is_hacker, "error": None, "playlist": results}

@app.post("/play-song")
def play_song(request: Request):
    global is_hacker
    is_hacker = False
    params = request.query_params
    song = catch_hacker(params.get("song", ""))
    try:
        assert not is_hacker, "Hacker found"
        cursor.execute("SELECT id, artist, song FROM media WHERE song = %s", (song,))
        results = cursor.fetchall()
    except Exception as e:
        return { "is_hacker": is_hacker, "error": f"An error occurred : {e}" }
    except:
        return { "is_hacker": is_hacker, "error": f"An unknown error occurred" }
    return {"is_hacker": is_hacker, "error": None, "playlist": results}

@app.post("/shuffle-artist")
def shuffle_artist():
    try:
        assert not is_hacker, "Hacker found"
        cursor.execute("SELECT artist FROM media ORDER BY RANDOM()")
        artist_row = cursor.fetchone()
        if artist_row:
            artist = artist_row[0]
            cursor.execute("SELECT id, artist, song FROM media WHERE artist = '{}' LIMIT 1".format(artist))
            results = cursor.fetchall()
            return {"is_hacker": is_hacker, "error": None, "playlist": results}
        else:
            return {"is_hacker": is_hacker, "error": "No artists in database yet."}
    except Exception as e:
        return { "is_hacker": is_hacker, "error": f"An error occurred : {e}" }
    except:
        return { "is_hacker": is_hacker, "error": f"An unknown error occurred" }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
