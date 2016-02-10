[![Build Status](https://travis-ci.org/Schibsted-Tech-Polska/good-guy-cache-redis.svg?branch=master)](https://travis-ci.org/Schibsted-Tech-Polska/good-guy-cache-redis)
[![Coverage Status](https://coveralls.io/repos/Schibsted-Tech-Polska/good-guy-cache-redis/badge.svg)](https://coveralls.io/r/Schibsted-Tech-Polska/good-guy-cache-redis)

Redis cache implementation for [Good Guy HTTP](https://github.com/Schibsted-Tech-Polska/good-guy-http).

# Usage

```
var RedisCache = require('good-guy-cache-redis');

var cache = new RedisCache({
    host: 'redis.host', port: 1234, options: { ...native RedisClient options...},

    auth: ...      // if set, will be sent with a Redis AUTH command right after connecting
    ttl: 60 * 30,  // time-to-live for cached values, in seconds
                   // (set to Infinity if they should never expire)
                   // (default is 24h)
```

