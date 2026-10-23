import { resolve } from 'path';

const Module: Record<string, any> = require('module');

const libPath = resolve('./lib');
const originalNodeModulePaths = Module._nodeModulePaths;

Module._nodeModulePaths = function (from: string) {
	const paths: string[] = originalNodeModulePaths.call(this, from);

	if (!from.includes('node_modules') && !paths.includes(libPath)) {
		paths.unshift(libPath);
	}

	return paths;
};

let parent = module.parent;

while (parent) {
	if (!parent.paths.includes(libPath)) {
		parent.paths.unshift(libPath);
	}

	parent = parent.parent;
}
