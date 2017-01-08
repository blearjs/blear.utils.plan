/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';


var Plan = require('../src/plan');

var plan = window.plan = new Plan();

plan
    .is('我的第一个计划')
    .as({
        times: 0
    })
    .task('我的异步任务', function (next) {
        var the = this;

        the.times++;
        setTimeout(function () {
            next(new Error('呵呵'), the.times);
        }, 100);
    }).repeat(3)
    .taskSync(function mySyncTask() {
        var len = 10000;
        while (len--) {
            //
        }
    })
    .wait(1000).repeat(4)
    .try(function () {
        console.info('try', arguments);
    })
    .catch(function (err) {
        console.error('catch', err);
    })
    .on('taskStart', function (task) {
        console.log(this.name, (task.index + 1) + '/' + task.length, 'task start', task.name);
    })
    .on('taskEnd', function (task) {
        console.log(this.name, (task.index + 1) + '/' + task.length, 'task end', task.name, task.endTime - task.startTime + 'ms');
    })
    .on('planStart', function (plan) {
        console.log('plan start', plan.name);
    })
    .on('planEnd', function (plan) {
        console.log('plan end', plan.name, plan.endTime - plan.startTime + 'ms');
    })
    // 串行执行计划任务
    // .serial();
    // 并行执行任务
    .parallel();

