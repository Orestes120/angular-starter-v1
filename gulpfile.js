const gulp = require('gulp');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sassGlob = require('gulp-sass-glob');
const templateCache = require('gulp-angular-templatecache');

const babelify = require('babelify');
const browserify = require('browserify');
const ngAnnotate = require('browserify-ngannotate');
const browserSync = require('browser-sync').create();
const server = require('karma').Server;
const merge = require('merge-stream');
const pump = require('pump');
const source = require('vinyl-source-stream');

// Where our files are located
const jsFiles = "src/js/**/*.js";
const viewFiles = "src/js/**/*.html";
const styleFiles = "src/style/*.scss";

const fontFiles = ["node_modules/font-awesome/fonts/*",
                   "node_modules/bootstrap/fonts/*"
];
const cssFiles = ["node_modules/bootstrap/dist/css/bootstrap.min.css",
                  "node_modules/font-awesome/css/font-awesome.min.css"
];


let interceptErrors = function(error) {
    let args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};


gulp.task('browserify', ['html', 'views', 'css', 'sass', 'fonts'],
    function() {
        return browserify('./src/js/app.js')
            .transform(babelify, {
                presets: ["es2015"]
            })
            .transform(ngAnnotate)
            .bundle()
            .on('error', interceptErrors)
            //Pass desired output filename to vinyl-source-stream
            .pipe(source('main.js'))
            // Start piping stream to tasks!
            .pipe(gulp.dest('./build/'));
    });

gulp.task('html', function() {
    return gulp.src("src/index.html")
        .on('error', interceptErrors)
        .pipe(gulp.dest('./build/'));
});

gulp.task('views', function() {
    return gulp.src(viewFiles)
        .pipe(templateCache({
            standalone: true
        }))
        .on('error', interceptErrors)
        .pipe(rename("app.templates.js"))
        .pipe(gulp.dest('./src/js/config/'));
});

gulp.task('sass', function() {
    return gulp.src(styleFiles)
        .on('error', interceptErrors)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename("app.css"))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('fonts', function() {
    return gulp.src(fontFiles)
        .on('error', interceptErrors)
        .pipe(gulp.dest('./build/fonts'));
})

gulp.task('css', function() {
    return gulp.src(cssFiles)
        .pipe(gulp.dest('./build/css'));
});

gulp.task('lint', function() {
    return gulp.src([jsFiles, '!node_modules/**',
            '!./src/js/config/app.templates.js'
        ])
        .pipe(eslint({
            configFile: '.eslintrc'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['browserify'], function() {
    var html = gulp.src("build/index.html")
        .pipe(gulp.dest('./dist/'));

    var js = gulp.src("build/main.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));

    return merge(html, js);
});

gulp.task('default', ['lint', 'browserify'], function() {
    browserSync.init(['./build/**/**.**'], {
        server: "./build",
        port: 4000,
        notify: false,
        ui: {
            port: 4001
        },
        middleware: [
            {
                route: "/api",
                handle: function(req, res, next) {
                    res.end('\n\nHello, world!\n\n');
                    return next();
                }
            }
        ]
    });

    gulp.watch("src/index.html", ['html']);
    gulp.watch(viewFiles, ['views']);
    gulp.watch(styleFiles, ['browserify']);
    gulp.watch(jsFiles, ['lint', 'browserify']);
});

// Test
gulp.task('test', function(done){
    new server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() { done(); }).start();
});