/***********/const fs = require("fs");
/**********/const pug = require("gulp-pug");
/**********/const del = require("del");
/*********/const open = require("gulp-open");
/*********/const data = require("gulp-data");
/*********/const gulp = require("gulp");
/*********/const less = require("gulp-less");
/*********/const path = require("path");
/********/const babel = require("gulp-babel");
/*******/const inject = require("gulp-inject");
/******/const connect = require("gulp-connect");
/******/const flatten = require("gulp-flatten");
/******/const npmDist = require("gulp-npm-dist");
/****/const pugconfig = require("./config/pugconfig.json");
/***/const sourcemaps = require("gulp-sourcemaps");
/**/const babelconfig = require("./config/babelconfig.json");

const names = {
    relative: "./",
    src: "src",
    dist: "dist",
    data: "data",
    config: "config",

    assets: "assets",
    templates: "templates",
    vendor: "vendor",

    less: "less",
    css: "css",

    js: "js",

    all: "/*",
    allDeep: "/**/*",

    ext: {
        json: ".json",
        js: '.js',
        less: '.less',
        pug: '.pug'
    }
};

const paths = {};

paths.data = {
             relative: names.relative + names.data,
    files: { relative: names.relative + path.join(names.data, names.allDeep + names.ext.json) },
      pug: { relative: names.relative + path.join(names.data, "pug.json") }
};

paths.config = {
             relative: names.relative + names.config,
    files: { relative: names.relative + path.join(names.config, names.allDeep + names.ext.json) },
      pug: { relative: names.relative + path.join(names.config, "pugconfig.json") }
};

paths.src = {
                        relative: names.relative + names.src,
              assets: { relative: names.relative + path.join(names.src, names.assets) },
         assetsFiles: { relative: names.relative + path.join(names.src, names.assets, names.allDeep) },
                less: { relative: names.relative + path.join(names.src, names.less) },
           lessFiles: { relative: names.relative + path.join(names.src, names.less, names.all + names.ext.less) },
        lessFilesAll: { relative: names.relative + path.join(names.src, names.less, names.allDeep + names.ext.less) },
                  js: { 
                        relative: names.relative + path.join(names.src, names.js),
                        files: { relative: names.relative + path.join(names.src, names.js, names.allDeep + names.ext.js) },
                      },
           templates: { relative: names.relative + path.join(names.src, names.templates) },
       templateIndex: { relative: names.relative + path.join(names.src, names.templates, "index.pug") },
       templateFiles: { relative: names.relative + path.join(names.src, names.templates, names.all + names.ext.pug) },
    templateFilesAll: { relative: names.relative + path.join(names.src, names.templates, names.allDeep + names.ext.pug) }
};

paths.dist = {
                   relative: names.relative + names.dist,
          index: { relative: names.relative + path.join(names.dist, "index.html") },
         assets: { relative: names.relative + path.join(names.dist, names.assets) },
            css: { relative: names.relative + path.join(names.dist, names.css) },
             js: { relative: names.relative + path.join(names.dist, names.js) },
         vendor: { relative: names.relative + path.join(names.dist, names.vendor) },
    vendorFiles: { relative: names.relative + path.join(names.dist, names.vendor, names.all) }
};

const serverConf = {
    root: paths.dist.relative,
    port: 8000,
    livereload: true
};

function pathFixer(prop) {
    if (typeof prop == 'object') {
        if (prop.hasOwnProperty('relative')) {
            prop.absolute = path.join(__dirname, prop.relative);
            prop.relative = prop.relative.split(/[\\\/]+/).join('/');
        }
        for (let k in prop) {
            pathFixer(prop[k]);
        }
    }
}

pathFixer(paths);

function scripts() {
    return gulp
        .src(paths.src.js.files.absolute)
        .pipe(sourcemaps.init())
        .pipe(babel(babelconfig))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.dist.js.absolute))
        .pipe(connect.reload());
}

function dependecies() {
    const distoptions = {
        excludes: ["source/**/*", "core.js", "*.json", "*.slim.*"]
    };
    return gulp
        .src(npmDist(distoptions), { base: "./node_modules" })
        .pipe(flatten({ includeParents: 0 }))
        .pipe(gulp.dest(paths.dist.vendor.absolute))
        .pipe(connect.reload());
}

function clean() {
    return del([paths.dist.absolute]);
}

function assets() {
    return gulp
        .src(paths.src.assetsFiles.absolute)
        .pipe(gulp.dest(paths.dist.assets.absolute))
        .pipe(connect.reload());
}

function styles() {
    return gulp
        .src(paths.src.lessFiles.absolute)
        .pipe(sourcemaps.init())
        .pipe(
            less({
                paths: [path.join(__dirname, paths.src.less.absolute, "includes")]
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.css.absolute))
        .pipe(connect.reload());
}

function template() {
    return gulp
        .src(paths.src.templateIndex.absolute)
        .pipe(
            data(function (file) {
                return JSON.parse(fs.readFileSync(paths.data.pug.absolute));
            }).on('error', console.log)
        )
        .pipe(pug(pugconfig))
        .pipe(gulp.dest(paths.dist.absolute));
}

function vendor() {
    var vendorPath = gulp.src(paths.dist.vendorFiles.absolute);
    let confs = {
        relative: true,
        removeTags: true
    };
    return gulp
        .src(paths.dist.index.absolute)
        .pipe(inject(vendorPath, confs))
        .pipe(gulp.dest(paths.dist.absolute))
        .pipe(connect.reload());
}

function changed(path, stats) {
    console.log('File ' + path + ' was changed');
}

function watchFiles() {

    gulp.watch(paths.config.files.relative, build).on('change', changed);
    gulp.watch(paths.data.files.relative, html).on('change', changed);
    gulp.watch(paths.src.js.files.relative, scripts).on('change', changed);
    gulp.watch(paths.src.lessFilesAll.relative, styles).on('change', changed);
    gulp.watch(paths.src.assetsFiles.relative, copy).on('change', changed);
    gulp.watch(paths.src.templateFilesAll.relative, html).on('change', changed);

    gulp.src(__filename)
        .pipe(open({ uri: "http://localhost:" + serverConf.port }));

    return connect.server(serverConf);
}

let html = gulp.series(template, vendor);
let compile = gulp.parallel(scripts, styles, html);
let copy = gulp.parallel(dependecies, assets);
let build = gulp.series(copy, compile);
let deploy = gulp.series(clean, build, watchFiles);
let defaults = gulp.series(deploy, watchFiles);

gulp.task('watch', watchFiles);
gulp.task("deploy", deploy);
gulp.task("build", build);
gulp.task("default", defaults);
