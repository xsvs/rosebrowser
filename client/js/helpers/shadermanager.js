'use strict';

var SHADER_DATA_PATH = 'shaders/';

function _ShaderManager() {
  this.shaders = {};
  this.materials = {};
  this.waitAll = new MultiWait();
}

_ShaderManager.prototype._loadShader = function(path, callback) {
  var existingShader = this.shaders[path];
  if (existingShader) {
    if (existingShader.shader) {
      callback(existingShader.shader);
    } else {
      existingShader.waiters.push(callback);
    }
    return;
  }

  var newShader = {
    shader: null,
    waiters: [callback]
  };
  this.shaders[path] = newShader;

  var loader = new THREE.XHRLoader();
  loader.load(path, function (data) {
    newShader.shader = data;
    for (var i = 0; i < newShader.waiters.length; ++i) {
      newShader.waiters[i](data);
    }
    newShader.waiters = [];
  });
};

_ShaderManager.prototype.register = function(name, vertShader, fragShader, attributes) {
  var waitAllParts = new MultiWait();

  var vertShaderWait = waitAllParts.one();
  var vertShaderData = null;
  this._loadShader(SHADER_DATA_PATH + vertShader, function(data) {
    vertShaderData = data;
    vertShaderWait();
  });

  var fragShaderWait = waitAllParts.one();
  var fragShaderData = null;
  this._loadShader(SHADER_DATA_PATH + fragShader, function(data) {
    fragShaderData = data;
    fragShaderWait();
  });

  var shaderWait = this.waitAll.one();
  var self = this;
  waitAllParts.wait(function() {
    var shaderMaterial = new THREE.ShaderMaterial({
      attributes: attributes,
      uniforms: [],
      vertexShader: vertShaderData,
      fragmentShader: fragShaderData
    });
    self.materials[name] = shaderMaterial;
    shaderWait();
  });
};

_ShaderManager.prototype.init = function(callback) {
  this.waitAll.wait(callback);
};

_ShaderManager.prototype.get = function(name) {
  return this.materials[name];
};

var ShaderManager = new _ShaderManager();
