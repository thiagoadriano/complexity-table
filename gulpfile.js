'use strict';
let gulp = require("gulp"),
    jsmin = require("gulp-js-minify"),
    cssmin = require("gulp-clean-css"),
    zip    = require("gulp-zip"),
    shell = require('gulp-shell'),
    uglifyjs = require('gulp-uglify');

const data = new Date();
let dia = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
let mes = data.getMonth() + 1 < 10 ? data.getMonth() + 1 : data.getMonth() + 1;
let ano = data.getFullYear();
let hora = data.getUTCHours().toString() + 
          data.getUTCMinutes().toString() + 
          data.getUTCSeconds().toString() +
          data.getUTCMilliseconds().toString();

let dataVersion = dia + "_" + mes + "_" + ano + "-" + hora;

gulp.task('pack', () => {
    return gulp.src('dist/*')
            .pipe(zip('jQuery.ComplexityTable.' + dataVersion + ".zip"))
            .pipe(gulp.dest('./dist/'));
});

gulp.task('minJs', function(){
  return gulp.src('./public/component/*.js')
            .pipe(uglifyjs())
            .pipe(gulp.dest('./dist/'));
});

gulp.task('minCss', function() {
  return gulp.src('./public/component/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('removeCompilate', () => {
    return gulp.src("./dist")
            .pipe(shell("rm -r dist/complexity.table.jquery.js"))
            .pipe(shell("rm -r dist/complexity.table.jquery.css"))
});

gulp.task("build", ["minCss", "minJs", "pack", "removeCompilate"], ()=>{
  console.log("Package Criado");
});