/* jshint strict: implied */
/*global require, console */
let gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),<% if (browserSync) { %>
    browserSync = require('browser-sync').create(),<% } %>
    exec = require('child_process').exec,<% if (useES6) { %>
    babel = require('gulp-babel'),<% } %>
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    zindex = require('postcss-zindex'),
    focus = require('postcss-focus'),
    calc = require('postcss-calc'),
    flexbugsFixes = require('postcss-flexbugs-fixes'),
    pxToRem = require('postcss-pxtorem'),
    short = require('postcss-short');

let paths = {
        scss: {
            master: 'web-src/scss/app.scss',
            watch: 'web-src/scss/**/*.scss',
            dist: 'web/css'
        },
        js: {
            libs: {
                src: [<% if (useUIKit || useBootstrap || useJQuery) { %>'bower/jquery/dist/jquery.min.js', <% } %><% if (useUIKit) { %>'bower/uikit/js/uikit.min.js', <% } %><% if (useBootstrap) { %>'bower/bootstrap-sass/assets/javascripts/bootstrap.min.js', <% } %> 'web-src/js/libs/*.js'],
                dist: 'web-src/js/dist'
            },
            src: <% if (useES6) { %>'web-src/es6/*.js'<% } else { %>'web-src/js/*.js'<% } %>,
            watch: <% if (useES6) { %>'web-src/es6/*.js'<% } else { %>'web-src/js/*.js'<% } %>,
            dist: 'web-src/js/dist',
            app: {
                src: 'web-src/js/dist/*.js',
                dist: 'web/js'
            }
        }<% if (browserSync) { %>,
        twig: {
            watch: ['app/Resources/views/**/*.html.twig', 'app/Resources/views/*.html.twig']
        }<% } %>
    },
    plugins = [
        autoprefixer({browsers: ['> 1%']}),
        calc,
        focus,
        zindex,
        flexbugsFixes,
        pxToRem,
        short,
        cssnano
    ];


const onError = err => {
    console.log(err);
    this.emit('end');
};

gulp.task('scss', () =>
    gulp.src(paths.scss.master)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', onError)
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('../sourcemaps', {
            includeContent: false // Otherwise all the CSS would be included
        }))
        .pipe(gulp.dest(paths.scss.dist))
        .pipe(notify('SCSS compiled and minified'))
        <% if (browserSync) { %>.pipe(browserSync.stream({match: '**/*.css'}))<% } %>
);

gulp.task('fonts', () =>
    gulp.src('web-src/fonts/*')
        .pipe(gulp.dest('web/fonts/'))
        .pipe(notify('Fonts copied over, sir.'))
);

gulp.task('adminfiles', () =>
    gulp.src('web-src/admin/*')
        .pipe(gulp.dest('web/admin/'))
        .pipe(notify('Admin files copied over, sir.'))
);

gulp.task('jslibs', () =>
    gulp.src(paths.js.libs.src)
        .pipe(concat('libs.all.js'))
        .pipe(uglify({
            mangle: true
        }))
        .on('error', onError)
        .pipe(gulp.dest(paths.js.libs.dist))
        .pipe(notify('JS libs combined'))
);

gulp.task('jsconcat', () =>
    gulp.src(paths.js.src)
        <% if (useES6) { %>.pipe(babel({ 
            presets: ['es2015']
        }))<% } %>
        .pipe(concat('script.all.js'))
        .pipe(uglify({
            mangle: true
        }))
        .on('error', onError)
        .pipe(gulp.dest(paths.js.dist))
);

gulp.task('jscombine', ['jsconcat'], () =>
    gulp.src(paths.js.app.src)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.js.app.dist))
        .on('error', onError)
        .pipe(notify('JS combined'))
        <% if (browserSync) { %>.pipe(browserSync.stream({match: '**/app.js'}))<% } %>
);

<% if (browserSync) { %>
gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: 'localhost:8000'
    });
});
<% } %>

gulp.task('startup', () => {
    exec('bin/console server:start', function (error, stdout, stderr) {
        if (error) {
            throw error;
        }
        console.log(stdout + stderr);
    });
});

process.on('SIGINT', () => {
    exec('bin/console server:stop', function (error, stdout, stderr) {
        if (error) {
            throw error;
        }
        console.log(stdout + stderr);
        process.exit();
    });
});

gulp.task('watch', ['scss'], () => {
    gulp.watch(paths.scss.watch, ['scss']);
    gulp.watch(paths.js.watch, ['jscombine']);
    <% if (browserSync) { %>gulp.watch(paths.twig.watch, () => browserSync.reload());<% } %>
});

gulp.task('default', ['startup', <% if (browserSync) { %>'browser-sync',<% } %> 'fonts', 'adminfiles', 'scss', 'jslibs', 'jscombine', 'watch']);
