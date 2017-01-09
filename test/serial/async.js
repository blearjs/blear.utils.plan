/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 19:36
 */


'use strict';

var utils = require('../utils');
var plan = require('../../src/index');

var asyncTaskify = utils.asyncTaskify;

describe('同步', function () {


    it('.task', function (done) {
        plan
            .task(asyncTaskify(false, 1))
            .task(asyncTaskify(false, 2))
            .task(asyncTaskify(false, 3))
            .task(asyncTaskify(false, 4))
            .serial()
            .try(function (ret) {
                expect(ret).toBe(10);
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
            .serial()
            .try(function (ret) {
                expect(ret).toBe(10);
                done();
            });
    });

    it('.task + .repeat', function (done) {
        plan
            .task(asyncTaskify(false, 1))
            .task(asyncTaskify(false, 2))
            .repeat(3)
            .serial()
            .try(function (ret) {
                expect(ret).toBe(9);
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
            .serial()
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
                expect(err.message).toMatch(/is 2/);
                expect(times).toBe(0);
                done();
            });
    });

    it('.each', function (done) {
        plan
            .each([1, 2, 3], function (index, item, next, prevRet) {
                next(null, item + (prevRet || 0));
            })
            .serial()
            .try(function (ret) {
                expect(ret).toBe(6);
                done();
            });
    });

});
