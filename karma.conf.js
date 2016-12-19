module.exports = function(config) {
    config.set({

        basePath: '',

        browsers: ['Chrome'],

        frameworks: ['browserify', 'jasmine'],

        files: [
            'src/**/*.js'
        ],

        exclude: [
        ],

        preprocessors: {
            'src/**/*.js': ['browserify', 'coverage'],
            'src/**/*.spec.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [ 'babelify', 'browserify-ngannotate' ]
        },

        singleRun: true,

        coverageReporter: {
            dir: 'coverage/',
            reporters: [{
                type: 'text-summary'
            }, {
                type: 'html'
            }]
        },

        reporters: ['progress', 'coverage', 'spec'],
    });
};
