from mongoengine import Document, StringField, IntField, DateTimeField, ObjectIdField, LongField
from bson import ObjectId
from datetime import datetime


class Url(Document):
    id: ObjectId()  # ObjectIdField = ObjectIdField(primary_key=True)
    longUrl = StringField(required=True)
    shortCode = StringField(required=True, unique=True)
    shortUrl = StringField(required=True)
    visitorCount = IntField(required=True, default=0)
    createdAt = DateTimeField(default=datetime.now())
    expiresIn = LongField(required=True)
