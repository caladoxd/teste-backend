const { builtinModules, Module } = require("module");

var secret = Buffer.from('secret-for-back-end-test').toString('base64');
module.exports = secret;