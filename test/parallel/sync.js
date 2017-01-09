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
            .parallel()
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

    it('.taskSync + .wait', function (done) {
        plan
            .taskSync(syncTaskify(false, 1))
            .wait(10)
            .taskSync(syncTaskify(false, 2))
            .parallel()
            .try(function (ret1, ret2) {
                expect(ret1).toBe(1);
                expect(ret2).toBe(2);
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
            .parallel()
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
            .parallel()
            .try(fn)
            .catch(function (err) {
                expect(err.message).toMatch(/is [23]/);
                expect(times).toBe(0);
                done();
            });
    });

    it('.eachSync', function (done) {
        plan
            .taskSync(function () {
                return 0;
            })
            .eachSync([1, 2, 3], function (index, item) {
                return item;
            })
            .taskSync(function () {
                return 4;
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

