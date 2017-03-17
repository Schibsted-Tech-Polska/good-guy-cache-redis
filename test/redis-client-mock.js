/* jshint node:true */

'use strict';

var EventEmitter = require('events').EventEmitter;

function RedisClientMock() {
    EventEmitter.call(this);

    this.storage = {};
}

RedisClientMock.prototype = Object.create(EventEmitter.prototype, {
    constructor: {
        value: RedisClientMock
    }
});

RedisClientMock.prototype.set = function(key, value, callback) {
    this.storage[key] = {value: value};
    return callback();
};

RedisClientMock.prototype.get = function(key, callback) {
    if(this.storage[key]) {
        return callback(null, this.storage[key].value);
    }
    return callback(null, null);
};

RedisClientMock.prototype.del = function(key, callback) {
    delete this.storage[key];
    return callback(null, null);
};

RedisClientMock.prototype.expire = function(key, time, callback) {
  if(this.storage[key]) {
    this.storage[key].ttl = time;
    return callback(null, 1);
  }
  return callback(null, 0);
};

RedisClientMock.prototype._ttlFor = function(key) {
  if (!this.storage[key])
    throw new Error("Key '" + key + "' does not exist.");
  return this.storage[key].ttl;
};

module.exports = RedisClientMock;
