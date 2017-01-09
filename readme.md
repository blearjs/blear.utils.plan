# blear.utils.plan

[![npm module][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![coverage][coveralls-img]][coveralls-url]

[travis-img]: https://img.shields.io/travis/blearjs/blear.utils.plan/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/blearjs/blear.utils.plan

[npm-img]: https://img.shields.io/npm/v/blear.utils.plan.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/blear.utils.plan

[coveralls-img]: https://img.shields.io/coveralls/blearjs/blear.utils.plan/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/blearjs/blear.utils.plan?branch=master


# 串行
```js
plan
    // 异步任务
    .task(function (next) {
        setTimeout(function () {
            next(null, 1);
        }, 10);
    })
    // 同步任务
    .taskSync(function (ret) {
        // 1 + 2
        return ret + 2;
    })
    // 串行
    .serial()
    .try(function (ret) {
        expect(ret).toBe(3);
        done();
    });
```

# 并行
```js
plan
    // 异步任务
    .task(function (next) {
        setTimeout(function () {
            next(null, 1);
        }, 10);
    })
    // 同步任务
    .taskSync(function () {
        return 2;
    })
    // 并行
    .parallel()
    .try(function (ret1, ret2) {
        expect(ret1).toBe(1);
        expect(ret2).toBe(2);
        done();
    });
```

# API
## plan.task
## plan.taskSync
## plan.each
## plan.eachSync
## plan.repeat
## plan.wait
## plan.is
## plan.as
## plan.serial
## plan.parallel
## plan.try
## plan.catch

# Events
## planStart
## planEnd
## planSuccess
## planError
## taskStart
## taskEnd
## taskSuccess
## taskError
