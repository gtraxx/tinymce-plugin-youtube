var gulp = require("gulp"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    uglify = require("gulp-uglify"),
    minifyCss = require("gulp-minify-css"),
    zip = require("gulp-zip");

/**
 * Remove dist directory
 */
gulp.task("clean", function () {
    return gulp.src("dist", {read: false}).pipe(clean());
});

/**
 * concat and minimy js
 */
gulp.task("js", function () {
    return gulp
        .src(["js/vendor/**/*", "!js/vendor/jquery.js", "js/*"])
        .pipe(concat("main.js"))
        .pipe(uglify({preserveComments: "some"}))
        .pipe(gulp.dest("tmp/js/"));
});

/**
 * generate plugin.min.js
 */
gulp.task("plugin", function () {
    return gulp
        .src("plugin.js")
        .pipe(uglify({preserveComments: "some"}))
        .pipe(rename("plugin.min.js"))
        .pipe(gulp.dest("tmp/"));
});

/**
 * Concat and minify CSS
 */
gulp.task("css", function () {
    return gulp
        .src(["css/bootstrap.min.css", "css/bootstrap-theme.min.css", "css/youtube.css"])
        .pipe(concat("styles.css"))
        .pipe(minifyCss())
        .pipe(gulp.dest("tmp/css/"));
});

/**
 * html file: replace css and js by minified files
 */
gulp.task("html", function () {
    return gulp
        .src("youtube.html")
        // remove css
        .pipe(replace(/(\r\n|\n|\r)\s*<link href[^>]*>/ig, function () {
            return "";
        }))
        .pipe(replace(/<\/title>(\r\n|\n|\r)/i, function (match) {
            return match + '    <link href="./css/styles.css" rel="stylesheet">\r\n'
        }))
        // remove js
        .pipe(replace(/(\r\n|\n|\r)\s*<script\ssrc="\.(.*)"><\/script>/ig, function (match, file) {
            if (file.match("jquery.min.js")) {
                return match; // don't modify this include
            } else {
                return "";
            }
        }))
        // add concat js file
        .pipe(replace("</head>", '  <script src="./js/main.js"></script>\r\n</head>'))
        .pipe(gulp.dest("tmp/"));
});

/**
 * Build distribuable package
 **/
gulp.task("dist", ["clean", "html", "css", "js", "plugin"], function () {
    return gulp
        .src([
            "img/**/*",
            "view/**/*",
            "langs/**/*",
            "js/main.js",
            "tmp/**/*",
            "js/vendor/jquery.js",
            "LICENCE",
            "plugin.js",
            "README.md"
        ], {base: "."})
        .pipe(rename(function (path) {
            path.dirname = "youtube/" + path.dirname.replace(/^tmp\/*/, "");
        }))
        .pipe(zip("youtube.zip"))
        .pipe(gulp.dest("dist/"))
});

/**
 * Build and remove temps
 */
gulp.task("default", ["dist"],  function () {
    return gulp.src("tmp", {read: false}).pipe(clean());
});