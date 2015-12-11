#!/usr/bin/env node
/**
 * Example:
 *  wiki2gource 8bit.wikia.com | sort > examples/8bit.gource
 */

'use strict';

var async = require('async'),
	nodemw = require('nodemw'),
	CategoriesRanker = require('../').CategoriesRanker,
	ColorsRanker = require('../').ColorsRanker,
	client;

// general settings
var config = {
	categoriesLimit: -1,
	nodeColorFrom: '#4c4b4b',
	nodeColorTo: '#70b8ff'
};

// init the MediaWiki client
var server = process.argv[2] || false;

// for large wikis allow to include every N-th edit only
var editsCompression = parseInt(process.argv[3], 10) || 0;

if (!server) {
	console.error('Usage: wiki2gource <wiki domain> [editsCompression]');
	process.exit(1);
}

// use a proper path based on MW provider
var path;

if (server.match(/\.wikia\.com$/)) {
	path = ''; // wikia.com
}
else {
	path = '/w'; // Wikipedia default
}

client = new nodemw({
	server: server,
	path: path,
	debug: false
});

// get the wiki-specific data
// @see https://github.com/caolan/async#paralleltasks-callback
console.error('Getting wiki statistics...');

if (editsCompression) {
	console.error('Edits compression of %d will be applied', editsCompression);
}

async.parallel(
	{
		// get wiki statistics
		stats: function (callback) {
			client.getSiteStats(callback);
		},

		// get the list of all pages
		pages: function (callback) {
			client.getAllPages(callback);
		},

		// get the list of top categories
		topCategories: function (callback) {
			client.getQueryPage('Mostlinkedcategories', callback);
		}
	},
	function(err, results) {
		var edits = [];

		if (err) {
			process.exit(2);
		}

		// get top 1000 categories and filter out the smallest ones (with less than 2% of articles)
		var categoryMinValue = results.pages.length / 50;
		categoryMinValue = Math.min(categoryMinValue, 50);
		categoryMinValue = Math.max(categoryMinValue, 5);

		results.topCategories = results.topCategories.
			slice(0, 1000).
			filter(function (item) {
				if (item.value < categoryMinValue) {
					//console.error("Filtered out %s category (too small - %d articles)", item.title, item.value);
					return false;
				}

				return true;
			}).
			map(function (item) {
				// <page value="11" ns="14" title="Kategoria:Atlantic Airways" />
				return item.title.split(':')[1];
			});

		// print out some stats
		console.error('This wikis has %d edits on %d articles', results.stats.edits, results.pages.length);
		console.error('Using %d categories to build a wiki tree', results.topCategories.length);

		// set up rankers
		var categoriesRanker = new CategoriesRanker(results.topCategories),
			colorsRanker = new ColorsRanker(results.stats, config.nodeColorFrom, config.nodeColorTo);

		console.error('\nFetching revisions for all articles...\n');

		// fetch revisions for all pages
		results.pages.forEach(function(page) {
			client.getArticleRevisions(page.title, function(err, revisions) {
				if (err) {
					process.exit(4);
				}

				// get article categories
				client.getArticleCategories(page.title, function(err, categories) {
					if (err) {
						process.exit(5);
					}

					var articlePath,
						color;

					// remove category namespace prefix
					categories = categories.map(function (item) {
						return item.split(':')[1];
					});

					articlePath = '/' + categoriesRanker.getArticlePath(page.title, categories, config.categoriesLimit);
					color = colorsRanker.getColorForEdit(revisions.length - 1);

					console.error('%s [%d edits]...', articlePath, revisions.length);

					if (editsCompression) {
						revisions = revisions.filter(function(item, index) {
							return index % editsCompression === 0;
						});

						console.error('%s [%d edits after compression]...', articlePath, revisions.length);
					}

					// generate entries for all revisions
					revisions.forEach(function(rev) {
						var edit = {
							timestamp: Date.parse(rev.timestamp) / 1000,
							author: rev.user,
							type: (rev.parentid === 0) ? 'A' : 'M', // article created / edited
							path: articlePath,
							color: color
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
	}
);
