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

    it('promise: 成功', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 10, 1);
                });
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('promise: 失败', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 10, new Error('1'));
                });
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('1');
                done();
            });
    });

    it('promisex2: 前成功', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 10, 1);
                });
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 10, 2);
                });
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('promisex2: 前失败', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 10, new Error('1'));
                });
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 10, 2);
                });
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('promisex2: 都失败', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 10, new Error('1'));
                });
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 10, new Error('2'));
                });
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

    it('callback: 成功', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, null, 1);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('callback: 失败', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, new Error('1'), 1);
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('1');
                done();
            });
    });

    it('callback + promise: 前成功', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, null, 1);
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 10, 2);
                });
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('callback + promise: 前失败', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, new Error('1'));
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 10, 2);
                });
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('callback + promise: 都失败', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, new Error('1'));
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, 10, new Error('2'));
                });
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

    it('callback + callback: 前成功', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, null, 1);
            })
            .task(function (next) {
                setTimeout(next, 10, null, 2);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('callback + callback: 前失败', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, new Error('1'));
            })
            .task(function (next) {
                setTimeout(next, 10, null, 2);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('callback + callback: 都失败', function (done) {
        plan
            .task(function (next) {
                setTimeout(next, 10, new Error('1'));
            })
            .task(function (next) {
                setTimeout(next, 10, new Error('2'));
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

});
