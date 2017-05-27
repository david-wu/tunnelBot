const _ = require('lodash');

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const webpack = require('gulp-webpack');
const mergeStream = require('merge-stream');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');

const configs = {
    app: './app/**/*.*',
    index: './app/index.html',
    assets: './app/assets/**/*.*',
    dist: './dist',
};

gulp.task('default', ['watchHtml', 'watchAssets'], function() {
    return gulp.src(configs.app)
        .pipe(getWebpacker())
        .pipe(gulp.dest(configs.dist));
});

gulp.task('build', ['html', 'assets'], function(){
    return gulp.src(configs.app)
        .pipe(getWebpacker({watch: false}))
        .pipe(uglify())
        .pipe(gulp.dest(configs.dist));
})

gulp.task('watchHtml', ['html'], function(){
    gulp.watch(configs.index, function(event) {
        gulp.start('html');
    });
})
gulp.task('html', function(){
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


const webpackConfig = require('./webpack.config.js');
function getWebpacker(options={}){
    const config = _.extend(_.cloneDeep(webpackConfig), options)
    return webpack(config);
}
function appPack(options){
    const config = _.extend(_.cloneDeep(webpackConfig), options)
    return gulp.src(configs.app)
        .pipe(webpack(config));
}
