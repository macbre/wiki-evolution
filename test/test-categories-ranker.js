/* global describe: true, it: true */

'use strict';
var assert = require('assert');

describe('CategoriesRanker', function() {
	var CategoriesRanker = require('../').CategoriesRanker;
	var ranker = new CategoriesRanker([
		'foo',
		'bar',
		'test',
		'misc'
	]);

	it('should return a proper path with top categories only', function() {
		assert.equal(
			ranker.getArticlePath('article', ['misc', '123', 'foo', 'test']),
			'foo/test/misc/article'
		);
	});

	it('should obey the limit', function() {
		assert.equal(
			ranker.getArticlePath('article', ['misc', '123', 'foo'], 1),
			'foo/article'
		);
	});

	it('should handle articles with no categories', function() {
		assert.equal(
			ranker.getArticlePath('article', [], 1),
			'article'
		);
	});

	it('should handle articles with no top categories', function() {
		assert.equal(
			ranker.getArticlePath('article', ['123', '456'], 1),
			'article'
		);
	});
});
