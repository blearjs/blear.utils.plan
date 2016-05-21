/**
 * karma 测试配置文件
 * @author ydr.me
 * @create 2016-04-20 21:15
 */


'use strict';


var TRAVIS = process.env.TRAVIS;

// http 服务器
var httpServer = function (req, res, next) {
    next();
};


module.exports = function (config) {
    var browsers = [];
    var reporters = ['progress', 'coverage'];
    var coverageReporters = [{
        type: 'text-summary'
    }];

    if (TRAVIS) {
        browsers = ['Chrome_travis_ci'];
        reporters.push('coveralls');
        coverageReporters.push({
            type: 'lcov',
            dir: './coverage/'
        });
    } else {
        browsers = ['Chrome'];
    }


    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // 单元测试框架
        frameworks: ['jasmine', 'coolie'],


        client: {},


        // list of files / patterns to load in the browser
        files: [
            {
                // 加载 src 下的原始文件，但不直接引入，使用模块加载器引入
                pattern: './src/**',
                included: false
            },
            {
                // 加载 node_modules 下的原始文件，但不直接引入，使用模块加载器引入
                pattern: './node_modules/blear.*/package.json',
                included: false
            },
            {
                // 加载 node_modules 下的原始文件，但不直接引入，使用模块加载器引入
                pattern: './node_modules/blear.*/src/**',
                included: false
            },
            {
                // 加载 src 下的原始文件，但不直接引入，使用模块加载器引入
                pattern: './test/test.**',
                included: false
            },
            {
                // 加载 test 下的入口文件，但不直接引入，使用模块加载器引入
                pattern: './test/main.js',
                included: true
            }
        ],


        // list of files to exclude
        include: [],
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // 原始模块，需要测试覆盖率
            './src/index.js': ['coverage']
        },


        // optionally, configure the reporter
        // 覆盖率报告
        coverageReporter: {
            reporters: coverageReporters
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // 报告类型
        reporters: reporters,


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: browsers,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,


        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,


        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },


        middleware: ['httpServer'],


        // plugins
        plugins: ['karma-*', {
            'middleware:httpServer': [
                'factory', function () {
                    return httpServer;
                }
            ]
        }]
    });
};



