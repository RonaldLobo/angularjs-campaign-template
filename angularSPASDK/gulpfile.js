//*********** IMPORTS *****************
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var map = require("map-stream");
var livereload = require("gulp-livereload");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
global.errorMessage = '';
 
//Configuration - Change me

var jsFiles = [
{
watch: ['js/App/*.js','js/App/Routes/*.js','js/App/Filters/*.js','js/App/Directives/*.js','js/App/Factories/*.js','js/App/Controllers/*.js'],
output: 'js/',
name: 'app.js',
nameMin: 'app.min.js'
}
];
//END configuration
 
 
gulp.task('watch', function () {
    gulp.watch(['sass/*.scss','sass/includes/*.scss'], ['styles']);
    for (var j in jsFiles) {
        scriptWatch(jsFiles[j]);
    }
});

 
function scriptWatch(jsData) {
gulp.src(jsData.watch)
.pipe(watch({glob:jsData.watch, emitOnGlob: true}, function() {
gulp.src(jsData.watch)
.pipe(concat(jsData.name))
.pipe(gulp.dest(jsData.output))
.pipe(uglify({outSourceMap: false}))
.pipe(rename(jsData.nameMin))
.pipe(gulp.dest(jsData.output));
}));
}
 
gulp.task('default', ['watch']);

gulp.task('styles', function() {
  return gulp.src('sass/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});