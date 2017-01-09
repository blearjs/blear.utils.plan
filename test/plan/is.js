/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 11:07
 */


'use strict';

var plan = require("../../src/index.js");

it('.is', function (done) {
    var planA = plan.is('a');

    expect(planA.name).toBe('a');
    done();
});


