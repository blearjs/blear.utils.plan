/**
 * 文件描述
 * @author ydr.me
 * @create 2017-01-23 18:25
 * @update 2017-01-23 18:25
 */


'use strict';

var expect = require('chai-jasmine').expect;
var plan = require('../../src/index');

describe('promise 边界', function () {
    it('fn 不是函数', function (done) {
        var called = false;
        plan.taskPromise().try(function () {
            called = true;
        });
        setTimeout(function () {
            expect(called).toBeFalsy();
            done();
        }, 100);
    });
});


