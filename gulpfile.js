const gulp = require('gulp');
const del = require('del');
const async = require('async');
const fs = require('fs-extra')
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const tslint = require('gulp-tslint');
const request = require('request');
const reload = browserSync.reload;
const replace = require("replace");

var tsProject = typescript.createProject('tsconfig.json');

const paths = {
    dist: 'out',
    distFiles: 'out/**/*',
    srcFiles: 'src/**/*',
    srcTsFiles: 'src/**/*.ts',
}

function downloadAsset(cb) {
    request.get({
        url: 'https://proxyconnection.touch.dofus.com/assetMap.json',
        forever: true
    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            let bodyParse = JSON.parse(body);

            async.each(bodyParse.files, function (file, callback) {
                downloadBinary('https://proxyconnection.touch.dofus.com/' + file.filename, './game/' + file.filename, callback)
            }, function (err) {

                if (err) {
                    console.log('A file failed to process');
                    cb();
                } else {
                    console.log('All files have been processed successfully');
                    cb();
                }
            });
        } else {
            console.error(error);
            cb(error);
        }
    });
}


function downloadBinary(uri, savePath, callback) {
    fs.ensureFile(savePath, function (err) {
        request.head(uri, function (error, response, body) {
            request(uri).pipe(fs.createWriteStream(savePath)).on('close', callback);
        });
    });
}

gulp.task('game', function (cb) {

    async.parallel([
        function (callback) {
            downloadBinary('https://proxyconnection.touch.dofus.com/build/script.js', './game/script.js', callback);
            
        },
        function (callback) {
            downloadBinary('https://proxyconnection.touch.dofus.com/build/styles-native.css', './game/style-native.css', function () {
                replace({
                    regex: "cdvfile://localhost/persistent/data/assets",
                    replacement: "assets",
                    paths: ['./game/style-native.css'],
                    recursive: true,
                    silent: true,
                });
                callback();
            });
        },
        function (callback) {
            downloadAsset(cb)
        }
    ], function (err, result) {
        cb();
    });
});

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del(paths.distFiles);
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function () {
    return gulp.src([paths.srcFiles, '!' + paths.srcTsFiles])
        .pipe(gulp.dest(paths.dist))
});


// TypeScript compile
gulp.task('compile', ['clean'], function () {
    // load the tsconfig each time as it changes!
    //const tscConfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'UTF8'));
    /*return gulp
        .src(paths.srcTsFiles)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist));*/
    /*return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(paths.dist));*/

    let tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());


    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist));


});

// linting
gulp.task('tslint', function () {
    /*return gulp.src(paths.srcTsFiles)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));*/
});

// Run browsersync for development
gulp.task('serve', ['build'], function () {
    /*browserSync({
        server: {
            baseDir: ''
        },
        ghostMode: false,
        startPath: '/build/browser'
    });*/

    gulp.watch(paths.srcFiles, ['buildAndReload']);
});

gulp.task('build', ['tslint', 'clean', 'compile', 'copy:assets']);
gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);
