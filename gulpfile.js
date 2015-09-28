var gulp = require('gulp'),
    shell = require('gulp-shell');

var PATH = {
    impactNode : './node_modules/impact-node/bin/',
    build : './build/',
    images : './static/media',
    js : './static/js',
    css : './static/css'
}

gulp.task('build', function () {

    // build impact
    return shell.task(PATH.impactNode + 'impact-node build');
});

gulp.task('deploy', function () {

    gulp.start('build');
    gulp.start('copy');
});

gulp.task('copy', function () {

    //copy media to static/media
    gulp.src(PATH.build + '/media/*.png').pipe(gulp.dest(PATH.images));

    //copy js to static/js
    gulp.src(PATH.build + '/**/*.js').pipe(gulp.dest(PATH.js));

    //copy css to static/css
    gulp.src(PATH.build + '/**/*.css').pipe(gulp.dest(PATH.css));
});

gulp.task('default', ['copy']);
