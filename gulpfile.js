var gulp = require('gulp');
var sass = require('gulp-sass');
var jeditor = require("gulp-json-editor");
var rename = require('gulp-rename');
var replace = require('gulp-string-replace');
sass.compiler = require('node-sass');

function env() {
  if (process.env.ENV === 'production') return 'production';
  return 'development';
}

function paths() {
  if (env() === 'production') {
    return {
      target: 'dist',
      assetsPath: 'https://cdn2.hubspot.net/hubfs/'+process.env.PORTALID+'/assets'
    };
  }
  return {
    target: 'dev/designs/Custom',
    assetsPath: '/file_manager/Custom/assets',
  };
}

gulp.task('templates', function () {
  return gulp.src('src/templates/**/*.html')
  .pipe(replace('/assets', paths().assetsPath))
  .pipe(gulp.dest(paths().target + '/templates'));
});

gulp.task('assets', function(next) {
  if (env() !== 'production') {
    return gulp.src('src/assets/**/*').pipe(gulp.dest(paths().target + '/assets'));
  } else {
    next();
  }
});

gulp.task('assets', function(next) {
  if (env() !== 'production') {
    return gulp.src('src/assets/**/*').pipe(gulp.dest(paths().target + '/assets'));
  } else {
    return gulp.src('src/assets/**/*').pipe(gulp.dest('distAssets'));
  }
});

gulp.task('globalscss', function() {
  return gulp.src('src/global.scss')
  .pipe(replace('/assets', paths().assetsPath))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(
    (env() !== 'production') 
    ? paths().target + '/assets'
    : 'distAssets'
  ));
})

gulp.task('modules:html', function() {
  return gulp.src('src/modules/**/*.html')
  .pipe(replace('/assets', paths().assetsPath))
  .pipe(gulp.dest(paths().target + '/modules'));
});

gulp.task('modules:css', function() {
  return gulp.src('src/modules/**/*.css').pipe(gulp.dest(paths().target + '/modules'));
});

gulp.task('modules:scss', function() {
  return gulp.src('src/modules/**/*.scss')
  .pipe(replace('/assets', paths().assetsPath))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(paths().target + '/modules'));
})

gulp.task('modules:js', function() {
  return gulp.src('src/modules/**/*.js').pipe(gulp.dest(paths().target + '/modules'));
});

gulp.task('modules:fields', function() {
  return gulp.src('src/modules/**/fields.json').pipe(gulp.dest(paths().target + '/modules'));
});

gulp.task('modules:meta', function() {
  return gulp.src('src/modules/**/meta.json')
  .pipe(jeditor(
    (env() === 'development') ? 
    {
      'id': Math.floor(Math.random() * 10000000000000), // workaround to make module work with local server. Module id should not be in production build
    }
    : {}
  ))
  .pipe(gulp.dest(paths().target + '/modules'));
});

gulp.task('modules:json', gulp.series('modules:fields', 'modules:meta'));

gulp.task('modules', gulp.series('modules:html', 'modules:css', 'modules:scss', 'modules:js', 'modules:json'));

/* Creates a new module */
/* usage: gulp modules.new --name <module_name> */
gulp.task('modules.new', function() {
  var name = process.argv[process.argv.length - 1];
  return gulp.src('templates/module/*').pipe(gulp.dest('src/modules/'+name+'.module'));
});

/* Creates a new template */
/* usage: gulp templates.new --name <template_name> */
gulp.task('templates.new', function() {
  var name = process.argv[process.argv.length - 1];
  return gulp.src('templates/template.html').pipe(rename(name+'.html')).pipe(gulp.dest('src/templates'));
});


gulp.task('watch', function () {
  gulp.watch('src/modules/**/*', gulp.series('modules'));
  gulp.watch('src/templates/**/*.html', gulp.series('templates'));
  gulp.watch('src/assets', gulp.series('assets'));
  gulp.watch('src/scss/**/*', gulp.series('globalscss'));
  gulp.watch('src/global.scss', gulp.series('globalscss'));
});

gulp.task('build', gulp.series('templates', 'assets', 'globalscss', 'modules'));