var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    server = require('gulp-server-livereload'),
    handlebars = require('gulp-handlebars'),
    declare = require('gulp-declare'),
    wrap = require('gulp-wrap'),
    args = require('yargs').argv,
    gulpif = require('gulp-if'),
    gulpIfElse = require('gulp-if-else'),
    cleanDest = require('gulp-clean-dest'),
    config = require('./config.js');


/**
 * Run livereload server
 */
gulp.task('server', function () {
    gulp.src(config.frontDeploy)
        .pipe(server({
            open: false,
            livereload: {
                defaultFile: 'index.html',
                enable: true,
                filter: function (filePath, cb) {
                    cb(!(/node_modules/.test(filePath)));
                }
            }
        }));
});

/**
 * Compiles all handlebars files
 */
gulp.task('templates', function () {
    return gulp.src(config.frontSrcTemplates)
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Prestame.templates',
            noRedeclare: true, // Avoid duplicate declarations 
        }))
        .pipe(concat('templates.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanDest(config.frontTemplatesDeploy))
        .pipe(gulp.dest(config.frontTemplatesDeploy, {
            overwrite: true
        }));
});

/**
 * Move htmls files to the deploy folder 
 */
gulp.task('html', function () {
    return gulp.src(config.frontSrcHtml + '/**/*.html')
        .pipe(cleanDest(config.frontHtmlDeploy))
        .pipe(gulp.dest(config.frontHtmlDeploy));
});

/**
 * Move all imgages files to the deploy folder 
 */
gulp.task('img', function () {
    return gulp.src(config.frontSrcImgs + '/**/*.*')
        .pipe(cleanDest(config.frontImgsDeploy))
        .pipe(gulp.dest(config.frontImgsDeploy));
});

/**
 * Move all fonts files to the deploy folder 
 */
gulp.task('fonts', function () {
    return gulp.src(config.frontSrcFonts + '/**/*.*')
        .pipe(cleanDest(config.frontFontsDeploy))
        .pipe(gulp.dest(config.frontFontsDeploy));
});

/**
 * Compiles de js files
 */
gulp.task('scripts', ['vendors'], function () {
    return gulp.src([
            config.frontSrcJs + '/**/*.js',
        ])
        .pipe(concat('app.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(args.production, uglify()))
        .pipe(cleanDest(config.frontJsDeploy))
        .pipe(gulp.dest(config.frontJsDeploy));
});

/**
 * Compiles de vendors js files
 */
gulp.task('vendors', function () {
    return gulp.src([
            config.frontSrcLibs + '/jquery/*.js',
            config.frontSrcLibs + '/underscore/*.js',
            config.frontSrcLibs + '/backbone/*.js',
            config.frontSrcLibs + '/backbone.validation/*.js',
            config.frontSrcLibs + '/backbone.stickit/*.js',
            config.frontSrcLibs + '/backbone-fetch-cache/*.js',
            config.frontSrcLibs + '/boostrap/*.js'

        ])
        .pipe(concat('vendors.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(args.production, uglify()))
        .pipe(cleanDest(config.frontSrcLibs))
        .pipe(gulp.dest(config.frontJsDeploy));
});

/**
 * Compiles de scss files
 */
gulp.task('sass', ['css'], function () {
    return sass(config.frontSrcSass + '/**/*.scss', gulpIfElse(args.production, compress, noCompress))
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat('app.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanDest(config.frontSassDeploy))
        .pipe(gulp.dest(config.frontSassDeploy));
});

/**
 * Compiles de scss files
 */
gulp.task('css', function () {
    return gulp.src(config.frontSrcCss + '/**/*.css')
        .pipe(concat('vendors.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(args.production, uglify()))
        .pipe(cleanDest(config.frontCssDeploy))
        .pipe(gulp.dest(config.frontCssDeploy));
});

/* set the style compress on scss files */
function compress() {
    return {
        style: 'compressed'
    };
}

/* set normal style on scss files */
function noCompress() {
    return {};
}

/**
 * Compiles de scss files
 */
gulp.task('watch', function () {
    // Watch .html files
    gulp.watch(config.frontSrcHtml + '/**/*.html', ['html']);
    // Watch .js files
    gulp.watch(config.frontSrcJs + '/**/*.js', ['scripts']);
    // Watch .scss files
    gulp.watch(config.frontSrcSass + '/**/*.scss', ['sass']);
    // Watch css files
    gulp.watch(config.frontSrcSass + '/**/*.css', ['css']);
    // Watch .handlebars files
    gulp.watch(config.frontSrcTemplates + '/**/*.hbs', ['templates']);
});

// Default Task
gulp.task('default', ['scripts', 'sass', 'templates', 'html', 'img', 'fonts', 'server', 'watch']);