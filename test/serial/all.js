/**
 * 文件描述
 * @author ydr.me
 * @create 2017-01-15 22:54
 * @update 2017-01-15 22:54
 */


'use strict';

var plan = require('../../src/index');

it('所有', function (done) {
    plan
    // 异步任务
        .task(function(next) {
            setTimeout(function() {
                next(null, 1);
            });
        })
        // 同步任务
        .taskSync(function(one) {
            // 1 + 2 = 3
            return one + 2;
        })
        // 循环异步
        .each([1, 2], function(index, val, next, prev) {
            setTimeout(function() {
                // 第 1 次：3 + 1
                // 第 2 次：4 + 2
                next(null, prev + val);
            });
        })
        // 循环同步
        .eachSync([3, 4], function(index, val, prev) {
            // 第 1 次：6 + 3
            // 第 2 次：9 + 4
            return prev + val;
        })
        .serial()
        .try(function (ret) {
            // ret === 13
            expect(ret).toBe(13);
            done();
        });
});


