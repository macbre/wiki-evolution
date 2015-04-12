/**
 * This file contains helpers and rankers used by bin/wiki2gource.js
 */

'use strict';

/**
 * Categories ranker used to generate pseudo-path to articles based
 * on categories they're in and list of wiki's top categories
 *
 * @param {Array} topCategories
 * @constructor
 */
function CategoriesRanker(topCategories) {
	this.topCategories = topCategories;
}

CategoriesRanker.prototype.getArticlePath = function(title, categories, limit) {
	var path = [];
	limit = limit || 5;

	this.topCategories.forEach(function(cat) {
		if (categories.indexOf(cat) > -1) {
			path.push(cat);
		}
	});

	// apply a limit
	path = path.slice(0, limit);

	path.push(title);
	return path.join('/');
};

module.exports = {
	CategoriesRanker: CategoriesRanker
};
