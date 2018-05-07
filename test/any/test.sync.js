/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 18:42
 */


'use strict';

var expect = require('chai-jasmine').expect;
var utils = require('../utils');
var plan = require('../../src/index');

var syncTaskify = utils.syncTaskify;

describe('同步', function () {

    it('sync: 成功', function (done) {
        plan
            .taskSync(function () {
                return 1;
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('sync: 失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('1');
                done();
            });
    });

    it('sync + sync: 前成功', function (done) {
        plan
            .taskSync(function () {
                return 1;
            })
            .taskSync(function () {
                throw new Error('2');
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('sync + sync: 前失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .taskSync(function () {
                return 2;
            })
            .any()
            .try(function (ret) {
                expect(ret).toBe(2);
                done();
            });
    });

    it('sync + sync: 都失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .taskSync(function () {
                throw new Error('2');
            })
            .any()
            .catch(function (err) {
                expect(err.message).toBe('2');
                done();
            });
    });

});

