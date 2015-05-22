/* jshint node:true */

'use strict';

var clone = require('clone'),
    Promise = require('bluebird'),
    redis = require('redis');

function Cache(config) {
    config = config || {};

    var self = this;

    this.clock = config.clock || Date;
    this.redisClient = config.redisClient || (function() {
        var client = redis.createClient(config.port || 6379, config.host || 'localhost', config.options || {});
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
            if(err || response === null) {
                reject(err || Error('cache entry not found'));
            } else {
                resolve(JSON.parse(response));
            }
        });
    });
};

Cache.prototype.store = function(key, storageObj) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.redisClient.set(key, JSON.stringify(storageObj), resolve);
    });
};

module.exports = Cache;
