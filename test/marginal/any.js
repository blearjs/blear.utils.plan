/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 12:53
 */


'use strict';

var expect = require('chai-jasmine').expect;
var plan = require('../../src/index');

describe('尽快', function () {

    it('空任务', function (done) {
        var called = false;
        plan.each().any(function () {
            called = true;
        });
        plan.wait(10).serial(function () {
            expect(called).toBeTruthy();
            done();
        });
    });

});

