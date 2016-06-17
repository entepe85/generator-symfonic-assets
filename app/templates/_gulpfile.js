/* jshint strict: implied */
/*global require, console */
let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),<% if (browserSync) { %>
    browserSync = require('browser-sync').create(),<% } %>
    exec = require('child_process').exec,<% if (useES6) { %>
    babel = require('gulp-babel'),<% } %><% if (useImagemin) { %>
    imagemin = require('gulp-imagemin'),<% } %>
    <% if (usePostCSS) { %>postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    zindex = require('postcss-zindex'),
    focus = require('postcss-focus'),
    calc = require('postcss-calc'),
    cache = require('gulp-cache'),
    flexbugsFixes = require('postcss-flexbugs-fixes'),
    pxToRem = require('postcss-pxtorem'),
    short = require('postcss-short');
    <% } else { %>
    prefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css');
    <% } %>

let paths = {
        scss: {
            master: 'web-src/scss/app.scss',
            watch: 'web-src/scss/**/*.scss',
            dist: 'web/css',
            lint: ['web-src/scss/**/*.scss', '!web-src/scss/app.scss', '!web-src/scss/_css/*.scss', '!web-src/scss/_components/fontawesome/**/*.scss', '!web-src/scss/_components/fontawesome/*.scss', '!web-src/scss/_settings/_mixins.scss']
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
        },
        fonts: {
            src: ['web-src/fonts/*'<% if (useBootstrap) { %>, 'bower/bootstrap-sass/assets/fonts/bootstrap/*'<% } %><% if (useUIKit) { %>, 'bower/uikit/fonts/*'<% } %>]
        }<% if (browserSync) { %>,
        twig: {
            watch: ['src/AppBundle/Resources/views/**/*.html.twig', 'app/Resources/views/**/*.html.twig', 'app/Resources/views/*.html.twig']
        }<% } %><% if (useImagemin) { %>,
        images: {
            src: ['web-src/images/**/*', 'web-src/images/*'],
            dist: 'web/images'
        }
        <% } %>
    }<% if (usePostCSS) { %>,
    plugins = [
        autoprefixer({browsers: ['> 5%', 'last 2 versions', 'Firefox ESR']}),
        calc,
        focus,
        zindex,
        flexbugsFixes,
        pxToRem,
        short,
        cssnano
    ];<% } else { %>;<% } %>


const onError = err => {
    console.log(err);
    process.emit('end');
};

gulp.task('scss', () =>
    gulp.src(paths.scss.master)
        .pipe(sourcemaps.init())
        .pipe(sass(<% if (useBourbon) { %>
            {
                includePaths: [
                    require('bourbon').includePaths,
                    require('bourbon-neat').includePaths
                ]
            }<% } %>))
        .on('error', onError)
        <% if (usePostCSS) { %>.pipe(postcss(plugins))<% } else { %>
        .pipe(prefixer({
          cascade: false,
          browsers: ['last 2 versions', 'Firefox ESR']
        }))
        .pipe(cleanCSS())<% } %>
        .pipe(sourcemaps.write('../sourcemaps', {
            includeContent: false // Otherwise all the CSS would be included
        }))
        .pipe(gulp.dest(paths.scss.dist))
        .pipe(notify('SCSS compiled and minified'))
        <% if (browserSync) { %>.pipe(browserSync.stream({match: '**/*.css'}))<% } %>
);

gulp.task('sass-lint', () =>
    gulp.src(paths.scss.lint)
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
);

gulp.task('fonts', () =>
    gulp.src(paths.fonts.src)
        .pipe(gulp.dest('web/fonts/'))
        .pipe(notify('Fonts copied over, sir.'))
);

gulp.task('adminfiles', () =>
    gulp.src('web-src/admin/*')
        .pipe(gulp.dest('web/admin/'))
        .pipe(notify('Admin files copied over, sir.'))
);

<% if (useImagemin) { %>
gulp.task('images', () =>
    gulp.src(paths.images.src)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(paths.images.dist))
);
<% } %>

gulp.task('clear', function (done) {
    return cache.clearAll(done);
});

gulp.task('jslibs', () =>
    gulp.src(paths.js.libs.src)
        .pipe(concat('libs.all.js'))
        .pipe(cache(uglify({
            mangle: true
        })))
        .on('error', onError)
        .pipe(gulp.dest(paths.js.libs.dist))
        .pipe(notify('JS libs combined'))
);

gulp.task('jsconcat', () =>
    gulp.src(paths.js.src)
        <% if (useES6) { %>.pipe(babel({
            presets: ['es2015']
        }))
        .on('error', onError)<% } %>
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

gulp.task('startup', () =>
    exec('bin/console server:start', function (error, stdout, stderr) {
        if (error) {
            throw error;
        }
        console.log(stdout + stderr);
    }
));

gulp.task('assets', () =>
    exec('bin/console assets:install --symlink', function (error, stdout, stderr) {
        if (error) {
            throw error;
        }
        console.log(stdout + stderr);
    }
));

process.on('SIGINT', () => {
    exec('bin/console server:stop', function (error, stdout, stderr) {
        if (error) {
            throw error;
        }
        console.log(stdout + stderr);
        process.exit();
    });
});

process.on('end', () => {
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
    gulp.watch(paths.scss.watch, file => {
        gulp.src(file.path)
            .on('error', onError)
            .pipe(sassLint())
            .pipe(sassLint.format())
            .pipe(sassLint.failOnError())
    });
    gulp.watch(paths.js.watch, ['jscombine']);
    <% if (browserSync) { %>gulp.watch(paths.twig.watch, () => browserSync.reload());<% } %>
});

gulp.task('default', ['startup', 'assets',<% if (browserSync) { %> 'browser-sync',<% } %> 'fonts', 'adminfiles',<% if (useImagemin) { %> 'images',<% } %> 'scss', 'jscombine', 'watch']);
