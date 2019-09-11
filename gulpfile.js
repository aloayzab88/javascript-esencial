// Plugins

const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const poststylus = require('poststylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssmqpacker = require('css-mqpacker');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const include = require("gulp-include");
const terser = require('gulp-terser');
const tinypng = require('gulp-tinypng-compress');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const ext_replace = require('gulp-ext-replace');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const wait = require('gulp-wait');
const cheerio = require('gulp-cheerio');
const reload = browserSync.reload;

// Paths

var directory = {
    source: 'source',
    dest: 'site'
}

var path = {

    html: {
        views: [directory.source + '/pug/views/**/*.pug'],
        templates: [directory.source + '/pug/templates/**/*.pug'],
        includes: [directory.source + '/pug/includes/**/*.pug'],
        dest: directory.dest
    },
    css: {
        stylus: [directory.source + '/stylus/*.styl'],
        allStylus: [directory.source + '/stylus/**/*.styl'],
        scss: [directory.source + '/scss/*.scss'],
        allScss: [directory.source + '/scss/**/*.scss'],
        dest: directory.dest + '/css/'
    },
    js: {
        js: [directory.source + '/js/*.js'],
        mainJS: [directory.source + '/js/*.js'],
        dest: directory.dest + '/js/'
    },
    fonts: {
        all: [directory.source + '/fonts/**/*.*'],
        dest: directory.dest + '/fonts/'
    },
    images: {
        images: [directory.source + '/images/**/*.{jpg,png}'],
        icons: [directory.source + '/images/icons/*.svg'],
        svgs: [directory.source + '/images/**/*.svg', '!' + directory.source + '/images/icons/*.svg'],
        dest: directory.dest + '/images/',
        destIcons: directory.dest + '/images/icons/'
    }
}

// Tasks

// Server

gulp.task('webserver', function () {
    browserSync.init({
        server: {
            baseDir: directory.dest
        }
    });
});

// Pug

gulp.task('views', function buildViews() {
    return gulp.src(path.html.views)
        .pipe(plumber({
            errorHandler:
                notify.onError("Error: <%= error.message %>"),
            sound: false
        }))
        .pipe(changed(path.html.dest, { extension: '.html' }))
        .pipe(pug({ pretty: '    ' }))
        .pipe(gulp.dest(path.html.dest))
        .pipe(notify({
            message: '<%= file.relative %> completed.',
            sound: false,
            onLast: true
        }));
});

gulp.task('all-pug', function buildHTML() {
    return gulp.src(path.html.views)
        .pipe(plumber({
            errorHandler:
                notify.onError("Error: <%= error.message %>"),
            sound: false
        }))
        .pipe(pug({ pretty: '    ' }))
        .pipe(gulp.dest(path.html.dest))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({
            message: 'Site updated.',
            sound: false,
            onLast: true
        }));
});

// Stylus

gulp.task('stylus', function buildCss() {
    return gulp.src(path.css.stylus)
        .pipe(plumber({
            errorHandler:
                notify.onError("Error: <%= error.message %>"),
            sound: false
        }))
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [
                poststylus(['autoprefixer', 'css-mqpacker'])
            ]
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.css.dest))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({
            message: 'CSS completed.',
            sound: false,
            onLast: true
        }));
});

// Scss

gulp.task('scss', function buildCss() {
    var plugins = [
        autoprefixer(),
        cssmqpacker({
            sort: true
        })
    ];
    return gulp.src(path.css.scss)
        .pipe(wait(500))
        .pipe(plumber({
            errorHandler:
                notify.onError("Error: <%= error.message %>"),
            sound: false
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.css.dest))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({
            message: 'CSS completed.',
            sound: false,
            onLast: true
        }));
});

// JS

gulp.task('js', function () {
    return gulp.src(path.js.js)
        .pipe(plumber({
            errorHandler:
                notify.onError("Error: <%= error.message %>"),
            sound: false
        }))
        .pipe(sourcemaps.init())
        .pipe(include({
            extensions: "js",
            hardFail: true,
            includePaths: [
                __dirname + "/node_modules"
            ]
        }))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.js.dest))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({
            message: 'JS completed.',
            sound: false,
            onLast: true
        }));
});

// Fuentes

gulp.task('fonts', function () {
    return gulp.src(path.fonts.all)
        .pipe(gulp.dest(path.fonts.dest))
        .pipe(notify({
            message: 'Fonts ready.',
            sound: false,
            onLast: true
        }));
});

// Images

gulp.task('images', function () {
    return gulp.src(path.images.images)
        .pipe(tinypng({
            key: 'Z21qZlD7lr4MRVkieMTG4iptHj5Qahjr',
            sigFile: 'source/images/.tinypng-sigs',
            log: true,
            summarise: true
        }))
        .pipe(gulp.dest(path.images.dest))
        .pipe(notify({
            message: 'Images completed.',
            sound: false,
            onLast: true
        }));
});

// SVGs

gulp.task('svgs', function () {
    return gulp.src(path.images.svgs)
        .pipe(svgmin(function (file) {
            return {
                plugins: [{
                    removeComments: true
                }]
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                if ($('[viewBox]').length == 0) {
                    let width = $('svg').attr('width');
                    let height = $('svg').attr('height');
                    let viewBox = '0 0 ' + width + ' ' + height;
                    $('svg').attr('viewBox', viewBox);
                } else if ($('[viewBox]').length && $('[width]').length == 0 && $('[height]').length == 0 ) {
                    let viewBox = $('svg').attr('viewBox');
                    let splitViewBox = viewBox.split(' ');
                    $('svg').attr('width', splitViewBox[2]);
                    $('svg').attr('height', splitViewBox[3]);
                }
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(gulp.dest(path.images.dest))
        .pipe(notify({
            message: 'Svgs completed.',
            sound: false,
            onLast: true
        }));
});

// Icons

gulp.task('icons', function () {
    return gulp.src(path.images.icons)
        .pipe(svgmin(function (file) {
            return {
                plugins: [{
                    removeDoctype: true
                }, {
                    removeComments: true
                }]
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                if ($('[viewBox]').length == 0) {
                    let width = $('svg').attr('width');
                    let height = $('svg').attr('height');
                    let viewBox = '0 0 ' + width + ' ' + height;
                    $('svg').attr('viewBox', viewBox);
                } else if ($('[viewBox]').length && $(['width']).length == 0 && $(['height']).length == 0) {
                    let viewBox = $('svg').attr('viewBox');
                    let splitViewBox = viewBox.split(' ');
                    $('svg').attr('width', splitViewBox[2]);
                    $('svg').attr('height', splitViewBox[3]);
                }                
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore())
        .pipe(rename('icons.svg'))
        .pipe(gulp.dest(path.images.destIcons))
        .pipe(notify({
            message: 'Icons compiled.',
            sound: false,
            onLast: true
        }));
});

// LPs PHP

gulp.task('php', function buildHTML() {
    return gulp.src(path.html.includes)
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(ext_replace('.php'))
        .pipe(gulp.dest(path.html.dest))
        .pipe(notify({
            message: 'PHP completed.',
            sound: false,
            onLast: true
        }));
});

// Watch

gulp.task('watch', function watch() {
    gulp.watch(path.html.views, ['views']);
    gulp.watch([path.html.templates, path.html.includes], ['all-pug']);
    gulp.watch(path.css.allStylus, ['stylus']);
    gulp.watch(path.css.allScss, ['scss']);
    gulp.watch(path.js.js, ['js']);
    gulp.watch(directory.dest + '/*.html').on('change', browserSync.reload);
    gulp.watch(directory.dest + '/images/**/*').on("change", reload);
});

gulp.task('default', ['webserver', 'watch']);