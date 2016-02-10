/* jshint node:true */

'use strict';

var Promise = require('bluebird'),
    redis = require('redis');

function Cache(config) {
    config = config || {};
    config.ttl = config.ttl || 60 * 60 * 24;

    var self = this;

    this.config = config;
    this.redisClient = config.redisClient || (function() {
        var client = redis.createClient(config.port || 6379, config.host || '127.0.0.1', config.options || {});
        if(config.auth) {
            client.auth(config.auth);
        }
        return client;
    }());

    this.redisClient.on('error', function() {
        // prevent redis client error from crashing whole app
    });
}

Cache.prototype.retrieve = function(key) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.redisClient.get(key, function(err, response) {
            if(err) return reject(err);
            resolve(response ? JSON.parse(response) : undefined);
        });
    });
};

Cache.prototype.store = function(key, storageObj) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.redisClient.set(key, JSON.stringify(storageObj), function(err) {
            if(err) return reject(err);
            if (self.config.ttl == Infinity)
              return resolve();

            self.redisClient.expire(key, self.config.ttl, function(err) {
              if (err) return reject(err);
              resolve();
            });
        });
    });
};

module.exports = Cache;
