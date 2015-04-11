#!/usr/bin/env node
/**
 * Example:
 *  wiki2gource 8bit.wikia.com | sort > examples/8bit.gource
 */

'use strict';

var nodemw = require('nodemw'),
	client;

var server = process.argv[2] || false;

if (!server) {
	console.error('Usage: wiki2gource <wiki domain>');
	process.exit(1);
}

client = new nodemw({
	server: server,
	path: '',
	debug: false
});

// get all pages
var edits = [];

client.getAllPages(function(err, pages) {
	if (err) {
		process.exit(2);
	}

	// fetch revisions for all pages
	pages.forEach(function(page) {
		client.getArticleRevisions(page.title, function(err, revisions) {
			if (err) {
				process.exit(3);
			}

			console.error(page.title);

			revisions.forEach(function(rev) {
				var edit = {
					timestamp: Date.parse(rev.timestamp) / 1000,
					author: rev.user,
					type: (rev.parentid === 0) ? 'A' : 'M', // article created / edited
					path: '/' + page.title,
					color: '#ffffff'
				};
				edits.push(edit);

				// print-out the entry
				var out = [];

				Object.keys(edit).forEach(function(key) {
					out.push(edit[key]);
				});

				console.log(out.join('|'));
			});
		});
	});
});
