import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint7';
import jasmine from 'gulp-jasmine';
import reporters from 'jasmine-reporters';

const tests = './test/**/*.js';
const src = './lib/**/*.js';
const dst = './dist/';

const lint = () =>
  gulp
    .src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

const compile = () => gulp.src(src).pipe(babel()).pipe(gulp.dest(dst));

const test = () =>
  gulp.src(tests).pipe(
    jasmine({
      reporter: new reporters.TerminalReporter({
        verbosity: 3,
        color: true,
        showStack: true
      })
    })
  );

const clean = () => del(dst);
const build = gulp.series(clean, lint, compile);
const watch = () => gulp.watch(src, build);

gulp.task('lint', lint);
gulp.task('test', test);
gulp.task('clean', clean);
gulp.task('default', build);
gulp.task('watch', gulp.series(build, watch));
