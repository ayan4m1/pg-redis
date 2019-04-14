gulp = require 'gulp'
coffee = require 'gulp-coffee'
coffeeLint = require 'gulp-coffeelint'
jasmine = require 'gulp-jasmine'
reporters = require 'jasmine-reporters'

glob = (dir, ext = 'coffee') -> "#{dir}/**/*.#{ext}"
lib = glob('lib')
tests = glob('test')

lint = ->
  gulp.src lib
    .pipe coffeeLint()
    .pipe coffeeLint.reporter()

build = ->
  gulp.src lib
    .pipe coffee({ bare: true })
  .pipe gulp.dest('dist/')

test = ->
  reporterConfig = {
    verbosity: 3
    color: true
    showStack: true
  }

  gulp.src tests
    .pipe jasmine({ reporter: new reporters.TerminalReporter(reporterConfig) })

gulp.task 'lint', lint
gulp.task 'build', build
gulp.task 'test', test
gulp.task 'default', gulp.series(lint, build, test)
