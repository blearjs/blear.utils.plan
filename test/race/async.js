/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 19:36
 */


'use strict';

var expect = require('chai-jasmine').expect;
var utils = require('../utils');
var plan = require('../../src/index');

var asyncTaskify = utils.asyncTaskify;

describe('异步', function () {

    it('快的成功', function (done) {
        plan
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('1'));
                }, 500);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 100);
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('快的失败', function (done) {
        plan
            .task(function (next) {
                setTimeout(function () {
                    next(null, 1);
                }, 500);
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error('2'));
                }, 100);
            })
            .race()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

});
