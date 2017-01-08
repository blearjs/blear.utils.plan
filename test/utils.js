/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 18:43
 */


'use strict';

var random = require('blear.utils.random');


/**
 * 生成一个异步任务
 * @param errType {Number} 错误类型，1=随机，2=无错误，2=有错误
 * @param ret {Number}
 * @returns {Function}
 */
exports.asyncTask = function (errType, ret) {
    var timeout = random.number(10, 1000);
    ret = ret || random.number(1, 100);
    var err = null;

    switch (errType) {
        case 1:
            err = Math.random() > 0.5 ? new Error(ret) : null;
            break;

        case 2:
            err = null;
            break;

        case 3:
            err = new Error(ret);
            break;
    }

    return function (next, lastRet) {
        setTimeout(function () {
            if (err) {
                return next(err);
            }

            next(err, lastRet + ret);
        }, timeout);
    };
};


/**
 * 生成一个同步任务
 * @param errType {Number} 错误类型，1=随机，2=无错误，2=有错误
 * @param ret {Number}
 * @returns {Function}
 */
exports.syncTask = function (errType, ret) {
    var err = null;

    switch (errType) {
        case 1:
            err = Math.random() > 0.5 ? new Error(ret) : null;
            break;

        case 2:
            err = null;
            break;

        case 3:
            err = new Error(ret);
            break;
    }

    return function (lastRet) {
        var length = random.number(1000, 100000);

        while (length) {
            new Date();
        }

        if(err) {
            throw err;
        }

        return ret + lastRet;
    };
};
