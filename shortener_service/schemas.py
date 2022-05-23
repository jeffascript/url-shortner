from typing import Optional


from pydantic import BaseModel, validator, constr

from datetime import datetime

from bson import ObjectId

import validators


class UrlSchema(BaseModel):
    longUrl: str
    customCode: Optional[constr(max_length=5)] = None
    expiresIn: Optional[int] = None

    @validator('longUrl')
    def validatUrl(cls, v):
        if not validators.url(v):
            raise ValueError('Invalid URL')
        return v
