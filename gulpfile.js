var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var client = require.resolve('webpack-dev-server/client/');
var fs = require('fs');
var rename = require('gulp-rename');
var argv = require('yargs').argv;
var replace = require('gulp-replace');
var clean = require('gulp-clean');

// The development server (the recommended option for development)
gulp.task("default", ["dev"]);

gulp.task("dev", ["webpack-dev-server"]);

gulp.task("webpack-dev-server", ['config'], function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.entry.unshift(client + '?http://localhost:3000');

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        stats: {
            colors: true
        }
    }).listen(3000, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
    });
});
// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", ['config'], function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        })
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('config', function() {
    var constantDefinition = {
        environment: argv.e,
        apiUrl : apiUrl
    };
    gulp.src("./gulp/ngConstantTemplate.js")
        .pipe(replace('constantDefinition', JSON.stringify(constantDefinition)))
        .pipe(rename('env.constant.js'))
        .pipe(gulp.dest('./src/js/constants'));
});

// Delete results from unit tests and coverage
gulp.task('clean-results', function () {
    return gulp.src('results', {read: false})
        .pipe(clean());
});

var apiUrl;
switch(argv.d) {
    case 'dev':
        apiUrl = 'http://localhost:8080/api';
        break;
    case 'test':
        apiUrl = 'http://bardo2-build.mijnbardo.nl:8080/api';
        break;
    default:
        apiUrl = 'http://localhost:8080/api';
}

argv.e = argv.e || 'dev';