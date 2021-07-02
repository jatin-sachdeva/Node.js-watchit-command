#!/usr/bin/env node
// chokidar is the node package that will be used to fire events on changes in specified dir
// please read the documentation

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

const addCallback = debounce(() => {
	console.log('files added');
}, 100);

const log = console.log.bind(console);
const cwd = chokidar.watch('.');
cwd
	.on('add', addCallback)
	.on('change', (path) => log(`${path} is changed`))
	.on('unlink', (path) => log(`${path} is unlinked`));
