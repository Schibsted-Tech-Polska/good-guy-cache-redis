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
    this.storage[key] = value;
    return callback();
};

RedisClientMock.prototype.get = function(key, callback) {
    if(this.storage[key]) {
        return callback(null, this.storage[key]);
    }
    return callback(null, null);
};

module.exports = RedisClientMock;
