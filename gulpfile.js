var gulp = require('gulp');

//Plugins模块获取
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var imagemin = require('gulp-imagemin')

// 压缩 public 目录 css文件
gulp.task('minify-css', function () {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
});

// 压缩 public 目录 html文件
gulp.task('minify-html', function () {
    return gulp.src('./public/**/*.html')
        .pipe(minifyhtml())
        .pipe(gulp.dest('./public'))
});

// 压缩 public/js 目录 js文件
gulp.task('minify-js', function () {
    return gulp.src([
      './public/**/*.js', 
      '!./public/js/**.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

// 压缩public/posts 目录 图片文件
gulp.task('minify-img', function () {
    return gulp.src('./public/**/*.*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({
                    'optimizationLevel': 3
                }),
                imagemin.jpegtran({
                    'progressive': true
                }),
                imagemin.optipng({
                    'optimizationLevel': 7
                }),
                imagemin.svgo()
            ], {
                'verbose': true
            }))
        .pipe(gulp.dest('./public'))
});

// 分别执行css、heml、js和图片的压缩任务
gulp.task('build', gulp.series('minify-css', 'minify-html', 'minify-js', 'minify-img'));