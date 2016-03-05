const babel = require('gulp-babel');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babelify = require('babelify');

gulp.task('default', () => {});

// Client /////////////////////////////////////////////////////////////////////

gulp.task(
  'copy-static-client-files',
  () => {
    return gulp
      .src('./client/index.html')
      .pipe(gulp.dest('./build/client'));
  }
)

gulp.task(
  'build-jsx',
  () => {
    return browserify({
      entries: './client/index.js',
      debug: true,
    })
      .transform(babelify.configure({
        presets: ['es2015', 'react']
      }))
      .bundle()
      .pipe(source('index.js'))
      .pipe(gulp.dest('./build/client'));
  }
)

gulp.task(
  'build-client',
  [
    'copy-static-client-files',
    'build-jsx'
  ],
  (done) => {
    done();
  }
);

// Server /////////////////////////////////////////////////////////////////////

gulp.task(
  'build-server',
  [
    'build-libalpaca',
    'build-libpgp'
  ],
  () => {
    return gulp
      .src('./server/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('./build/server/'));
  }
);

gulp.task(
  'test-server',
  ['build-server'],
  () => {
    return gulp
      .src('./build/server/tests/**/*.js')
      .pipe(mocha());
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
