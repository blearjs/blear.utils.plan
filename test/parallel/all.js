/**
 * 文件描述
 * @author ydr.me
 * @create 2017-01-15 23:00
 * @update 2017-01-15 23:00
 */


'use strict';

var plan = require('../../src/index');

it('所有', function (done) {
    plan
    // 异步任务
        .task(function (next) {
            setTimeout(function () {
                // 第 1 个结果：1
                next(null, 1);
            });
        })
        // 同步任务
        .taskSync(function () {
            // 第 2 个结果：2
            return 2;
        })
        // 循环异步
        .each([1, 2], function (index, val, next) {
            setTimeout(function () {
                // 第 3 个结果：1
                // 第 4 个结果：2
                next(null, val);
            });
        })
        // 循环同步
        .eachSync([3, 4], function (index, val) {
            // 第 5 个结果：3
            // 第 6 个结果：4
            return val;
        })
        .parallel()
        .try(function (ret1, ret2, ret3, ret4, ret5, ret6) {
            expect(ret1).toBe(1);
            expect(ret2).toBe(2);
            expect(ret3).toBe(1);
            expect(ret4).toBe(2);
            expect(ret5).toBe(3);
            expect(ret6).toBe(4);
            done();
        });
});

