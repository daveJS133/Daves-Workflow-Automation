var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require ('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('default', ['styles'], ['lint'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint']);
	gulp.watch('/index.html', ['copy-html']).on('change', browserSync.reload);

	browserSync.init({
		server: './dist'
	});
});

gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths. 
	// So, it's best to have gulp ignore the directory as well. 
	// Also, Be sure to return the stream from the task; 
	// Otherwise, the task may end before the stream has finished. 
	return gulp.src(['**/*.js','!node_modules/**'])
		// eslint() attaches the lint output to the "eslint" property 
		// of the file object so it can be used by other modules. 
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console. 
		// Alternatively use eslint.formatEach() (see Docs). 
		.pipe(eslint.format())
	// To have the process exit with an error code (1) on 
		// lint error, return the stream and pipe to failAfterError last. 
		.pipe(eslint.failAfterError());
});

gulp.task('test-js', function (){
	gulp.src('tests/spec/front.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'frontJs/**/*.js'
		}));
});

gulp.task('test-node', function (){
	gulp.src('tests/spec/back.js')
		.pipe(jasmine({
			integration: false,
			vendor: 'backJs/**/*.js'
		}));
});

gulp.task('scripts', function(){
	gulp.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-dist', function(){
	gulp.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-html', function(){
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-images', function(){
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});