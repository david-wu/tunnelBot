const _ = require('lodash');
const gulp = require('gulp');
const webpack = require('gulp-webpack');
const mergeStream = require('merge-stream');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');

const configs = {
    client: './app/**/*.*',
    sass: './app/**/*.{css,scss}',
    index: './app/index.html',
    assets: './app/assets/**/*.*',
    dist: './dist',
};

gulp.task('default', ['watchHtml', 'watchAssets', 'watchSass'], function() {
    return appPack()
        .pipe(gulp.dest(configs.dist));
});

gulp.task('build', ['sass', 'html', 'assets'], function(){
    return appPack({watch: false})
        .pipe(gulp.dest(configs.dist));
})

gulp.task('watchSass', ['sass'], function(){
    gulp.watch(configs.sass, function(event) {
        gulp.start('sass');
    });
})
gulp.task('sass', function(){
    return gulp.src(configs.sass)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
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
function appPack(options){
    const config = _.extend(_.cloneDeep(webpackConfig), options)
    return gulp.src(configs.client)
        .pipe(webpack(config));
}
