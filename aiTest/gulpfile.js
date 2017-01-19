const gulp = require('gulp');
// const jasmineBrowser = require('gulp-jasmine-browser');
const webpack = require('gulp-webpack');
const mergeStream = require('merge-stream');


const configs = {
    client: 'client/**.*',
    index: 'client/index.html',
    assets: 'client/assets/**.*',
    dist: 'dist',
};

gulp.task('default', ['watchHtml', 'watchAssets'], function() {
    return appPack()
        .pipe(gulp.dest(configs.dist));
});




gulp.task('watchHtml', ['indexHtml'], function(){
    gulp.watch(configs.index, function(event) {
        gulp.start('indexHtml');
    });
})

gulp.task('indexHtml', function(){
    return gulp.src(configs.index)
        .pipe(gulp.dest(configs.dist));
});



gulp.task('watchAssets', ['assets'], function(){
    gulp.watch(configs.assets, function(event) {
        gulp.start('assets');
    });
})

gulp.task('assets', function(){
    return gulp.src(configs.assets)
        .pipe(gulp.dest(configs.dist));
})


function appPack(){
    const webpackConfig = require('./webpack.config.js');
    return gulp.src(configs.client)
        .pipe(webpack(webpackConfig));
}
