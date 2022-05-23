
import time
import json
from routes.redirect import redis


key = 'codified_urls'
group = 'shortner-group'

try:
    redis.xgroup_create(key, group)
except:
    print('Group already exists!')

while True:
    try:
        results = redis.xreadgroup(group, key, {key: '>'}, None)

        if results != []:
            for result in results:
                try:
                    resp = result[1][0][1]
                    keyFromShortCode = resp['shortCode']
                    val = json.dumps(resp)
                    expire = int(resp["expiresIn"])
                    print(keyFromShortCode, val, expire)
                    print(type(keyFromShortCode), type(val), type(expire))
                    redis.set(keyFromShortCode, val, expire)
                except:
                    print('Error setting to cache')

    except Exception as e:
        print(str(e))
    time.sleep(1)
