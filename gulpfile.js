const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-vinyl-zip');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

// postcss plugins
const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-function');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');
const easyimport = require('postcss-easy-import');

function serve(done) {
  livereload.listen();
  done();
}

const handleError = (done) => {
  return function (err) {
    return done(err);
  };
};

function hbs(done) {
  pump([src(['*.hbs', 'partials/**/*.hbs']), livereload()], handleError(done));
}

function css(done) {
  pump(
    [
      src('src/scss/*.scss', { sourcemaps: true }),
      sass(),
      concat('style.css'),
      postcss([
        easyimport,
        customProperties({ preserve: false }),
        colorFunction(),
        autoprefixer(),
        cssnano(),
      ]),
      dest('./assets/css', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function js(done) {
  pump(
    [
      src(['src/js/lib/*.js', 'src/js/*.js'], { sourcemaps: true }),
      webpackStream(webpackConfig),
      uglify(),
      dest('./assets/js', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function zipper(done) {
  const filename = require('./package.json').name + '.zip';

  pump(
    [
      src(['**/*', '!node_modules', '!node_modules/**', '!dist', '!dist/**', '!package-lock.json']),
      zip.dest('./dist/' + filename),
    ],
    handleError(done)
  );
}

const cssWatcher = () => watch('src/scss/**', css);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, hbsWatcher);
const build = series(css, js);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);
