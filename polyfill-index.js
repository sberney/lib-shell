require('@babel/polyfill');
const register = require('@babel/register');

register({
  ignore: []
})

module.exports = require('./src/exec');