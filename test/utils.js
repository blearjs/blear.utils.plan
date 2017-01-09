/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-08 18:43
 */


'use strict';

var random = require('blear.utils.random');
var time = require('blear.utils.time');


/**
 * 生成一个异步任务
 * @param isError {Boolean} 是否出错
 * @param ret {Number}
 * @returns {Function}
 */
exports.asyncTaskify = function (isError, ret) {
    var err = null;

    if (isError) {
        err = new Error(
            'error is ' + ret
        );
    }

    return function (next, lastRet) {
        var timeout = random.number(1, 100);
        setTimeout(function () {
            if (err) {
                return next(err);
            }

            next(err, ret + (lastRet || 0));
        }, timeout);
    };
};


/**
 * 生成一个同步任务
 * @param isError {Boolean} 是否出错
 * @param ret {Number}
 * @returns {Function}
 */
exports.syncTaskify = function (isError, ret) {
    var err = null;

    if (isError) {
        err = new Error(
            'error is ' + ret
        );
    }

    return function (lastRet) {
        var timeout = random.number(1, 100);
        var startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            new Date();
        }

        if (err) {
            throw err;
        }

        return ret + (lastRet || 0);
    };
};
