var Brush = require('../src/brushes.js').Brush;
var testCase = require('nodeunit').testCase;

exports.init = testCase({
    setUp: function (callback) {
        this.brush = new Brush();
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
        test.expect(0);
        test.done();
    },
    type: function (test) {
        test.expect(1);
        var brush = new Brush();
        test.ok(brush instanceof Brush);
        test.done();
    }
});
