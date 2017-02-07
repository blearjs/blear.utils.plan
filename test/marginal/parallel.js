/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 12:53
 */


'use strict';

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

    it('重复计划 DEBUG=true', function (done) {
        expect(
            function () {
                plan
                    .taskSync('a', function () {
                        return 1;
                    })
                    .parallel()
                    .parallel();
            }
        ).toThrowError();
        plan.wait(10).serial(done);
    });

    it('重复计划 DEBUG=false', function (done) {
        var ret1;
        var ret2;
        window.DEBUG = false;
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
                expect(ret2).toBe(1);
                window.DEBUG = true;
            })
            .serial(done);
    });

    it('任务重复完成 DEBUG=true', function (done) {
        plan
            .task('a', function (next) {
                setTimeout(function () {
                    next(null, 1);
                }, 1);
                setTimeout(function () {
                    next(null, 2);
                }, 2);
            })
            .parallel();

        window.onerror = function (msg) {
            expect(msg).toMatch(/a/);
            window.onerror = null;
            done();
        };
    });

    it('任务重复完成 DEBUG=false', function (done) {
        window.DEBUG = false;

        var ret1;

        plan
            .task('a', function (next) {
                setTimeout(function () {
                    next(null, 1);
                }, 1);
                setTimeout(function () {
                    next(null, 2);
                }, 2);
            })
            .parallel(function (err, _ret) {
                ret1 = _ret;
            });

        plan
            .wait(100)
            .taskSync(function () {
                expect(ret1).toBe(1);
                window.DEBUG = true;
            })
            .serial(done);
    });

    it('任务开始之后插任务 DEBUG=false', function (done) {
        window.DEBUG = false;
        plan.taskSync(function () {
            return 1;
        }).parallel(function (err, ret) {
            expect(ret).toBe(1);
            window.DEBUG = true;
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

    it('非函数任务 DEBUG=true', function () {
        expect(function () {
            plan.task().parallel();
        }).toThrowError();
        expect(function () {
            plan.taskSync().parallel();
        }).toThrowError();
    });

    it('非函数任务 DEBUG=false', function (done) {
        window.DEBUG = false;
        var called = false;
        plan.task().parallel(function () {
            called = true;
        });
        plan.wait(10).taskSync(function () {
            window.DEBUG = true;
            expect(called).toBeFalsy();
        }).serial(done);
    });

    it('each 非函数', function (done) {
        var called = false;
        plan.each().parallel(function () {
            called = true;
        });
        plan.wait(10).serial(function () {
            expect(called).toBeFalsy();
            done();
        });
    });

    it('eachSync 非函数', function (done) {
        var called = false;
        plan.eachSync().parallel(function () {
            called = true;
        });
        plan.wait(10).serial(function () {
            expect(called).toBeFalsy();
            done();
        });
    });

});

