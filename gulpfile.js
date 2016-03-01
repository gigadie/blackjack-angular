// jscs:disable
'use strict';

// Gulp plugins
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	del = require('del'),
	browserify = require('browserify'),
	uglify = require('gulp-uglify'),
	minify = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	source = require('vinyl-source-stream'),
	gutil = require('gulp-util'),
	buffer = require('vinyl-buffer'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	gulpif = require('gulp-if'),
	template = require('gulp-template'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence');

// Config
var now = new Date();
var config = {
	buildLabel: '' + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds(),
	buildMode: null
};

// Karma Server instance
var KarmaServer = require('karma').Server;

// JSHint task
gulp.task('lint', function() {
	return gulp.src('./js/*.js')
		.pipe(jshint())
		// You can look into pretty reporters as well, but that's another story
		.pipe(jshint.reporter('default'));
});

// Clean task
gulp.task('clean', function () {
	return del([
		'./dist/*',
		'./dist/**/*'
	]);
});
// Clean css
gulp.task('clean:css', function () {
	return del([
		'./dist/css/**/*',
		'./dist/fonts/**/*'
	]);
});
// Clean AngularJS
gulp.task('clean:js', function () {
	return del([
		'./dist/js/*',
		'./dist/js/**/*'
	]);
});
// Clean HTML
gulp.task('clean:html', function () {
	return del(['./dist/*.html']);
});

// Config tasks
gulp.task('config:dev', function() {
	config.buildMode = 'dev';
});

gulp.task('config:production', function() {
	config.buildMode = 'production';
});

// Build JavaScript
gulp.task('build:js', function() {
	// set up the browserify instance on a task basis
	var b = browserify({
		entries: './js/main.js',
		debug: true
	});

	console.log('AngJS build version: ' + config.buildMode);
	return b.bundle()
		.pipe(source('angularjs.all.js'))
		.pipe(buffer())
		//.pipe(cachebust.resources())
		.pipe(sourcemaps.init({loadMaps: true}))
		// Add transformation tasks to the pipeline here.
			// Minified by Task: build:js
			// only if in production UGLIFY
			.pipe(gulpif(config.buildMode === 'production', uglify()))
			.on('error', function(error) {
				console.log(error);
				gutil.log(error);
			})
		.pipe(sourcemaps.write('./maps/'))
		.pipe(gulp.dest('./dist/js/'));
});

// Views task
gulp.task('build:html', function() {
	// Any other view files from views
	return gulp.src(['./js/*.html', './js/**/*.html'], {base: '.'})
		// Will be put in the dist/ folder keeping folder structure
		.pipe(gulp.dest('./dist/'));
});

// Resources task, Angular
gulp.task('build:res', function() {
	// Angular project resources
	return gulp.src(['./img/*', './img/**/*'], {base: '.'})
		// Will be put in the dist/ folder keeping folder structure
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build:css', function() {
	// Copy font files
	gulp.src(['./node_modules/mdi/fonts/*', './node_modules/mdi/fonts/**/*'], {
			base: './node_modules/mdi/fonts/'
		})
		.pipe(gulp.dest('./dist/fonts/'));

	// Process SASS stylesheets
	return gulp.src('./css/main.scss')
		// The onerror handler prevents Gulp from crashing when you make a mistake in your LESS/SASS
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass({onError: function(e) { console.log(e); } }))
		.pipe(minify())
		// Optionally add autoprefixer
		.pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
		.pipe(rename('angularjs.css'))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./dist/css/'));
});

// Build task
gulp.task('build:indexfile', function() {
	return gulp.src('./index.html')
		// And put it in the dist folder
		.pipe(template({
			buildLabel: config.buildLabel
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build:del:tempfiles', function() {
	// Delete angular and extjs build file, we have the ones with locale
	return del([
			'./dist/js/index.angularjs.js',
			'./dist/js/maps/index.angularjs.js.map'
		], {force: true});
});

// build for development
gulp.task('build:dev', function() {
	runSequence(
		['clean', 'config:dev'],
		['build:res'],
		['build:css', 'lint', 'build:js', 'build:html', 'build:indexfile'],
		['build:del:tempfiles']
	);
});

//  build for production
gulp.task('build:production', function() {
	runSequence(
		['clean', 'config:production'],
		['build:res'],
		['build:css', 'lint', 'build:js', 'build:html', 'build:indexfile'],
		['build:del:tempfiles']
	);
});

// Build for watch (DEV MODE ONLY)
gulp.task('build:watch:js', function() {
	runSequence(
		['clean:js', 'clean:html', 'config:dev'],
		['build:js'],
		['build:html'],
		['build:indexfile'],
		['build:del:tempfiles'],
		function() {
			console.log('[DONE] JS build finished. Reload (F5) now!');
		}
	);
});
gulp.task('build:watch:css', function() {
	runSequence(
		['clean:css', 'clean:html', 'config:dev'],
		['build:css'],
		['build:indexfile'],
		['build:del:tempfiles'],
		function() {
			console.log('[DONE] CSS build finished');
		}
	);
});

// Watchers for angular
gulp.task('watch', ['build:watch:js', 'build:watch:css'], function() {
    gulp.watch([
		'./index.html',
		'./js/**/*.html',
		'./js/*.js',
		'./js/**/*.js'
	], ['build:watch:js']);
	gulp.watch([
		'./css/**/*.scss'
	], ['build:watch:css']);
});

// Test task, single run and exit
gulp.task('test', function(done) {
	del(['./coverage']);

	new KarmaServer({
		configFile: __dirname + '/karma.conf.unit.js',
		singleRun: true
	}, done).start();
});

// Test task, continuous testing
gulp.task('tdd', function(done) {
	del(['./coverage']);

	new KarmaServer({
		configFile: __dirname + '/karma.conf.unit.js'
	}, done).start();
});

// Default task builds and starts watching
gulp.task('default', ['watch']);
