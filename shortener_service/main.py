from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from mongoengine import connect, disconnect, errors
import schemas
from routes.shorten import router as ShortenRouter
from decouple import config
from models import Url
import json
import bson

MONGO_URI = config('MONGO_URI')
print(MONGO_URI)

app = FastAPI()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Connect the shorten.py route
app.include_router(ShortenRouter, tags=[
                   "Shorten Long URL"], prefix="/api/v1/shorten")


@app.get('/api/v1/healthcheck', tags=["HealthCheck"])
async def checkHealth():
    return {"status": "OK"}


@app.get('/api/v1/', tags=["Get All URLs"])
async def getAllUrls():
    allData = Url.objects().to_json()
    one = Url.objects(id=bson.ObjectId(
        "62892d9a3707caa313111ee2")).to_json()
    print(one)

    return json.loads(allData)


@app.on_event("startup")
async def createDbClient():
    try:
        connect(

            host=MONGO_URI,

        )
        print("connected to mongo")

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error connecting to database"
        )


@app.on_event("shutdown")
async def closeDbClient():
    pass
