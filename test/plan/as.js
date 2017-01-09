/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-09 11:07
 */


'use strict';

var plan = require("../../src/index.js");

it('.as', function (done) {
    var data = {
        a: 1
    };
    var planA = plan.as(data);

    expect(planA.context).toBe(data);
    done();
});


