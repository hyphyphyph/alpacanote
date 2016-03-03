const babel = require('gulp-babel');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {});

gulp.task('build-server', () => {
  return gulp
    .src('./server/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./build/server/'));
});

gulp.task('build-libalpaca', () => {
  return gulp
    .src('./libalpaca/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./build/libalpaca/'));
});

gulp.task('serve', ['build-server'], (done) => {
  nodemon({
    script: './build/server/index.js'
  });
});

