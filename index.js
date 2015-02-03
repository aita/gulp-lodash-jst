'use strict';

var _ = require('lodash');
var gutil = require('gulp-util');
var through2 = require('through2');

var PLUGIN_NAME = 'gulp-lodash-jst';


function compile(file, options) {
  var src = file.contents.toString();
  var template = _.template(src, null, options).source;

  var global = options.global || 'this';
  var namespace = options.namespace || 'JST';

  var name = _.isFunction(options.name) ? options.name(file) : gutil.replaceExtension(file.relative, '');
  name = name.replace(/\\/g, '/');

  var prefix = '(' + global + '[\'' + namespace + '\'] = ' + global + '[\'' + namespace + '\'] || {})'
        + '[\'' + name + '\'] = ';
  var postfix = '';

  var enclose = _.isUndefined(options.enclose) ? true : options.enclose;
  if (enclose) {
    prefix = '(function(){ \n' + prefix;
    postfix = '\n})();';
  }

  return prefix + template + postfix;
}

module.exports = function(options) {
  options = options || {};

  return through2.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    try {
      var compiled = compile(file, options);
      file.contents = new Buffer(compiled);
      file.path = gutil.replaceExtension(file.path, '.js');
    } catch (e) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, e));
    }

    this.push(file);
    return callback();
  });
};
