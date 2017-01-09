/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 19:36
 */


'use strict';

var utils = require('../utils');
var plan = require('../../src/index');

var asyncTaskify = utils.asyncTaskify;

describe('异步', function () {

    it('.task', function (done) {
        plan
            .task(asyncTaskify(false, 1))
            .task(asyncTaskify(false, 2))
            .task(asyncTaskify(false, 3))
            .task(asyncTaskify(false, 4))
            .parallel()
            .try(function (ret1, ret2, ret3, ret4) {
                expect(ret1).toBe(1);
                expect(ret2).toBe(2);
                expect(ret3).toBe(3);
                expect(ret4).toBe(4);
                done();
            });
    });

    it('.task + .wait', function (done) {
        plan
            .task(asyncTaskify(false, 1))
            .task(asyncTaskify(false, 2))
            .wait(2)
            .task(asyncTaskify(false, 3))
            .task(asyncTaskify(false, 4))
            .parallel()
            .try(function (ret1, ret2, ret3, ret4) {
                expect(ret1).toBe(1);
                expect(ret2).toBe(2);
                expect(ret3).toBe(3);
                expect(ret4).toBe(4);
                done();
            });
    });

    it('.task + .repeat', function (done) {
        plan
            .task(asyncTaskify(false, 1))
            .task(asyncTaskify(false, 2))
            .repeat(3)
            .parallel()
            .try(function (ret1, ret2, ret3, ret4, ret5) {
                expect(ret1).toBe(1);
                expect(ret2).toBe(2);
                expect(ret3).toBe(2);
                expect(ret4).toBe(2);
                expect(ret5).toBe(2);
                done();
            });
    });

    it('.task 出错 1', function (done) {
        var times = 0;
        var fn = function () {
            times++;
        };
        plan
            .task(asyncTaskify(true, 1))
            .task(asyncTaskify(false, 2))
            .task(asyncTaskify(false, 2))
            .parallel()
            .try(fn)
            .catch(function (err) {
                expect(err.message).toMatch(/is 1/);
                expect(times).toBe(0);
                done();
            });
    });

    it('.task 出错 2', function (done) {
        var times = 0;
        var fn = function () {
            times++;
        };
        plan
            .task(asyncTaskify(false, 1))
            .task(asyncTaskify(true, 2))
            .task(asyncTaskify(true, 3))
            .serial()
            .try(fn)
            .catch(function (err) {
                expect(err.message).toMatch(/is [23]/);
                expect(times).toBe(0);
                done();
            });
    });

    it('.each', function (done) {
        plan
            .task(function (next) {
                next(null, 0);
            })
            .each([1, 2, 3], function (index, item, next) {
                next(null, item);
            })
            .task(function (next) {
                next(null, 4);
            })
            .parallel()
            .try(function (ret0, ret1, ret2, ret3, ret4) {
                expect(ret0).toBe(0);
                expect(ret1).toBe(1);
                expect(ret2).toBe(2);
                expect(ret3).toBe(3);
                expect(ret4).toBe(4);
                done();
            });
    });

});
