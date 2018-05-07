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

    it('同步 + 异步：先成功', function (done) {
        plan
            .taskSync(function () {
                return 1;
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 100);
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            })
    });

    it('同步 + 异步：先失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 2);
                }, 100);
            })
            .race()
            .catch(function (err) {
                expect(err.message).toBe('1');
                done();
            })
    });

    it('异步 + 同步 + 异步：先失败', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 500, 1);
                });
            })
            .taskSync(function () {
                throw new Error('2');
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 3);
                }, 100);
            })
            .race()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            })
    });

    it('异步 + 同步 + 异步：先成功', function (done) {
        plan
            .taskPromise(function () {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, 500, 1);
                });
            })
            .taskSync(function () {
                return 2;
            })
            .task(function (next) {
                setTimeout(function () {
                    next(null, 3);
                }, 100);
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            })
    });

});
