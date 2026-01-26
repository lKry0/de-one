const { src, dest, watch, parallel, series } = require('gulp');

// Плагины
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const newer = require('gulp-newer');
const include = require('gulp-include');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');

// Переменная окружения
let isProd = false; // dev режим по умолчанию

// Обработчик ошибок
const errorHandler = (title) => {
    return plumber({
        errorHandler: notify.onError({
            title: title,
            message: 'Error: <%= error.message %>',
            sound: false
        })
    });
};

// HTML
function pages() {
    return src('app/pages/*.html')
        .pipe(errorHandler('HTML Error'))
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream());
}

// Fonts
function fonts() {
    // Конвертация в woff и ttf
    return src('app/fonts/src/*.*')
        .pipe(errorHandler('Fonts Error'))
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(dest('app/fonts'))
        .pipe(src('app/fonts/src/*.ttf')) // берём только ttf из src
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'));
}

// Изображения
function images() {
    return src(['app/images/src/*.*', '!app/images/src/*.svg'], { encoding: false })
        .pipe(errorHandler('Images Error'))
        .pipe(newer('app/images'))
        .pipe(avif({ quality: 50 }))
        .pipe(dest('app/images'))

        .pipe(src(['app/images/src/*.*', '!app/images/src/*.svg'], { encoding: false }))
        .pipe(newer('app/images'))
        .pipe(webp())
        .pipe(dest('app/images'))

        .pipe(src(['app/images/src/*.*', '!app/images/src/*.svg'], { encoding: false }))
        .pipe(newer('app/images'))
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 80, progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('app/images'));
}

// SVG копирование
function svgCopy() {
    return src('app/images/src/*.svg')
        .pipe(newer('app/images'))
        .pipe(dest('app/images'));
}

// JavaScript
function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js', // можно добавить библиотеки
        'app/js/navigation.js',
        'app/js/main.js'
    ])
        .pipe(errorHandler('JS Error'))
        .pipe(gulpif(!isProd, sourcemaps.init()))
        .pipe(concat('main.min.js'))
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

// Стили
function styles() {
    return src('app/scss/style.scss')
        .pipe(errorHandler('SCSS Error'))
        .pipe(gulpif(!isProd, sourcemaps.init()))
        .pipe(scss({ 
            outputStyle: isProd ? 'compressed' : 'expanded'
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

// Просмотр файлов
function watching() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false, // отключаем уведомления browser-sync
        open: true
    });
    
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/images/src/**/*.*'], series(images, svgCopy));
    watch(['app/pages/**/*.html', 'app/components/**/*.html'], pages);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
    watch(['app/fonts/src/*.*'], fonts);
}

// Очистка dist
function cleanDist() {
    return del('dist');
}

// Сборка в production
function building() {
    return src([
        'app/css/style.min.css',
        'app/images/**/*.*',
        '!app/images/src/**/*.*',
        'app/fonts/*.*',
        '!app/fonts/src/**/*.*',
        'app/js/main.min.js',
        'app/**/*.html',
        '!app/pages/**/*.*',
        '!app/components/**/*.*'
    ], { base: 'app', encoding: false })
        .pipe(dest('dist'));
}

// Установка production режима
function setProduction(done) {
    isProd = true;
    done();
}

// Экспорт задач
exports.styles = styles;
exports.images = images;
exports.svgCopy = svgCopy;
exports.fonts = fonts;
exports.pages = pages;
exports.scripts = scripts;
exports.watching = watching;
exports.cleanDist = cleanDist;

// Основные команды
exports.build = series(setProduction, cleanDist, parallel(styles, scripts, images, svgCopy, fonts, pages), building);
exports.default = series(parallel(styles, scripts, images, svgCopy, pages), watching);