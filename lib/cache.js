/* jshint node:true */

'use strict';

var clone = require('clone'),
    Promise = require('bluebird'),
    redis = require('redis');

function Cache(config) {
    config = config || {};

    var self = this;

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
        var storageObj;
        self.redisClient.get(key, function(err, response) {
            if(err) return reject(err);
            resolve(response ? JSON.parse(response) : undefined);
        });
    });
};

Cache.prototype.store = function(key, storageObj) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.redisClient.set(key, JSON.stringify(storageObj), function(err, response) {
            if(err) return reject(err);
            resolve(response);
        });
    });
};

module.exports = Cache;
