/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 19:36
 */


'use strict';

var expect = require('chai-jasmine').expect;
var utils = require('../utils');
var plan = require('../../src/index');
var Promise = require('../utils').Promise;

var asyncTaskify = utils.asyncTaskify;

describe('异步', function () {

    it('快的成功: callback', function (done) {
        plan
            .task(function (next) {
                setTimeout(function () {
                    next(null, 1);
                }, 500);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 100);
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('快的失败: callback', function (done) {
        plan
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('1'));
                }, 500);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('2'));
                }, 100);
            })
            .race()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

    it('快的成功: promise', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 500, 1);
                });
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 100, 2);
                });
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('快的失败: promise', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 500, new Error('1'));
                });
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 100, new Error('2'));
                });
            })
            .race()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

    it('快的成功: promise 与 callback', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 500, 1);
                });
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 100);
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

});
