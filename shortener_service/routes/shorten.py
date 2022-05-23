from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from models import Url
from schemas import UrlSchema
import os
import shortuuid
from decouple import config
import bson
from redis_om import get_redis_connection, HashModel

router = APIRouter()


redis = get_redis_connection(
    host=config('REDIS_HOST'),
    port=config('REDIS_PORT'),
    password=config('REDIS_PASS'),
    decode_responses=True
)


@router.post('/', response_model=dict)
async def shorten(url: UrlSchema):
    # convert pydantic schema object to python dict
    url = dict(url)

# If a customCode is supplied, that will be the shortCode, else generate a random
# shortCode
    if (url['customCode']):
        shortCode = url['customCode']
    else:
        shortCode = shortuuid.ShortUUID().random(length=5)

    if url['expiresIn']:
        expiresInSec = url['expiresIn'] * 60  # convert to seconds from minutes
    else:
        expiresInSec = 3600

    # Generate short URL by joining BASE_URL to shortCode
   ## shortUrl = os.getenv('BASE_URL') + shortCode
    shortUrl = config('BASE_URL') + shortCode

    # Raise an exception if a record in the database already uses that shortCode
    urlExists = Url.objects(shortCode=shortCode)
    if (len(urlExists) > 0):
        raise HTTPException(
            status_code=400, detail="ShortCode already exists. Choose a new one.")

    # Create a new record in the database
    try:
        newUrl = Url(longUrl=url['longUrl'],
                     shortCode=shortCode, shortUrl=shortUrl, expiresIn=int(expiresInSec))
        print(newUrl)
        newUrl.save()
        toSend = {
            "id": bson.ObjectId.__str__(newUrl.id),
            "longUrl": newUrl.longUrl,
            "shortCode": newUrl.shortCode,
            "shortUrl": newUrl.shortUrl,
            "visitorCount": newUrl.visitorCount,
            "expiresIn": newUrl.expiresIn,
            "createdAt": str(newUrl.createdAt),
        }
        print("ID IS", toSend)
        print("TYPE IS", type(toSend))
        print("TRUE", toSend["id"] == bson.ObjectId.__str__(newUrl.id))
        redis.xadd("codified_urls", toSend, "*")
        return {"message": "Successfully shortened URL", "shortUrl": shortUrl, "shortCode": newUrl.shortCode, "longUrl": url['longUrl']}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error saving to database")
