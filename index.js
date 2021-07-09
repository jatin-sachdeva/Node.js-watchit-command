#!/usr/bin/env node
// chokidar is the node package that will be used to fire events on changes in specified dir
// please refer the documentation

const fs = require('fs');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal');
const child_process = require('child_process');
const chalk = require('chalk');

// caporal
program.version('0.0.1').argument('[filename]', 'The name of the file').action(async (args) => {
	let { filename } = args;

	filename = filename || 'index.js';
	console.log(filename);
	// // check if filename entered exist or not using fs.access
	try {
		await fs.promises.access(filename);
	} catch (err) {
		throw new Error('file does not exist');
	}
	let childProc;
	const addCallback = debounce(() => {
		// here we need t execute the file passed in as argument by the users
		// so that whenever chokidar registers a change, add or unlinking then it should rerun the program / file passed by user
		// node we assume only .js filename is passed

		// it will be achieved by child process.spawn method
		if (childProc) childProc.kill(); // kill the previous child process so that only new code runs on change
		console.log(chalk.italic.white('starting process >>>>'));
		childProc = child_process.spawn('node', [ filename ], { stdio: 'inherit' });
	}, 1000);

	// chokidar code here
	const log = console.log.bind(console);
	const cwd = chokidar.watch('.');
	cwd.on('add', addCallback).on('change', addCallback).on('unlink', addCallback);
});

program.parse(process.argv);
