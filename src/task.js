/**
 * Task
 * @author ydr.me
 * @created 2017-01-08 16:56
 */


'use strict';

var Class = require('blear.classes.class');
var object = require('blear.utils.object');
var random = require('blear.utils.random');
var access = require('blear.utils.access');
var fun = require('blear.utils.function');
var typeis = require('blear.utils.typeis');

var accessArgs = access.args;
var guid = random.guid;
var isFunction = typeis.Function;
// 异步任务
var TASK_ASYNC = 1;
// 同步任务
var TASK_SYNC = 2;
// promise 任务
var TASK_PROMISE = 3;

var Task = Class.extend({
    className: 'Task',
    constructor: function (plan, type, name, fn) {
        var the = this;
        var args = accessArgs(arguments);

        // 匿名 task
        if (args.length === 3) {
            fn = args[2];
            name = fun.name(fn);
        }

        if (!isFunction(fn)) {

            if (typeof DEBUG !== 'undefined' && DEBUG) {
                var errMsg = '';

                switch (type) {
                    case TASK_ASYNC:
                        errMsg += '// 异步任务\n' +
                            '#task("my task", function (next) {\n' +
                            '   ... balabala ...\n' +
                            '   setTimeout(function () {\n' +
                            '       next(new Error(bala), bala);\n' +
                            '    });\n' +
                            '})\n\n';
                        break;

                    case TASK_SYNC:
                        errMsg += '// 同步任务\n' +
                            '#taskSync("my task", function () {\n' +
                            '   ... balabala ...\n' +
                            '   return bala;\n' +
                            '})\n';
                        break;

                    case TASK_PROMISE:
                        errMsg += '// promise 任务\n' +
                            '#taskPromise("my task", function () {\n' +
                            '   ... balabala ...\n' +
                            '   return new Promise(... balabala ...);\n' +
                            '})\n';
                        break;
                }

                throw new SyntaxError(errMsg);
            }

            return the;
        }

        var task = fn;

        switch (type) {
            case TASK_ASYNC:
                // .task(function () {
                //                ^^^^
                //                此处没有显示 next
                // })
                if (fn.length === 0) {
                    throw new SyntaxError(
                        '异步任务必须显式调用 `next`：\n' +
                        'plan.task(function (next, prevRet) {\n' +
                        '    next(err, ret);\n' +
                        '})\n'
                    );
                }
                break;

            case TASK_SYNC:
                task = function (next, prev) {
                    var nextArgs = [];

                    try {
                        nextArgs.push(fn.call(plan.context, prev));
                        nextArgs.unshift(null);
                    } catch (err) {
                        nextArgs.push(err);
                    }

                    next.apply(plan.context, nextArgs);
                };
                break;

            case TASK_PROMISE:
                task = function (next, prev) {
                    fn.call(plan.context, prev).then(/*resolved*/function (result) {
                        next(null, result);
                    }, /*rejected*/next);
                };
                break;
        }

        // 因为任务可以重复执行，所以这里以函数返回
        the.will = function () {
            // 确保每一个任务只执行一次
            return fun.once(task);
        };
        the.task = task;
        the.plan = plan;
        the.name = name + '';
        the.copied = null;
        the.index = plan.length;
        the.startTime = the.endTime = 0;
        the.guid = guid();
        the.context = plan.context;
        object.define(the, 'length', {
            enumerable: true,
            get: function () {
                return plan.length;
            }
        });
    },


    /**
     * 自我复制一个新的 task
     * @returns {Task}
     */
    copy: function () {
        var the = this;
        // 复制的时候，自我任务已经被转换成异步的了
        var task = new Task(the.plan, TASK_ASYNC, the.name, the.task);
        task.copied = the;
        return task;
    },

    /**
     * 销毁 task
     */
    destroy: function () {
        var the = this;
        the.plan = the.will = the.copied = the.context = null;
    }
});

module.exports = Task;

