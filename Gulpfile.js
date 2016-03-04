const babel = require('gulp-babel');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {});

// Server /////////////////////////////////////////////////////////////////////

gulp.task(
  'build-server',
  () => {
    return gulp
      .src('./server/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('./build/server/'));
  }
);

// LibAlpaca //////////////////////////////////////////////////////////////////

gulp.task(
  'build-libalpaca',
  () => {
    return gulp
      .src('./libalpaca/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('./build/libalpaca/'));
  }
);

gulp.task(
  'test-libalpaca',
  ['build-libalpaca'],
  () => {
    return gulp
      .src('./build/libalpaca/tests/**/*.js')
      .pipe(mocha());
  }
);

// LibPgp /////////////////////////////////////////////////////////////////////

gulp.task(
  'build-libpgp',
  () => {
    return gulp
      .src('./libpgp/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('./build/libpgp/'));
  }
);

gulp.task(
  'test-libpgp',
  ['build-libpgp'],
  () => {
    return gulp
      .src('./build/libpgp/tests/**/*.js')
      .pipe(mocha());
  }
);

gulp.task(
  'serve',
  ['build-server'],
  (done) => {
    nodemon({
      script: './build/server/index.js'
    });
  }
);

