/* global describe: true, it: true */

'use strict';
var assert = require('assert');

describe('ColorsRanker', function() {
	var ColorsRanker = require('../').ColorsRanker;

	describe('two steps', function() {
		var ranker = new ColorsRanker({edits: 1, articles: 1});

		it('should calculate edits per article', function() {
			assert.equal(ranker.edits_per_article, 2);
		});

		it('should return proper colors for n-th edit', function() {
			assert.equal(ranker.getColorForEdit(0), '808080');
			assert.equal(ranker.getColorForEdit(1), 'FFFFFF');
		});

		it('should return proper colors for n-th edit (reverse calling order)', function() {
			assert.equal(ranker.getColorForEdit(1), 'FFFFFF');
			assert.equal(ranker.getColorForEdit(0), '808080');
		});

		it('should return proper colors for edits above the edits per article value', function() {
			assert.equal(ranker.getColorForEdit(2), 'FFFFFF');
		});
	});

	describe('four steps', function() {
		var ranker = new ColorsRanker({edits: 128, articles: 64});

		it('should calculate edits per article', function () {
			assert.equal(ranker.edits_per_article, 4);
		});

		it('should return proper colors for n-th edit', function () {
			assert.equal(ranker.getColorForEdit(0), '404040');
			assert.equal(ranker.getColorForEdit(1), '808080');
			assert.equal(ranker.getColorForEdit(2), 'BFBFBF');
			assert.equal(ranker.getColorForEdit(3), 'FFFFFF');
			assert.equal(ranker.getColorForEdit(4), 'FFFFFF');
		});
	});

});
