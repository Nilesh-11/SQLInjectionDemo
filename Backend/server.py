from dbManager import *

from fastapi import FastAPI, Request, HTTPException, Depends
import psycopg2
import urllib.parse
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import defaultdict
import time
import string
import random
import re
import threading

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

db = dbManager(
    host=os.environ.get('DBHOST'),  # Use 'db' as the hostname (Docker service name)
    port=os.environ.get('DBPORT'),
    dbname=os.environ.get('DBNAME'),
    user=os.environ.get('DBUSER'),
    password=os.environ.get('DBPASSWORD')
)

class resetTimerSettings(BaseModel):
    uid : str

# global variables
active_users = []
user_info = defaultdict(lambda: {'endTime': None, 'is_hacker': False, 'ip': None})

flag = "{hidden_flag}"

db.execute_query("CREATE TABLE IF NOT EXISTS oauth_tokens (oauth_token TEXT)")
db.execute_query("INSERT INTO oauth_tokens VALUES (%s) ON CONFLICT DO NOTHING", (flag,))

def init_table(uid):
    query = f'''
    CREATE TABLE IF NOT EXISTS media_{uid} (id SERIAL PRIMARY KEY, artist TEXT, song TEXT)
    '''

def catch_hacker(input_text):
    global is_hacker
    if any(char in input_text for char in ['\'', ' --', '-- ', ";", "#"]):
        is_hacker = True
    return urllib.parse.unquote(input_text)

def check_db():
    global user_info, active_users
    while True:
        invalid_users = set()
        curr_time = time.time()
        for uid in active_users:
            if user_info[uid]['endTime'] < curr_time and uid not in invalid_users:
                invalid_users.add(uid)
        for uid in invalid_users:
            print("removing table: media_", uid)
            db.execute_query(f"DROP TABLE media_{uid}")
            if uid in active_users:
                active_users.remove(uid)
            print(active_users)
        time.sleep(1)

thread_ctrl = threading.Event()
db_thread = threading.Thread(target=check_db)
db_thread.start()

@app.get("/")
def shuru():
    return {"error": None}

@app.get("/test")
def test(request: Request):
    global user_info, active_users
    params = request.query_params
    return {"users": active_users, 'time': time.time()}

@app.get("/init")
def init(request: Request):
    thread_ctrl.set()
    try:
        uid = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
        while uid in active_users:
            uid = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
        user_info[uid] = {
            'ip': request.client.host,
            'endTime': time.time() + 10,
            'is_hacker': False
        }
        db.execute_query(f"CREATE TABLE IF NOT EXISTS media_{uid} (id SERIAL PRIMARY KEY, artist TEXT, song TEXT)")
        time.sleep(2)
        results = db.fetch_all(f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        active_users.append(uid)
    except:
        return {"error": "user not created"}
    finally:
        thread_ctrl.clear()
    return {"uid": uid, "error": None}

@app.post("/reset-timer")
def reset_timer(event_settings: resetTimerSettings):
    if not event_settings.uid:
        return HTTPException(status_code=400, detail="Bad request from the client")
    if event_settings.uid not in active_users:
        return { "error": "Session terminated"}
    user_info[event_settings.uid]["endTime"] = time.time() + 10
    return {"error": None}

@app.post("/add-song")
def add_song(request: Request):
    global user_info, active_users
    params = request.query_params
    artist = catch_hacker(params.get("artist", ""))
    song = catch_hacker(params.get("song", ""))

    uid = params.get("uid", "")
    if uid not in active_users:
        return { 'error' : "user not found", 'is_hacker': False}
    user_info[uid]['is_hacker'] = False
    if  request.client.host != user_info[uid]['ip']:
        user_info[uid]['is_hacker'] = True
    mediaTableName = f"media_{uid}"

    try:
        assert not user_info[uid]['is_hacker'], "Hacker detected"
        query = f"INSERT INTO {mediaTableName} (artist, song) VALUES (%s, %s)"
        db.execute_query(query, (artist, song))
        query = f"SELECT id, artist, song FROM {mediaTableName}"
        results = db.fetch_all(query)
    except Exception as e:
        return {"is_hacker": user_info[uid]['is_hacker'], "error": f"An error occurred: {e}"}

    return {"is_hacker": user_info[uid]['is_hacker'], "error": None, "playlist": results}

@app.post("/play-artist")
def play_artist(request: Request):
    global user_info, active_users
    params = request.query_params
    artist = catch_hacker(params.get("artist", ""))
    
    uid = params.get("uid", "")
    if uid not in active_users:
        return { 'error' : "user not found", 'is_hacker': False}
    user_info[uid]['is_hacker'] = False
    if  request.client.host != user_info[uid]['ip']:
        user_info[uid]['is_hacker'] = True
    mediaTableName = f"media_{uid}"
    
    try:
        assert not user_info[uid]['is_hacker'], "Hacker detected"
        query = f"SELECT id, artist, song FROM {mediaTableName} WHERE artist = %s"
        results = db.fetch_all(query, (artist, ))
    except Exception as e:
        return {"is_hacker": user_info[uid]['is_hacker'], "error": f"An error occurred: {e}"}

    return {"is_hacker": user_info[uid]['is_hacker'], "error": None, "playlist": results}

@app.post("/play-song")
def play_song(request: Request):
    global user_info, active_users
    params = request.query_params
    song = catch_hacker(params.get("song", ""))
    
    uid = params.get("uid", "")
    if uid not in active_users:
        return { 'error' : "user not found", 'is_hacker': False}
    user_info[uid]['is_hacker'] = False
    if  request.client.host != user_info[uid]['ip']:
        user_info[uid]['is_hacker'] = True
    mediaTableName = f"media_{uid}"

    try:
        assert not user_info[uid]['is_hacker'], "Hacker detected"
        query = f"SELECT id, artist, song FROM {mediaTableName} WHERE song = %s"
        results = db.fetch_all(query, (song, ))
    except Exception as e:
        return {"is_hacker": user_info[uid]['is_hacker'], "error": f"An error occurred: {e}"}

    return {"is_hacker": user_info[uid]['is_hacker'], "error": None, "playlist": results}

@app.post("/shuffle-artist")
def shuffle_artist(request: Request):
    global user_info, active_users
    params = request.query_params
    
    uid = params.get("uid", "")
    if uid not in active_users:
        return { 'error' : "user not found", 'is_hacker': False}
    user_info[uid]['is_hacker'] = False
    if  request.client.host != user_info[uid]['ip']:
        user_info[uid]['is_hacker'] = True
    mediaTableName = f"media_{uid}"
    
    try:
        assert not user_info[uid]['is_hacker'], "Hacker detected"
        query = f"SELECT artist FROM {mediaTableName} ORDER BY RANDOM()"
        artist_row = db.fetch_one(query)
        if artist_row:
            artist = artist_row[0]
            query = f"SELECT id, artist, song FROM {mediaTableName} WHERE artist = '{artist}' LIMIT 1"
            results = db.fetch_all(query)
        else:
            results = []
        return {"is_hacker": user_info[uid]['is_hacker'], "error": None, "playlist": results}
    except Exception as e:
        return {"is_hacker": user_info[uid]['is_hacker'], "error": f"An error occurred: {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
