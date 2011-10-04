var Brush = require('../src/brushes.js').Brush;
var testCase = require('nodeunit').testCase;
var Canvas = require('canvas');

exports.init = testCase({
    setUp: function (callback) {
        this.brush = new Brush;
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
        Object.defineProperty(Brushes, 'Brush', { enumerable: false });
        var types = Object.keys(Brushes);
        test.expect(types.length);
        
        types.forEach(function(key) {
            var brush = new Brushes[key]({ context: this.context });
            test.ok(brush instanceof Brush, key + " failed type test");
        });
        test.done();
    },
    'non-persisted settings': function(test) {
        // Don't enumerate Brushes['Brush'], we know it doesn't work like this.
        Object.defineProperty(Brushes, 'Brush', { enumerable: false });
        var types = Object.keys(Brushes);
        test.expect(2 * 6 * types.length);
    
        types.sort(function(a,b) {
            return a - b;
        });
        
        var ctx = this.context;
        var iter = function(key) {
            var options = {
                weight: 100 * Math.random(),
                size: 101 * Math.random(),
                pressure: 102 * Math.random(),
                color: [122*Math.random(), 122*Math.random(), 122*Math.random()],
                randomize: Math.random() > 0.5,
                context: ctx
            };

            var brush = new Brushes[key](options);
            test.equal(options.weight, brush.options.weight, key + " retained previous weight");
            test.equal(options.size, brush.options.size, key + " retained previous size");
            test.equal(options.pressure, brush.options.pressure, key + " retained previous pressure");
            test.same(options.color, brush.options.color, key + " retained previous color");
            test.equal(options.randomize, brush.options.randomize, key + " retained previous randomize");
            test.same(options.context, brush.context, key + "improperly set context");
        };

        types.forEach(iter);

        // Now, in reverse to be fully sure these aren't persisting values
        types.sort(function(a,b) {
            return b - a;
        });

        types.forEach(iter);

        test.done();
    }
});
