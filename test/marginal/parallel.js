/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 12:53
 */


'use strict';

var expect = require('chai-jasmine').expect;
var plan = require('../../src/index');

describe('并行', function () {

    it('同步任务返回 undefined', function (done) {
        plan
            .taskSync(function () {
                return 1;
            })
            .taskSync(function () {
                console.log('空的同步任务');
            })
            .parallel(done)
            .try(function (ret1, ret2) {
                expect(ret1).toBe(1);
                expect(ret2).toBe(undefined);
            });
    });

    it('异步任务返回 undefined', function (done) {
        plan
            .task(function (next) {
                setTimeout(function () {
                    next(null, 1);
                }, 10);
            })
            .task(function (next) {
                setTimeout(function () {
                    next();
                }, 10);
            })
            .parallel(done)
            .try(function (ret1, ret2) {
                expect(ret1).toBe(1);
                expect(ret2).toBe(undefined);
            });
    });

    it('重复计划', function (done) {
        var ret1;
        var ret2;

        plan
            .taskSync(function () {
                return 1;
            })
            .parallel(function (err, _ret) {
                ret1 = _ret
            })
            .parallel(function (err, _ret) {
                ret2 = _ret
            });

        plan
            .wait(10)
            .taskSync(function () {
                expect(ret1).toBe(1);
                expect(ret2).toBe(undefined);
            })
            .serial(done);
    });

    it('任务重复完成', function (done) {
        var ret1;

        plan
            .task('a', function (next) {
                setTimeout(function () {
                    next(null, 1);
                }, 10);
                setTimeout(function () {
                    next(null, 2);
                }, 20);
            })
            .parallel(function (err, _ret) {
                ret1 = _ret;
            });

        plan.wait(50).serial(function () {
            expect(ret1).toBe(1);
            done();
        });
    });

    it('任务开始之后插任务', function (done) {
        plan.taskSync(function () {
            return 1;
        }).parallel(function (err, ret) {
            expect(ret).toBe(1);
            done();
        }).wait(10);
    });

    it('连续出错', function (done) {
        var errStack = [];

        plan
            .task(function (next) {
                setTimeout(function () {
                    next(new Error(1));
                });
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error(2));
                });
            })
            .task(function (next) {
                setTimeout(function () {
                    next(new Error(3));
                });
            })
            .parallel(function (err) {
                errStack.push(err);
            });

        plan.wait(10).serial(function () {
            expect(errStack.length).toBe(1);

            done();
        });
    });

    it('非函数任务', function (done) {
        var called = false;
        plan.task().parallel(function () {
            called = true;
        });
        plan.wait(10).taskSync(function () {
            expect(called).toBeTruthy();
        }).serial(done);
    });

    it('each 非函数', function (done) {
        var called = false;
        plan.each().parallel(function () {
            called = true;
        });
        plan.wait(10).serial(function () {
            expect(called).toBeTruthy();
            done();
        });
    });

    it('eachSync 非函数', function (done) {
        var called = false;
        plan.eachSync().parallel(function () {
            called = true;
        });
        plan.wait(10).serial(function () {
            expect(called).toBeTruthy();
            done();
        });
    });

});

