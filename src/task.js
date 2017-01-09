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

var Task = Class.extend({
    className: 'Task',
    constructor: function (plan, sync, name, fn) {
        var the = this;
        var args = accessArgs(arguments);

        // 匿名 task
        if (args.length === 3) {
            fn = args[2];
            name = fun.name(fn);
        }

        if (!isFunction(fn)) {

            if (typeof DEBUG !== 'undefined' && DEBUG) {
                throw new SyntaxError(
                    '`#task([name], fn)`：`fn` 必须为异步函数，例如：\n' +
                    '#task("my task", function (next) {\n' +
                    '   setTimeout(function () {\n' +
                    '       next();\n' +
                    '    }, 1000);\n' +
                    '})\n'
                );
            }

            return the;
        }

        if (sync) {
            var syncTask = fn;
            fn = function (next, lastRet) {
                var nextArgs = [];

                try {
                    nextArgs.push(syncTask.call(plan.context, lastRet));
                    nextArgs.unshift(null);
                } catch (err) {
                    nextArgs.push(err);
                }

                next.apply(plan.context, nextArgs);
            };
        } else {
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
        }

        // 因为任务可以重复执行，所以这里以函数返回
        the.will = function () {
            // 确保每一个任务只执行一次
            return fun.once(fn);
        };
        the.plan = plan;
        the.sync = sync;
        the.name = name + '';
        the.fn = fn;
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
        var task = new Task(the.plan, false, the.name, the.fn);
        task.copied = the;
        return task;
    },

    /**
     * 销毁 task
     */
    destroy: function () {
        var the = this;
        the.plan = the.fn = the.will = the.copied = the.context = null;
    }
});

module.exports = Task;

