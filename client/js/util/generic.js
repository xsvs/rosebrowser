'use strict';

function enumToName(list, val) {
  for (var i in list) {
    if (list.hasOwnProperty(i)) {
      if (list[i] === val) {
        return i;
      }
    }
  }
  return 'unknown:' + val;
}

function hrTime() {
  return (new Date()).getTime();
}

var clientParams = [];
if (window.location.hash.length > 1) {
  clientParams = window.location.hash.substr(1).split(',');
}


function debugValidateProps(obj, props) {
  for (var i = 0; i < props.length; ++i) {
    var propVal = eval('obj.' + props[i][0]);
    if (propVal === undefined) {
      console.warn('Expected property to be set: ', props[i][0]);
      console.trace();
      continue;
    }
    if (props[i][1] && propVal < props[i][1] ||
        props[i][1] && propVal > props[i][1]) {
      console.warn('Expected property', props[i][0], 'to be between', props[i][1], 'and', props[i][1], '(got:' + propVal + ')');
      console.trace();
      continue;
    }
  }
}


function normalizePath(path) {
  path = path.replace(/\\/g, '/');
  path = path.replace(/\/\//g, '/');
  return path;
}


function MultiWait() {
  this.count = 0;
  this.callback = null;

  var self = this;
  this.waitFn = function() {
    self.count--;
    if (self.count === 0 && self.callback) {
      self.callback();
    }
  };
}
MultiWait.prototype.one = function() {
  this.count++;
  return this.waitFn;
};
MultiWait.prototype.wait = function(callback) {
  if (this.count === 0) {
    if (callback) {
      callback();
    }
  } else {
    this.callback = callback;
  }
};
