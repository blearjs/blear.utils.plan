/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var howdo = require('../src/index.js');

describe('index.js', function () {
    var asyncFollow = function (id, ret) {
        return function () {
            var callback = arguments[0];
            var lastRet = arguments[1] || 0;
            setTimeout(function () {
                callback(null, ret + lastRet);
            }, Math.random() * 30);
        };
    };
    var asyncTogether = function (id, ret) {
        return function () {
            var callback = arguments[0];
            setTimeout(function () {
                callback(null, ret);
            }, Math.random() * 30);
        };
    };

    it('.follow', function (done) {
        howdo
            .task(asyncFollow(1, 1))
            .task(asyncFollow(2, 2))
            .task(asyncFollow(3, 3))
            .follow(function (err, ret) {
                expect(err).toEqual(null);
                expect(ret).toEqual(1 + 2 + 3);
                expect(arguments.length).toEqual(2);

                done();
            })
            .done(function (ret) {
                expect(ret).toEqual(1 + 2 + 3);
                expect(arguments.length).toEqual(1);
            })
            .fail(function (err) {
                expect(err).toEqual(null);
            });
    });

    it('.together', function (done) {
        howdo
            .task(asyncTogether(1, 1))
            .task(asyncTogether(2, 2))
            .task(asyncTogether(3, 3))
            .together(function (err, ret1, ret2, ret3) {
                expect(err).toEqual(null);
                expect(ret1).toEqual(1);
                expect(ret2).toEqual(2);
                expect(ret3).toEqual(3);
                expect(arguments.length).toEqual(4);

                done();
            })
            .done(function (ret1, ret2, ret3) {
                expect(ret1).toEqual(1);
                expect(ret2).toEqual(2);
                expect(ret3).toEqual(3);
                expect(arguments.length).toEqual(3);
            })
            .fail(function (err) {
                expect(err).toEqual(null);
            })
    });

    it('.each:array.follow', function (done) {
        howdo
            .each([1, 2, 3], function (index, val, next) {
                asyncFollow(index, val)(next);
            })
            .follow(function (err, ret) {
                expect(err).toEqual(null);
                expect(ret).toEqual(3);
                expect(arguments.length).toEqual(2);

                done();
            });
    });

    it('.each:object.follow', function (done) {
        howdo
            .each({
                a: 1,
                b: 2,
                c: 3
            }, function (index, val, next) {
                asyncFollow(index, val)(next);
            })
            .follow(function (err, ret) {
                expect(err).toEqual(null);
                expect(ret).toEqual(3);
                expect(arguments.length).toEqual(2);

                done();
            });
    });

    it('.each:array.together', function (done) {
        howdo
            .each([1, 2, 3], function (index, val, next) {
                asyncFollow(index, val)(next);
            })
            .together(function (err, ret1, ret2, ret3) {
                expect(err).toEqual(null);
                expect(ret1).toEqual(1);
                expect(ret2).toEqual(2);
                expect(ret3).toEqual(3);
                expect(arguments.length).toEqual(4);

                done();
            });
    });

    it('.each:object.follow', function (done) {
        howdo
            .each({
                a: 1,
                b: 2,
                c: 3
            }, function (index, val, next) {
                asyncFollow(index, val)(next);
            })
            .together(function (err, ret1, ret2, ret3) {
                expect(err).toEqual(null);
                expect(ret1).toEqual(1);
                expect(ret2).toEqual(2);
                expect(ret3).toEqual(3);
                expect(arguments.length).toEqual(4);

                done();
            });
    });

    it('howdo task must be a function', function () {
        var called = false;

        try {
            howdo.task(1);
        } catch (err) {
            called = true;
        }

        expect(called).toEqual(true);
    });

    it('follow twice', function (done) {
        var called = false;
        try {
            howdo.task(function (next) {
                next();
            }).follow().follow();
        } catch (err) {
            called = true;
        }

        setTimeout(function () {
            expect(called).toEqual(false);
            done();
        }, 100);
    });


    it('together twice', function (done) {
        var called = false;
        try {
            howdo.task(function (next) {
                next();
            }).together().together();
        } catch (err) {
            called = true;
        }

        setTimeout(function () {
            expect(called).toEqual(false);
            done();
        }, 100);
    });

    it('follow error', function (done) {
        howdo.task(function (next) {
            next(1);
        }).follow(function (err) {
            expect(Boolean(err)).toEqual(true);
            done();
        }).fail(function (err) {
            expect(Boolean(err)).toEqual(true);
        });
    });

    it('together error', function (done) {
        howdo.task(function (next) {
            setTimeout(function () {
                next(1);
            }, 100);
        }).task(function (next) {
            setTimeout(function () {
                next(2);
            }, 200);
        }).together(function (err) {
            expect(Boolean(err)).toEqual(true);
            done();
        });
    });
});
