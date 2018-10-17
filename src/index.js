/**
 * 任务计划
 * @author ydr.me
 * @created 2017-01-08 14:16
 */


'use strict';

var access = require('blear.utils.access');

var Plan = require('./plan');


function autoInstantiate(method) {
    return function () {
        var plan = new Plan();
        plan[method].apply(plan, arguments);
        return plan;
    };
}

/**
 * @type Function
 * @param name
 */
exports.is = autoInstantiate('is');

/**
 * @type Function
 * @param context
 */
exports.as = autoInstantiate('as');

/**
 * @type Function
 */
exports.wait = autoInstantiate('wait');

/**
 * @type Function
 * @param [name]
 * @param fn
 */
exports.task = autoInstantiate('task');

/**
 * @type Function
 * @param [name]
 * @param fn
 */
exports.taskSync = autoInstantiate('taskSync');

/**
 * @type Function
 * @param [name]
 * @param fn
 */
exports.taskPromise = autoInstantiate('taskPromise');

/**
 * @type Function
 * @param list
 * @param fn
 */
exports.each = autoInstantiate('each');

/**
 * @type Function
 * @param list
 * @param fn
 */
exports.eachSync = autoInstantiate('eachSync');

/**
 * @type Function
 * @param list
 * @param fn
 */
exports.eachPromise = autoInstantiate('eachPromise');


/**
 * 将 callback 转换为 task
 * @param task {Function} callback 函数
 * @returns {function(*=): *}
 */
exports.taskify = function (task/*arguments*/) {
    var args = access.args(arguments).slice(1);
    return function (next) {
        args.push(next);
        return task.apply(null, args);
    };
};
