// node_modules/gulp/bin/gulp.js

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var minifycss    = require('gulp-minify-css');
var notify       = require('gulp-notify');
var cache        = require('gulp-cache');
var imagemin     = require('gulp-imagemin');
var git          = require('gulp-git');
var minifyHTML   = require('gulp-minify-html');
var changed      = require('gulp-changed');
var gutil        = require('gulp-util');
var exec         = require('child_process').exec;
var merge        = require('merge2');
var concat       = require('gulp-concat');
var postcss      = require('gulp-postcss');
var csswring     = require('csswring');
var sourcemap    = require('gulp-sourcemaps');
var runSequence  = require('run-sequence');

var configDir = {
    bootstrap: './bower_components/bootstrap-sass/',
    source:    './source/',
    static:    './static/',
};

var src = {
    root:      './*',
    fonts:     configDir.bootstrap + 'assets/fonts/**/*',
    css_boots: configDir.bootstrap + 'assets/stylesheets',
    sass:      configDir.source + 'css/main.scss',
    images:    configDir.source + 'images/**/*',
    templates: configDir.source + 'templates/**/*.html',
}

var dest = {
    css:       './static/css/',
    fonts:     './static/fonts/',
    images:    './static/images/',
    templates: './templates/',
}


function notifyOK( title ) {
    //gutil.log(gutil.colors.red('test'));
    return notify( {
        message: 'Traitement OK pour \'<%= file.relative %>\'',
        title: title,
    });
}


gulp.task('css', function() {
  return merge(
    gulp.src(src.sass)
      .pipe(sass({ includePaths: [src.css_boots], /*style: 'compressed'*/ }).on('error', gutil.log))
      /*.pipe(sourcemap.write())*/,
    gulp.src(dest.css+'main.css')
      /*.pipe(sourcemap.init())*/
  )
  .pipe(concat('all.css'))
  .pipe(gulp.dest(dest.css))
  .pipe(rename({suffix: '.min'}))
  .pipe(postcss([csswring]))
  //.pipe(sourcemap.write())
  .pipe(gulp.dest(dest.css))
  .pipe( notifyOK('CSS') );
});


gulp.task('fonts', function() {
    return gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fonts))
    .pipe( notifyOK('Font') );
});


gulp.task('images', function() {
  return gulp.src(src.images)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dest.images))
    .pipe( notifyOK('Images') );
});


gulp.task('git', function(){
  return gulp.src(src.root)
    .pipe( git.add() );
});


gulp.task('assets', function(){
  exec('./scripts/edx-update-theme.sh', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});


gulp.task('update-edx', function(){
  exec('./scripts/edx-update-plateforme.sh', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});


gulp.task('sauv', function(){
  exec('tar -jcf /edx/app/edxapp/themes/edx-theme_backup_$(date +%Y-%m-%d_%H-%M).tar.bz2 .', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});


// minify new or changed HTML pages
/*gulp.task('html', function() {
  gulp.src(src.templates)
    .pipe(changed(dest.templates))
    .pipe(minifyHTML())
    .pipe(gulp.dest(dest.templates))
    .pipe( notifyOK('HTML') );
});*/


gulp.task( 'default', ['css', 'fonts', 'images'] );

gulp.task( 'cssa', function() {
    runSequence('css', 'assets', function() { });
} );