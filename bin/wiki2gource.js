#!/usr/bin/env node
/**
 * Example:
 *  wiki2gource 8bit.wikia.com | sort > examples/8bit.gource
 */

'use strict';

var nodemw = require('nodemw'),
	CategoriesRanker = require('../').CategoriesRanker,
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

// TODO: use promises and a single callback when all data is available
// get all pages
var edits = [];

client.getAllPages(function(err, pages) {
	if (err) {
		process.exit(2);
	}

	// get top 500 categories
	client.getQueryPage('Mostlinkedcategories', function(err, res) {
		var topCategories = res.map(function(item) {
			// <page value="11" ns="14" title="Kategoria:Atlantic Airways" />
			return item.title.split(':')[1];
		}).slice(0, 500);

		//console.log(['topCategories', topCategories]);

		var ranker = new CategoriesRanker(topCategories);

		// fetch revisions for all pages
		pages.forEach(function(page) {
			client.getArticleRevisions(page.title, function(err, revisions) {
				if (err) {
					process.exit(3);
				}

				// get article categories
				// @see http://nordycka.wikia.com/api.php?action=query&prop=categories&titles=Wyspy%20Owcze
				client.api.call({
					action: 'query',
					prop: 'categories',
					titles: page.title
				}, function(err, data) {
					var categories = data.pages[page.pageid].categories.map(function(cat) {
							// { ns: 14, title: 'Kategoria:XX wiek' }
							return cat.title.split(':')[1];
						}),
						articlePath;

					//console.log(['categories', categories]);
					articlePath = ranker.getArticlePath(page.title, categories);

					// console.error('"%s" mapped as "%s"...', page.title, articlePath);

					// generate entries for all revisions
					revisions.forEach(function(rev) {
						var edit = {
							timestamp: Date.parse(rev.timestamp) / 1000,
							author: rev.user,
							type: (rev.parentid === 0) ? 'A' : 'M', // article created / edited
							path: '/' + articlePath,
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
	});
});
