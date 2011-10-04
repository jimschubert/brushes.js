var Brush = require('../src/brushes.js').Brush;
var testCase = require('nodeunit').testCase;
var Canvas = require('canvas');

exports.functionality = testCase({
    setUp: function(callback) {
	this.brush = new Brush();
	this.context = new Canvas(500,500).getContext('2d');
	this.brush.context = this.context;
	callback();
    },
    tearDown: function(callback) {
	callback();
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

