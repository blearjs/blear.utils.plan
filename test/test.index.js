/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var plan = require('../src/index');

describe('blear.utils.plan', function () {

    it('.taskify', function (done) {
        var async = function (a, b, callback) {
            callback(null, a + b);
        };

        plan.taskify(async, 1, 2)(function (err, ret) {
            expect(err).toEqual(null);
            expect(ret).toEqual(3);
            done();
        });
    });

});
