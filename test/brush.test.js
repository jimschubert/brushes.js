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
        test.ok(this.brush.__proto__.hasOwnProperty("WEIGHT"), "WEIGHT has moved from Brush.prototype");
        test.ok(this.brush.__proto__.hasOwnProperty("BRUSH_SIZE"), "BRUSH_SIZE has moved from Brush.prototype");
        test.ok(this.brush.__proto__.hasOwnProperty("BRUSH_PRESSURE"), "BRUSH_PRESSURE has moved from Brush.prototype");
        test.ok(this.brush.__proto__.hasOwnProperty("COLOR"), "COLOR has moved from Brush.prototype");
        test.ok(this.brush.__proto__.hasOwnProperty("RANDOM_COLORS"), "RANDOM_COLORS has moved from Brush.prototype");
        test.done();
    },
    defaults: function (test) {
	/* only put defaults here if it is important that they are base values */
        test.expect(4);
	test.equal(0.1, this.brush.WEIGHT);
	test.equal(1, this.brush.BRUSH_SIZE);
	test.equal(1, this.brush.BRUSH_PRESSURE);
	test.same([0,0,0], this.brush.COLOR);
        test.done();
    },
    type: function (test) {
        test.expect(1);
        var brush = new Brush();
        test.ok(brush instanceof Brush);
        test.done();
    },
    methods: function(test) {
	var self = this;
	test.expect(3);
	test.doesNotThrow(function() {
		self.brush.strokeStart(0, 0);
		self.brush.stroke(1,1);
		self.brush.strokeEnd();
	});

	self.brush.points = [[123,456],[999,888],[555,777]];
	var newPoints = self.brush._eachPoint(true, function(pt) {
		var point = pt;
		var tmp = point[0];
		point[0] = point[1];
		point[1] = tmp;
	});
	test.same(newPoints, self.brush.points);

	var distance = self.brush.pointDistance(0,0,20,20);
	test.equal(29, Math.ceil(distance));
	test.done();
    }
});
