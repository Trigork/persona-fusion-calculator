/*
* Dependencies
*/
var gulp = require('gulp'),
  concat = require('gulp-concat');
  clean = require('gulp-clean'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  pump = require('pump'),
  runSequence = require('run-sequence'),
  htmlmin = require('gulp-htmlmin'),
  zip = require('gulp-zip'),
  gutil = require('gulp-util');

gulp.task('sass', function () {
    gulp.src(['css/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest('css/'));
});

gulp.task('build-sass', function () {
    gulp.src(['css/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest('dist/html/css/'));
});

gulp.task('build-js', function(){
    gulp.src(['app.js', 'app.config.js', 'app.routes.js', 'controller/*.js'])
      .pipe(uglify().on('error', function(err) {
          gutil.log(gutil.colors.red('[Error]'), err.toString());
          this.emit('end');
      }))
      .pipe(concat('persona-fusion-calculator.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/html'));
});

gulp.task('minify-data', function(){
    gulp.src(['data/*.js'])
      //.pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/html/data'));
});

gulp.task('build-templates', function(){
    gulp.src(['template/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/html/template'));
});

gulp.task('export-libs', function(){
    gulp.src([
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        ])
    .pipe(gulp.dest('dist/html/lib'));
});

gulp.task('build-index', function(){
    gulp.src(['index.html'])
    .pipe(gulp.dest('dist/html'));
});

gulp.task('zip-build', function(){
    gulp.src('dist/html/*')
        .pipe(zip('persona-fusion-calculator.zip'))
        .pipe(gulp.dest('dist'))
})

// Default task
gulp.task('build', function(){
  runSequence('minify-data', 'build-sass', 'build-js',
            'build-templates', 'build-index', 'export-libs',
            'zip-build')
});
