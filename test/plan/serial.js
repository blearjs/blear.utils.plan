/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 13:24
 */


'use strict';

var plan = require('../../src/index');

it('串行基本', function (done) {
    plan
        .task(function (next) {
            setTimeout(function () {
                next(null, 1);
            }, 10);
        })
        .taskSync(function (ret) {
            // 1 + 2
            return ret + 2;
        })
        .serial()
        .try(function (ret) {
            expect(ret).toBe(3);
            done();
        });
});

