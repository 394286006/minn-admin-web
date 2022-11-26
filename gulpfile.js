var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var production = process.env.NODE_ENV === 'minn-production';
//var pt='/Volumes/d/server/apache-tomcat-8.0.21/wtpwebapps/admin';
//var pt='/Volumes/d/workspace/bccode/minn-admin/src/main/webapp'; //public
var pt='/Volumes/data/code/web/minn-admin/prod';
//var pt='public';

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-bootstrap',
  'react-bootstrap-table',
  'jstree',
  'd3',
  'jquery-confirm',
  'underscore'
];

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/jstree/dist/jstree.js',
    'bower_components/jquery-confirm2/dist/jquery-confirm.min.js',
    'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
    'bower_components/chartist/dist/chartist.min.js',
    'node_modules/d3/build/d3.js',
    'bower_components/toastr/toastr.js',
    'app/p/minn/utils/sylvester.js',
    'app/p/minn/utils/glUtils.js',
    'app/p/minn/chart/loader.js',
    'app/p/minn/scripts/qrcode.js'
  ],{allowEmpty: true}).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest(pt+'/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', ()=> {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest(pt+'js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', gulp.series('browserify-vendor',function() {
  return browserify({ entries: 'app/main.js', debug: true })
    .external(dependencies)
    .transform(babelify, { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(pt+'/js'));
}));

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', gulp.series('browserify-vendor', function() {
  var bundler = watchify(browserify({ entries: 'app/main.js', debug: true }, watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify, { presets: ['es2015', 'react'] });
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(pt+'/js/'));
  }
}));

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function() {
  return gulp.src(['app/stylesheets/main.less',
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/bootstrap/dist/css/bootstrap-theme.css',
    'bower_components/react-bootstrap-table/css/react-bootstrap-table-all.min.css',
    'bower_components/jquery-confirm2/dist/jquery-confirm.min.css',
    'bower_components/chartist/dist/chartist.min.css'
    ])
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest(pt+'/css'));
});

/*
 |--------------------------------------------------------------------------
 | Compile viwe html.
 |--------------------------------------------------------------------------
 */
gulp.task('copy-third-part-html', function() {
  return gulp.src('./views/third-part/*.{html,js}')
    .pipe(gulp.dest(pt+'/third-part'));
});

gulp.task('watch', function() {
  gulp.watch('app/stylesheets/**/*.less', gulp.series('styles'));
});

gulp.task('watch-html', function() {
  gulp.watch('./views/third-part/*.{html,js}', gulp.series('copy-third-part-html'));
});



gulp.task('default', gulp.series('copy-third-part-html','styles', 'vendor', 'browserify-watch', 'watch','watch-html'));
gulp.task('build', gulp.parallel('copy-third-part-html','styles', 'vendor', 'browserify'));
