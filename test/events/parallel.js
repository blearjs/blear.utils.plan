/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 10:28
 */


'use strict';

var utils = require('../utils');
var plan = require('../../src/index');

it('并行', function (done) {
    plan
        .is('我的并行计划')
        .task('我的异步任务1', utils.asyncTaskify(false, 1))
        .task('我的异步任务2', utils.asyncTaskify(false, 2))
        .wait(100)
        .taskSync('我的同步任务1', utils.syncTaskify(false, 3))
        .taskSync('我的同步任务2', utils.syncTaskify(false, 4))
        .parallel(done)
        .on('taskStart', function (task) {
            console.log(
                '【' + (task.index + 1) + '/' + task.length + '】', task.name,
                '任务开始'
            );
        })
        .on('taskSuccess', function (task, ret) {
            console.log(
                '【' + (task.index + 1) + '/' + task.length + '】', task.name,
                '任务成功：',
                ret
            );
        })
        .on('taskError', function (task, err) {
            console.log(
                '【' + (task.index + 1) + '/' + task.length + '】', task.name,
                '任务失败：',
                err
            );
        })
        .on('taskEnd', function (task, err, ret) {
            console.log(
                '【' + (task.index + 1) + '/' + task.length + '】', task.name,
                '任务结束：',
                (task.endTime - task.startTime) + 'ms'
            );
        })
        .on('planStart', function () {
            console.log('=========', this.name, '=========');
            console.log('计划开始');
        })
        .on('planEnd', function (err, ret) {
            console.log('=========', this.name, '=========');
            console.log(
                '计划结束：',
                (this.endTime - this.startTime) + 'ms'
            );
        })
        .on('planSuccess', function (ret1, ret2, ret3, ret4) {
            console.log('计划成功：', ret1, ret2, ret3, ret4);
        })
        .on('planError', function (err) {
            console.log('计划失败：', err);
        });
});



