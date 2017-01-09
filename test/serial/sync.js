/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 18:42
 */


'use strict';

var utils = require('../utils');
var plan = require('../../src/index');

var syncTaskify = utils.syncTaskify;

describe('同步', function () {

    it('.taskSync', function (done) {
        plan
            .taskSync(syncTaskify(false, 1))
            .serial()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('.taskSync + .repeat', function (done) {
        plan
            .taskSync(syncTaskify(false, 1))
            .taskSync(syncTaskify(false, 2))
            .repeat(3)
            .serial()
            .try(function (ret) {
                expect(ret).toBe(9);
                done();
            });
    });

    it('.taskSync + .wait', function (done) {
        plan
            .taskSync(syncTaskify(false, 1))
            .wait(10)
            .taskSync(syncTaskify(false, 2))
            .serial()
            .try(function (ret) {
                expect(ret).toBe(3);
                done();
            });
    });

    it('.taskSync 出错 1', function (done) {
        var times = 0;
        var fn = function () {
            times++;
        };
        plan
            .taskSync(syncTaskify(true, 1))
            .taskSync(syncTaskify(false, 2))
            .taskSync(syncTaskify(false, 3))
            .serial()
            .try(fn)
            .catch(function (err) {
                expect(err.message).toMatch(/is 1/);
                expect(times).toBe(0);
                done();
            });
    });

    it('.taskSync 出错 2', function (done) {
        var times = 0;
        var fn = function () {
            times++;
        };
        plan
            .taskSync(syncTaskify(false, 1))
            .taskSync(syncTaskify(true, 2))
            .taskSync(syncTaskify(true, 3))
            .serial()
            .try(fn)
            .catch(function (err) {
                expect(err.message).toMatch(/is 2/);
                expect(times).toBe(0);
                done();
            });
    });

    it('.eachSync', function (done) {
        plan
            .eachSync([1, 2, 3], function (index, item, prevRet) {
                return item + (prevRet || 0);
            })
            .serial()
            .try(function (ret) {
                expect(ret).toBe(6);
                done();
            });
    });
});

