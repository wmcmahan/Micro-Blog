module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'public/bower_components/angular/angular.js',
            'public/bower_components/angular-resource/angular-resource.min.js',
            'public/bower_components/angular-resource/angular-route.js',
            'public/bower_components/angular-animate/angular-animate.js',
            'public/bower_components/angular-mocks/angular-mocks.js',
            'public/scripts/*.js',
            'public/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
        ],
        exclude: [],
        port: 8080,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        singleRun: false
    });
};
