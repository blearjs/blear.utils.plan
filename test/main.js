(function (__karma__, coolie) {
    var tests = [];

    for (var file in __karma__.files) {
        if (__karma__.files.hasOwnProperty(file)) {
            if (/\/test\.[^/]*\.js$/i.test(file)) {
                tests.push(file);
            }
        }
    }

    coolie.config({
        nodeModuleMainPath: 'src/index.js'
    });
    coolie.use(tests);

    coolie.callback(function () {
        __karma__.start.call();
    });
})(window.__karma__, coolie);
