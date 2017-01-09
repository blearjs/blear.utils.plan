/**
 * 任务计划
 * @author ydr.me
 * @created 2017-01-08 14:16
 */


'use strict';

var Plan = require('./plan');


function autoInstantiate(method) {
    return function () {
        var plan = new Plan();
        plan[method].apply(plan, arguments);
        return plan;
    };
}

exports.is = autoInstantiate('is');
exports.as = autoInstantiate('as');
exports.wait = autoInstantiate('wait');
exports.task = autoInstantiate('task');
exports.taskSync = autoInstantiate('taskSync');
exports.each = autoInstantiate('each');
exports.eachSync = autoInstantiate('eachSync');
