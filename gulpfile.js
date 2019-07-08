const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const sm = require("gulp-sourcemaps");
const del = require("del");
const path = require("path");
gulp.task("build", function() {
    del.sync("dist/**");
    return gulp.src("src/**/*.ts")
        .pipe(sm.init())
        .pipe(tsProject())
        .pipe(sm.write({ sourceRoot: path.resolve(__dirname, "src") }))
        .pipe(gulp.dest("dist"))
});