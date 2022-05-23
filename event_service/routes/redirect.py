from fastapi import APIRouter, Depends, HTTPException, Header
from starlette.responses import RedirectResponse
from models import Url
from decouple import config
from redis_om import get_redis_connection, HashModel
# from pubsub.consumer import redis

import json


redis = get_redis_connection(
    host=config('REDIS_HOST'),
    port=config('REDIS_PORT'),
    password=config('REDIS_PASS'),
    decode_responses=True
)


router = APIRouter()


@router.get("/{shortCode}")
async def redirectUrl(shortCode: str):
    # Query the database for the document that matches the shortCode from the path param

    isInCache = redis.get(shortCode)
    if isInCache is None:
        raise HTTPException(
            status_code=404, detail="URL not found or must have expired!")

    try:

        response = json.loads(isInCache)
        print(response)
        newResp = response["visitorCount"]
        newResp = int(newResp) + 1
        response["visitorCount"] = newResp

        redis.set(shortCode, json.dumps(response))
        print(response)
        # response = RedirectResponse(url=url["longUrl"])
        return RedirectResponse(url=response["longUrl"])

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Something went wrong!"
        )
