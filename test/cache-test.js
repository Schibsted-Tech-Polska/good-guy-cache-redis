/* jshint node:true */
/* global describe, it, expect */

'use strict';

var assert = require('assert'),
    url = require('url'),
    events = require('events'),
    RedisClientMock = require('./redis-client-mock'),
    Cache = require('../lib/cache');

describe('Cache', function () {

    it('should be able to store and retrieve value', function (done) {

        // given
        var redisClient = new RedisClientMock();
        var cache = new Cache({
            redisClient: redisClient
        });

        redisClient.storage = {};
        redisClient.set = function(key, value, cb) {
            this.storage[key] = value;
            cb();
        };
        redisClient.get = function(key, cb) {
            return cb(null, this.storage[key]);
        };

        // when
        cache.store('key', {
            value: true
        })

        // then
        .then(function() {
            return cache.retrieve('key');
        })
        .then(function(cached) {
            assert.deepEqual(cached, {
                value: true
            });
            done();
        })
        .catch(done);

    });

    it('should reject a promise when client returned an error', function (done) {
        
        // given
        var redisClient = new RedisClientMock();
        redisClient.get = function(key, cb) {
            return cb(new Error('something went wrong'));
        };
        var cache = new Cache({
            redisClient: redisClient
        });

        // when
        cache.retrieve('key')

        // then
        .then(function() {
            done(new Error('promise resolved despite redis client error'));
        })
        .catch(function(err) {
            assert.equal(err.message, 'something went wrong');
            done();
        });

    });

    it('should reject a promise when no entry was found', function (done) {
        
        // given
        var cache = new Cache({
            redisClient: new RedisClientMock()
        });

        // when
        cache.retrieve('nonexistent')

        // then
        .then(function() {
            done(new Error('promise resolved for nonexistent key'));
        })
        .catch(function(err) {
            assert.equal(err.message, 'cache entry not found');
            done();
        });

    });

    it('should prevent redis client from crashing whole app upon error', function (done) {
        
        // given
        var redisClient = new RedisClientMock();
        var cache = new Cache({
            redisClient: redisClient
        });

        // when
        redisClient.emit('error');

        // then
        assert.ok(true);
        done();
    });

    it('should create redis client with default options if it wasn\'t passed directly', function () {

        // given
        var cache = new Cache();

        // then
        assert.equal(typeof cache.redisClient, 'object');
        assert.equal(cache.redisClient.address, '127.0.0.1:6379');
    });

    it('should create redis client with custom options if they were specified', function () {

        // given
        var cache = new Cache({
            host: '0.0.0.0',
            port: '6969'
        });

        // then
        assert.equal(typeof cache.redisClient, 'object');
        assert.equal(cache.redisClient.address, '0.0.0.0:6969');
    });

});
