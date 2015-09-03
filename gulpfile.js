var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var run = require('gulp-run');
var NwBuilder = require('nw-builder');
//setting
var nwjsVersion = "0.12.1";
var isDev = true;
var tsc = function () {
   return run('tsc --out src/main.js src/ts/main.ts').exec();
};
var runNw = function () {
   return run(path.join('cache', nwjsVersion, "win64", "nw.exe") + " src").exec();
};
gulp.task('ts', function () {
    run('tsc --out src/main.js src/ts/main.ts').exec();
});
gulp.task("less", function () {
    if (isDev)
        return gulp.src('./src/less/style.less')
            .pipe(less({
                paths: [path.join(__dirname, 'less', 'includes')]
            }))

            .pipe(gulp.dest('./src/'));
            //.pipe(tsc())
            //.pipe(runNw());
    else
        return gulp.src('./src/less/style.less')
            .pipe(less({
                paths: [path.join(__dirname, 'less', 'includes')]
            }))
            .pipe(minifyCSS())
            .pipe(gulp.dest('./src/'));
});
gulp.task("nwjs", function () {
    var nw = new NwBuilder({
        files: [
            './src/**/*.json',
            './src/**/*.js',
            './src/**/*.css',
            './src/**/*.html'
        ], // use the glob format
        version: nwjsVersion,
        run: './src', // use the glob format
        platforms: ['win64']
    });

//Log stuff you want
    nw.on('log', console.log);

// Build returns a promise
    nw.build().then(function () {
        console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });
});
gulp.task("run", function () {
    run(path.join('cache', nwjsVersion, "win64", "nw.exe") + " src").exec();
});
gulp.task("dev-run", function () {
    run(path.join('cache', nwjsVersion, "win64", "nw.exe") + " src").exec();
});
//gulp.task("default", ["ts", "less", "nwjs"]);
gulp.task("default", ["ts", "less"]);
//gulp.task("default", ["nwjs"]);
//gulp.task("default", ["less"]);