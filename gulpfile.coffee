gulp = require 'gulp'
coffee = require 'gulp-coffee'
lint = require 'gulp-coffeelint'
jasmine = require 'gulp-jasmine'
reporters = require 'jasmine-reporters'

glob = (dir, ext = 'coffee') -> "#{dir}/**/*.#{ext}"
lib = glob('lib')
test = glob('test')

gulp.task 'build', ->
  gulp.src lib
    .pipe coffee({ bare: true })
  .pipe gulp.dest('dist/')

gulp.task 'lint', ->
  gulp.src lib
    .pipe lint()
    .pipe lint.reporter()

gulp.task 'test', ['build'], ->
  reporterConfig =
    verbosity: 3
    color: true
    showStack: true

  gulp.src test
    .pipe jasmine({ reporter: new reporters.TerminalReporter(reporterConfig) })

gulp.task 'default', ['lint', 'build', 'test']