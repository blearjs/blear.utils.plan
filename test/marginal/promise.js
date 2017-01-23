/**
 * 文件描述
 * @author ydr.me
 * @create 2017-01-23 18:25
 * @update 2017-01-23 18:25
 */


'use strict';

var plan = require('../../src/index');

describe('promise 边界', function () {
    it('fn 不是函数', function () {
        window.DEBUG = true;
        expect(function () {
            plan.taskPromise();
        }).toThrowError();
    });
});


