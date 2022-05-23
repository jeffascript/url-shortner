from click import password_option
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.redirect import router as RedirectRouter, redis
from fastapi_cache import caches, close_caches
from fastapi_cache.backends.redis import CACHE_KEY, RedisCacheBackend
import json
from decouple import config


app = FastAPI()


origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


def redis_cache():
    return caches.get(CACHE_KEY)


app.include_router(RedirectRouter, tags=[
                   "Redirect To Long URL"], prefix="/api/v1/redirect")


@app.get('/api/v1/all')
async def getAll():
    allKeysWithValues = []
    print(allKeysWithValues)
    allKeys = redis.keys()
    for key in allKeys:
        if(key != 'codified_urls'):
            obj = redis.get(key)
            allRedis = json.loads(obj)
            allKeysWithValues.append(allRedis)
    return {'response': allKeysWithValues}


@app.on_event('startup')
async def on_startup() -> None:
    rc = RedisCacheBackend(
        f"redis://:{config('REDIS_PASS')}@{config('REDIS_HOST')}:{config('REDIS_PORT')}")
    caches.set(CACHE_KEY, rc)


@app.on_event('shutdown')
async def on_shutdown() -> None:
    await close_caches()
