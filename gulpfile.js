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
  replace = require('gulp-replace'),
  htmlreplace = require('gulp-html-replace'),
  zip = require('gulp-zip'),
  del = require('del'),
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
      // .pipe(uglify().on('error', function(err) {
      //      gutil.log(gutil.colors.red('[Error]'), err.toString());
      //      this.emit('end');
      // }))
      .pipe(concat('persona-fusion-calculator.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/html'));
});

gulp.task('minify-data', function(){
    gulp.src(['data/*.js'])
      //.pipe(uglify())
      //.pipe(rename({suffix: '.min'}))
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
        'bower_components/jquery/dist/jquery.slim.min.js',
        "bower_components/popper.js/dist/umd/popper.min.js",
        "bower_components/bootstrap/dist/js/bootstrap.min.js"
        ])
    .pipe(gulp.dest('dist/html/lib'));
});

gulp.task('export-css', function(){
    gulp.src([
        "bower_components/bootstrap/dist/css/bootstrap.min.css",
        "bower_components/font-awesome/css/font-awesome.min.css"
    ])
    .pipe(gulp.dest('dist/html/css'));
});

gulp.task('export-img', function(){
    gulp.src(["img/*.png", "img/*.jpg", "img/*.svg"])
    .pipe(gulp.dest('dist/html/img'))
})

gulp.task('build-index', function(){
    gulp.src(['index.html'])
    .pipe(htmlreplace({
        applogic: {
          src: null,
          tpl: '<script src="persona-fusion-calculator.min.js"></script>'
        }
    }))
    .pipe(replace(
      /bower_components\/.*\/(.*\.min\.css)/g, 'css/$1'
    ))
    .pipe(replace(
      /bower_components\/.*\/(.*\.min\.js)/g, 'lib/$1'
    ))
    .pipe(replace(
      /node_modules\/.*\/(.*)\.js/g, 'lib/$1.min.js'
    ))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/html'));
});

gulp.task('zip-build', function(){
    gulp.src('dist/html/**')
        .pipe(zip('persona-fusion-calculator.zip'))
        .pipe(gulp.dest('dist'))
});

gulp.task('clean:all', function(){
  return del([
      'dist',
      'bower_components',
      'node_modules'
  ]);
});

gulp.task('clean:dist', function(){
    return del('dist/html');
});

gulp.task('build', function(){
  runSequence('minify-data', 'build-sass', 'build-js',
            'build-templates', 'build-index', 'export-libs',
            'export-css', 'export-img', 'zip-build')
});