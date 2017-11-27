/**
 * 文件描述
 * @author ydr.me
 * @create 2017-01-15 23:00
 * @update 2017-01-15 23:00
 */


'use strict';

var expect = require('chai-jasmine').expect;
var plan = require('../../src/index');
var Promise = require('../utils').Promise;

describe('所有', function () {

    it('同步最快: 成功', function (done) {
        plan
            .taskSync(function () {
                return 1;
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 10);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('同步最快: 失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 10);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('异步比时间: 成功', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 10);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 3);
                }, 20);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('异步比时间: 成功2', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('2'));
                }, 10);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 3);
                }, 20);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(3);
                done();
            });
    });

    it('异步比时间: promise 成功', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(2);
                    }, 10);
                });
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 3);
                }, 20);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('异步比时间: promise 失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        reject(new Error('2'));
                    }, 10);
                });
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 3);
                }, 20);
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(3);
                done();
            });
    });

    it('异步比时间: 失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('2'));
                }, 10);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('3'));
                }, 20);
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('3');
                done();
            });
    });

});
