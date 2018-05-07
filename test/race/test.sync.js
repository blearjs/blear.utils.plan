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

    it('先成功', function (done) {
        plan
            .taskSync(function () {
                return 1;
            })
            .taskSync(function () {
                return 2;
            })
            .race()
            .try(function (ret) {
                expect(ret).toBe(1);
                done();
            });
    });

    it('先失败', function (done) {
        plan
            .taskSync(function () {
                throw new Error('1');
            })
            .taskSync(function () {
                return 2;
            })
            .race()
            .catch(function (err) {
                expect(err.message).toBe('1');
                done();
            });
    });

});

