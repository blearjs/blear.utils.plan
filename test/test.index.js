/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

describe('串行任务', function () {
    require('./serial/async');
    require('./serial/sync');
});

describe('并行任务', function () {
    require('./parallel/async');
    require('./parallel/sync');
});

describe('事件', function () {
    require('./events/serial');
    require('./events/parallel');
});

describe('计划', function () {
    require('./plan/is');
    require('./plan/as');
    require('./plan/parallel');
    require('./plan/serial');
});

describe('边界', function () {
    require('./marginal/serial');
    require('./marginal/parallel');
});

