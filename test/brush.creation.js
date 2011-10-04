var Brush = require('../src/brushes.js').Brush;
var testCase = require('nodeunit').testCase;
var Canvas = require('canvas');

exports.init = testCase({
    setUp: function (callback) {
        this.brush = new Brush();
	this.context = new Canvas(500,500).getContext('2d');
	this.brush.context = this.context;
        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    statics: function (test) {
        test.expect(5);
		var defaults = this.brush.defaults;
        test.ok(defaults.hasOwnProperty("WEIGHT"), "WEIGHT has moved from Brush.prototype.defaults");
        test.ok(defaults.hasOwnProperty("BRUSH_SIZE"), "BRUSH_SIZE has moved from Brush.prototype.defaults");
        test.ok(defaults.hasOwnProperty("BRUSH_PRESSURE"), "BRUSH_PRESSURE has moved from Brush.prototype.defaults");
        test.ok(defaults.hasOwnProperty("COLOR"), "COLOR has moved from Brush.prototype.defaults");
        test.ok(defaults.hasOwnProperty("RANDOM_COLORS"), "RANDOM_COLORS has moved from Brush.prototype.defaults");
        test.done();
    },
    defaults: function (test) {
	/* only put defaults here if it is important that they are base values */
        test.expect(4);
	test.equal(0.1, this.brush.defaults.WEIGHT);
	test.equal(1, this.brush.defaults.BRUSH_SIZE);
	test.equal(1, this.brush.defaults.BRUSH_PRESSURE);
	test.same([0,0,0], this.brush.defaults.COLOR);
        test.done();
    },
    type: function (test) {
        test.expect(1);
        var brush = new Brush();
        test.ok(brush instanceof Brush);
        test.done();
    }
});
