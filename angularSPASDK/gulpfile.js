//*********** IMPORTS *****************
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var map = require("map-stream");
var livereload = require("gulp-livereload");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
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
 
 
var shell = require('gulp-shell'); 
gulp.task('docs', shell.task([ 
  'node_modules/jsdoc/jsdoc.js '+ 
    '-c node_modules/angular-jsdoc/conf.json '+   // config file
    '-t node_modules/angular-jsdoc/template '+    // template file
    '-d build/JSdocs '+                             // output directory
    '-r js/App'                              // source code directory
]));
