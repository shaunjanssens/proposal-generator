/*!
 * @author: Shaun Janssens
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    shell = require('gulp-shell'),
    del = require('del'),
    livereload = require('gulp-livereload');

// Html
gulp.task('html', function(){
    gulp.src(['src/html/**/*'])
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

// Styles
gulp.task('styles', function() {
    return sass('src/styles/style.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('build/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('build/css'))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(livereload());
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('build/img'))
        .pipe(livereload());
});

// jQuery
gulp.task('jquery', function(){
    return gulp.src(['bower_components/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('build/js'));
});

// Handlebars
gulp.task('handlebars', function(){
    return gulp.src(['bower_components/handlebars/handlebars.runtime.min.js'])
        .pipe(gulp.dest('build/js'));
});

// Handlebars template
gulp.task('handlebars-template', function () {
    return gulp.src('*.js', {read: false})
        .pipe(shell([
            'handlebars src/templates/ >> src/scripts/templates.js'
        ]))
});

// Server
gulp.task('server', function(cb) {
    connect.server({
        root: 'build',
        livereload: true
    });
});

// Default task
gulp.task('default', ['html', 'styles', 'handlebars-template', 'scripts', 'images', 'jquery', 'handlebars', 'server', 'watch']);

// Watch
gulp.task('watch', function() {
    livereload.listen();

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch html files
    gulp.watch('src/html/**/*', ['html']);

    // Watch html files
    gulp.watch('src/templates/**/*', ['handlebars-template']);
});
