/**
 * Plan
 * @author ydr.me
 * @created 2017-01-08 14:20
 */


'use strict';

var Events = require('blear.classes.events');
var typeis = require('blear.utils.typeis');
var access = require('blear.utils.access');
var time = require('blear.utils.time');
var collection = require('blear.utils.collection');
var random = require('blear.utils.random');
var object = require('blear.utils.object');

var Task = require('./task');

var context = null;
var nextTick = time.nextTick;
var isFunction = typeis.Function;
var each = collection.each;
var filter = collection.filter;
var accessArgs = access.args;
var now = Date.now;
// 任务状态：准备中
var STATE_READY = 0;
// 任务状态：已开始
var STATE_STARTED = 1;
// 任务状态：进行中
var STATE_PENDING = 2;
// 任务状态：已结束
var STATE_END = 3;
// 任务状态：已销毁
var STATE_DESTROYED = 4;
// 执行方式：未决定
var WAY_UNDETERMINED = 0;
// 执行方式：串行
var WAY_SERIAL = 1;
// 执行方式：并行
var WAY_PARALLEL = 2;
// 异步任务
var TASK_ASYNC = 1;
// 同步任务
var TASK_SYNC = 2;
// promise 任务
var TASK_PROMISE = 3;

var Plan = Events.extend({
    className: 'Plan',
    constructor: function () {
        var the = this;

        Plan.parent(the);
        the[_taskList] = [];
        the[_current] = the.length = the.startTime = the.endTime = 0;
        the[_state] = STATE_READY;
        the[_way] = WAY_UNDETERMINED;
        the[_allCallbackList] = [];
        the[_tryCallbackList] = [];
        the[_catchCallbackList] = [];
        the[_excludeMap] = {};
        the.name = new Date() + ' plan';
        the.context = context;
        the.error = null;
    },

    /**
     * 定义计划名称
     * @param name {String} 任务名称
     * @returns {Plan}
     */
    is: function (name) {
        var the = this;
        the.name = name;
        return the;
    },

    /**
     * 定义所有任务的上下文
     * @param context {*} 上下文
     * @returns {Plan}
     */
    as: function (context) {
        var the = this;
        the.context = context;
        return the;
    },

    /**
     * 计划异步任务
     * @param [name] {String} 异步任务名称，可选
     * @param fn {Function} 异步任务方法
     * @returns {Plan}
     */
    task: function (name, fn) {
        return this[_pushTask](TASK_ASYNC, name, fn);
    },

    /**
     * 计划同步任务
     * @param [name] {String} 同步任务名称，可选
     * @param fn {Function} 同步任务方法
     * @returns {Plan}
     */
    taskSync: function (name, fn) {
        return this[_pushTask](TASK_SYNC, name, fn);
    },

    /**
     * 计划一个许诺任务
     * @param [name]
     * @param fn
     * @returns {Plan}
     */
    taskPromise: function (name, fn) {
        var the = this;
        return the[_pushTask](TASK_PROMISE, name, fn);
    },

    /**
     * 重复上一个任务
     * @param times {Number} 重复次数
     * @returns {Plan}
     */
    repeat: function (times) {
        var the = this;
        var lastTask = the[_taskList][the.length - 1];

        times = times || 1;

        while (times--) {
            the[_taskList].push(lastTask.copy());
            the.length++;
        }

        return the;
    },

    /**
     * 循环异步任务
     * @param list
     * @param fn
     * @returns {Plan}
     */
    each: function (list, fn) {
        var the = this;

        collection.each(list, function (index, item) {
            the[_pushTask](TASK_ASYNC, function (next, prev) {
                fn(index, item, next, prev);
            });
        });

        return the;
    },

    /**
     * 循环异步任务
     * @param list
     * @param fn
     * @returns {Plan}
     */
    eachSync: function (list, fn) {
        var the = this;

        collection.each(list, function (index, item) {
            the[_pushTask](TASK_SYNC, function (prev) {
                return fn(index, item, prev);
            });
        });

        return the;
    },

    /**
     * 循环许诺任务
     * @param list
     * @param fn
     * @returns {Plan}
     */
    eachPromise: function (list, fn) {
        var the = this;

        collection.each(list, function (index, item) {
            the[_pushTask](TASK_PROMISE, function (prev) {
                return fn(index, item, prev);
            });
        });

        return the;
    },

    /**
     * 等待一段时间
     * @param timeout {Number} 等待时间，单位 ms
     * @returns {Plan}
     */
    wait: function (timeout) {
        var the = this;

        timeout = timeout || 1;
        the[_excludeMap][the[_taskList].length] = 1;

        return the[_pushTask](TASK_ASYNC, 'wait ' + timeout + 'ms', function (next/*...*/) {
            var args = accessArgs(arguments).slice(1);

            setTimeout(function () {
                args.unshift(null);
                next.apply(the.context, args);
            }, timeout);
        });
    },

    /**
     * 串行执行
     * @param [callback] {Function} 执行完回调
     * @returns {Plan}
     */
    serial: function (callback) {
        var the = this;

        if (!the.length) {
            return the;
        }

        if(isFunction(callback)) {
            the[_allCallbackList].push(callback);
        }

        if (the[_state] > STATE_READY) {

            if (typeof DEBUG !== 'undefined' && DEBUG) {
                throw new SyntaxError(
                    '计划已开始执行，无法重新开始'
                );
            }

            return the;
        }

        the[_state] = STATE_STARTED;
        nextTick(function () {
            the[_planStart]();

            var start = function (lastRet) {
                // 从计划列表中取出将要执行的计划
                var task = the[_taskStart](the[_current]);
                var done = false;
                var next = function (err, lastRet) {
                    if (done) {

                        if (typeof DEBUG !== 'undefined' && DEBUG) {
                            throw new SyntaxError(
                                '`' + task.name + '` 任务被重复完成，请检查。'
                            );
                        }

                        return;
                    }

                    done = true;
                    the[_current]++;

                    // 串行任务，其中一个出错即中断
                    if (err) {
                        the[_taskEnd](task, err);
                        the[_taskError](task, err);
                        return the[_planEnd](err);
                    }

                    the[_taskEnd](task, err, lastRet);
                    the[_taskSuccess](task, lastRet);

                    // 所有任务都执行完毕
                    if (the[_current] === the.length) {
                        the[_planEnd](err, lastRet);
                    } else {
                        start(lastRet);
                    }
                };

                task.will().call(the.context, next, lastRet);
                task.will = null;
            };

            start();
        });

        return the;
    },

    /**
     * 并行执行
     * @param [callback] {Function} 执行完回调
     * @returns {Plan}
     */
    parallel: function (callback) {
        var the = this;

        if (!the.length) {
            return the;
        }

        if(isFunction(callback)) {
            the[_allCallbackList].push(callback);
        }

        if (the[_state] > STATE_READY) {

            if (typeof DEBUG !== 'undefined' && DEBUG) {
                throw new SyntaxError(
                    '计划已开始执行，无法重新开始'
                );
            }

            return the;
        }

        the[_state] = STATE_STARTED;
        nextTick(function () {
            // 合并的结果
            var combinedRet = [];
            var successLength = 0;

            the[_planStart]();
            each(the[_taskList], function (index, task) {
                // 如果有任务已经出错
                if (the.error) {
                    return;
                }

                var done = false;
                task = the[_taskStart](index);
                task.will().call(the.context, function (err, ret) {
                    if (done) {
                        if (typeof DEBUG !== 'undefined' && DEBUG) {
                            throw new SyntaxError(
                                '`' + task.name + '` 任务被重复完成，请检查。'
                            );
                        }

                        return;
                    }

                    done = true;

                    if (err) {
                        the[_taskEnd](task, err);
                        the[_taskError](task, err);
                        return the[_planEnd](err);
                    }

                    successLength++;
                    combinedRet[index] = ret;
                    the[_taskEnd](task, ret);
                    the[_taskSuccess](task, err, ret);

                    if (successLength === the.length) {
                        combinedRet = filter(combinedRet, function (ret, index) {
                            return !the[_excludeMap][index];
                        });
                        combinedRet.unshift(null);
                        the[_planEnd].apply(the, combinedRet);
                    }
                });
                task.will = null;
            });
        });

        return the;
    },

    /**
     * try 计划
     * @param callback {Function} 成功回调
     * @returns {Plan}
     */
    try: function (callback) {
        var the = this;

        if (!isFunction(callback)) {
            return the;
        }

        the[_tryCallbackList].push(callback);

        return the;
    },

    /**
     * catch 计划
     * @param callback {Function} 错误回调
     * @returns {Plan}
     */
    catch: function (callback) {
        var the = this;

        if (!isFunction(callback)) {
            return the;
        }

        the[_catchCallbackList].push(callback);

        return the;
    },

    /**
     * 销毁计划
     */
    destroy: function () {
        var the = this;

        the[_state] = STATE_DESTROYED;
        the[_taskList] = the[_allCallbackList] = the[_tryCallbackList] = the[_catchCallbackList] = the.context = the[_excludeMap] = null;
        Plan.invoke('destroy', the);
    }
});
var _taskList = Plan.sole();
var _current = Plan.sole();
var _pushTask = Plan.sole();
var _planStart = Plan.sole();
var _planEnd = Plan.sole();
var _state = Plan.sole();
var _way = Plan.sole();
var _taskStart = Plan.sole();
var _taskError = Plan.sole();
var _taskSuccess = Plan.sole();
var _taskEnd = Plan.sole();
var _tryCallbackList = Plan.sole();
var _catchCallbackList = Plan.sole();
var _allCallbackList = Plan.sole();
var _excludeMap = Plan.sole();
var pro = Plan.prototype;

pro[_pushTask] = function (type, name, fn) {
    var the = this;

    if (the[_state] > STATE_READY) {

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            throw new SyntaxError(
                '任务已开始，无法分配新任务'
            );
        }

        return the;
    }

    var task = new Task(the, type, name, fn);

    if (!task.will) {
        return the;
    }

    the[_taskList].push(task);
    the.length++;

    return the;
};

pro[_taskStart] = function (index) {
    var the = this;
    var task = the[_taskList][index];

    task.startTime = now();
    the.emit('taskStart', task);
    return task;
};

pro[_taskError] = function (task, err) {
    var the = this;

    the.emit('taskError', task, err);
};

pro[_taskSuccess] = function (task, ret) {
    var the = this;

    the.emit('taskSuccess', task, ret);
};

pro[_taskEnd] = function (task, err, ret) {
    var the = this;

    task.endTime = now();
    the.emit('taskEnd', task, err, ret);
};

pro[_planStart] = function () {
    var the = this;

    the.startTime = now();
    the[_state] = STATE_PENDING;
    the.emit('planStart');
};

pro[_planEnd] = function (err/*...*/) {
    var the = this;
    var args = accessArgs(arguments);

    the.endTime = now();
    the[_state] = STATE_END;
    // 计划完成，销毁任务
    each(the[_taskList], function (index, task) {
        task.destroy();
    });

    var emitArgs = args.slice();
    emitArgs.unshift('planEnd');
    the.emit.apply(the, emitArgs);

    if (err) {
        the.error = err;
        the.emit('planError', err);
        each(the[_allCallbackList], function (index, callback) {
            callback.call(the.context, err);
        });
        each(the[_catchCallbackList], function (index, callback) {
            callback.call(the.context, err);
        });
    } else {
        args.shift();
        emitArgs = args.slice();
        emitArgs.unshift('planSuccess');
        the.emit.apply(the, emitArgs);
        var allArgs = args.slice();
        allArgs.unshift(null);
        each(the[_allCallbackList], function (index, callback) {
            callback.apply(the.context, allArgs);
        });
        each(the[_tryCallbackList], function (index, callback) {
            callback.apply(the.context, args);
        });
    }

    the.destroy();
};

module.exports = Plan;



