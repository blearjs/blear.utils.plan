/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 13:24
 */


'use strict';

var plan = require('../../src/index');

it('并行基本', function (done) {
    plan
        // 异步任务
        .task(function (next) {
            setTimeout(function () {
                next(null, 1);
            }, 10);
        })
        // 同步任务
        .taskSync(function () {
            return 2;
        })
        // 并行
        .parallel()
        .try(function (ret1, ret2) {
            expect(ret1).toBe(1);
            expect(ret2).toBe(2);
            done();
        });
});

