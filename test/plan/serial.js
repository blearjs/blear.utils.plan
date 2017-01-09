/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 13:24
 */


'use strict';

var plan = require('../../src/index');

it('串行基本', function (done) {
    plan
        // 异步任务
        .task(function (next) {
            setTimeout(function () {
                next(null, 1);
            }, 10);
        })
        // 同步任务
        .taskSync(function (ret) {
            // 1 + 2
            return ret + 2;
        })
        // 串行
        .serial()
        .try(function (ret) {
            expect(ret).toBe(3);
            done();
        });
});

