# gulp-lodash-jst
gulp plugin that compiles lodash templates

## Install

```
$ npm install --save-dev gulp-lodash-jst
```

## Usage

```js
var gulp = require('gulp');
var jst = require('gulp-lodash-jst');

gulp.task('default', function () {
	return gulp.src('tmpl/*.html')
		.pipe(jst())
		.pipe(gulp.dest('dist'));
});
```
