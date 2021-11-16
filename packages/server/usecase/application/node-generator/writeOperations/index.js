/* eslint-disable func-names */
/* eslint-disable no-multi-assign */
/* eslint-disable no-console */
const ejs = require('ejs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const minimatch = require('minimatch');

const TEMPLATE_DIR = path.join(`${__dirname}/../`, 'templates');
const util = require('util');

const MODE_0755 = 0o0755;
const MODE_0666 = 0o0666;

global.MODE_0755 = MODE_0755;
global.MODE_0666 = MODE_0666;

const writeOperations = module.exports = {};

writeOperations.copyTemplateMulti = function (fromDir, toDir, nameGlob) {
  fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
    .filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach((name) => {
      writeOperations.copyTemplate(path.join(fromDir, name), path.join(toDir, name));
    });
};
writeOperations.copyTemplate = function (from, to) {
  writeOperations.write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'));
};
writeOperations.mkdir = function (base, dir) {
  const loc = path.join(base, dir);
  console.log(`   \x1b[36mcreate\x1b[0m : ${loc}${path.sep}`);
  mkdirp.sync(loc, MODE_0755);
};
writeOperations.loadTemplate = function (name) {
  // console.log(__dirname)
  const contents = fs.readFileSync(path.join(`${__dirname}/../`, 'templates', (`${name}.ejs`)), 'utf-8');
  const locals = Object.create(null);
  function render () {
    return ejs.render(contents, locals, { escape: util.inspect });
  }
  return {
    locals,
    render,
  };
};
writeOperations.write = function (file, str, mode, flag = 'w') {
  fs.writeFileSync(file, str, {
    mode: mode || MODE_0666,
    flag,
  });
  console.log(`   \x1b[36mcreate\x1b[0m : ${file}`);
};
