const gulp = require('gulp');
// const jasmineBrowser = require('gulp-jasmine-browser');
const webpack = require('gulp-webpack');
const mergeStream = require('merge-stream');


const configs = {
    client: 'client/**.*',
    index: 'client/index.html',
    dist: 'dist',
};

gulp.task('default', ['indexHtml'], function() {
    return appPack()
        .pipe(gulp.dest(configs.dist));
});

gulp.task('indexHtml', function(){
    return gulp.src(configs.index)
        .pipe(gulp.dest(configs.dist));
});


function appPack(){
    const webpackConfig = require('./webpack.config.js');
    return gulp.src(configs.client)
        .pipe(webpack(webpackConfig));
}
