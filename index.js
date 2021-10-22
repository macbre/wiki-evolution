/**
 * This file contains helpers and rankers used by bin/wiki2gource.js
 */

'use strict';

var Color = require('color');

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

/**
 * Get the pseudo-path for the article using provided categories
 *
 * @param {string} title
 * @param {Array} categories
 * @param {int} [limit=5] -1 for no limit
 * @returns {string}
 */
CategoriesRanker.prototype.getArticlePath = function(title, categories, limit) {
	var path = [];
	limit = limit || 5;

	this.topCategories.forEach(function(cat) {
		if (categories.indexOf(cat) > -1) {
			path.push(cat);
		}
	});

	// apply a limit
	if (limit > 0) {
		path = path.slice(0, limit);
	}

	path.push(title);
	return path.join('/');
};

/**
 * Colors ranker used to set the color of an entry based on
 * the number of current article edits and
 * the average value of edits per articles for a wiki
 *
 * @param {object} stats
 * @param {string} [from] RGB color to start from
 * @param {string} [to] RGB color to finish on
 * @constructor
 */
function ColorsRanker(stats, from, to) {
	this.edits = stats.edits;
	this.articles = stats.articles;

	this.edits_per_article = Math.ceil(this.edits / this.articles) * 2;
	this.from = from || '#000000';
	this.to = new Color(to || '#ffffff');
}

/**
 * Return color for the n-th edit
 *
 * @param {int} idx edit index (starting from 0)
 * @returns {string} RGB color (without a hash)
 */
ColorsRanker.prototype.getColorForEdit = function(idx) {
	const from = Color(this.from || '#000000');

	var mix = Math.min(1, (idx + 1) / this.edits_per_article);
	return from.mix(this.to, mix).hex().substring(1);
};

// public API
module.exports = {
	CategoriesRanker: CategoriesRanker,
	ColorsRanker: ColorsRanker
};
