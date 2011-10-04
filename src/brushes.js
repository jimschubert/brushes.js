/*
project: brushes.js
author: Jim Schubert
url: https://github.com/jimschubert/brushes.js

The MIT License

Copyright (c) 2011 Jim Schubert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**  @define {boolean} */
;DEBUG_BRUSH = false;
(function (g) {
	/**
	 * @constructor
	 * @param {Object} [data] The data object is optional.
	 */
	var Brush = function (data) { this.init(data); };
	Brush.prototype = {
		DEBUG: DEBUG_BRUSH,
		_debug: function (msg) {
			if (this.DEBUG) {
			    console && typeof console.log === 'function' && console.log(msg);
			}
		},
		className: "Brush",
		defaults: {
			WEIGHT: 0.1,
			BRUSH_SIZE: 1,
			BRUSH_PRESSURE: 1,
			COLOR: [0, 0, 0],
			RANDOM_COLORS: false
		},
		options: {
			weight: 0.1,
			size: 1,
			pressure: 1,
			color: [0, 0, 0],
			randomize: false
		},
		context: null,
		prevMouseX: null,
		prevMouseY: null,
		points: new Array(),
		count: 0,
		_strokeStyle: function (data) {
			this._mergeOptions(data || { });
			var opt = this.options;
			
			var r = opt.color[0];
			var g = opt.color[1];
			var b = opt.color[2];
			var a = opt.weight * opt.pressure;
			if (opt.randomize) {
				var rnd = Math.random,
					flat = Math.floor;
			    var randomized = "".concat("rgba(", flat(rnd() * r), ",", flat(rnd() * g), ",", flat(rnd() * b), ",", a, ")");
			    return randomized;
			}
			var normal = "".concat("rgba(", r, ",", g, ",", b, ",", a, ")");
			return normal;
		},
		init: function (data) {

            if(!data || !data.context) {
			    var $tag = this.window && this.window.document && this.window.document.getElementsByTagName;
			    if ($tag) {
			        var canvas = $tag('canvas') ? $tag('canvas')[0] : null;
			        if (canvas) {
			            this.context = canvas.getContext("2d");
			        }
			    }
            }

            this.reset(data);
            this._mergeOptions(data);
           
            if(typeof this._init === "function")
                this._init(data);
		},
		reset: function (data) {
			if (data || this.options) {
                data = data || { };
			    this.context = data.context || this.context;
			    this.options.size = data.size || this.defaults.BRUSH_SIZE;
			    this.options.pressure = data.pressure || this.defaults.BRUSH_PRESSURE;
			    this.options.color = data.color || this.defaults.COLOR;
			    this.options.randomize = data.randomize || this.defaults.RANDOM_COLORS;
			    this.options.weight = data.weight || this.defaults.WEIGHT;
			    this.prevMouseX = null;
			    this.prevMouseY = null;
			    this.points = new Array();
			    this.count = 0;
			}
			this._setContextDefaults();
		},
		destroy: function () {	},
		strokeEnd: function () {
			this.context.closePath();
		},
		strokeStart: function (b, a) {
			this.prevMouseX = b;
			this.prevMouseY = a
		},
		stroke: function (newX, newY) {
			var context = this.context;
			context.beginPath();
            context.lineWidth = this.options.size;
			context.moveTo(this.prevMouseX, this.prevMouseY);
			context.lineTo(newX, newY);
			context.stroke();
			context.fill();
			context.closePath();
			this.prevMouseX = newX;
			this.prevMouseY = newY
		},
		pointDistance: function (x, y, x0, y0) {
			return Math.sqrt((x -= x0) * x + (y -= y0) * y);
		},
		_setContextDefaults: function () {
            if(!this.context) return;
			var style = this._strokeStyle();
			this.context.fillStyle = style;
			this.context.font = "10px sans-serif";
			this.context.globalAlpha = 1;
			this.context.globalCompositeOperation = "source-over";
			this.context.lineCap = "square";
			this.context.lineJoin = "miter";
			this.context.lineWidth = this.defaults.BRUSH_SIZE * this.defaults.BRUSH_PRESSURE;
			this.context.miterLimit = 10;
			this.context.shadowBlur = 0;
			this.context.shadowColor = "rgba(0,0,0,0.0)";
			this.context.shadowOffsetX = 0;
			this.context.shadowOffsetY = 0;
			this.context.strokeStyle = style;
			this.context.textAlign = "start";
			this.context.textBaseline = "alphabetic";
		},
		_eachPoint: function (reverse, callback) {
			if (typeof (callback) !== "function") {
			    return null;
			}
			if (reverse) {
			    for (var i = this.points.length; i >= 0; i--) {
			        var pt = this.points[i];
			        if (typeof (pt) !== "undefined") callback(pt);
			    };
			} else {
			    for (var j = 0; j <= this.points.length; j++) {
			        var pt = this.points[j];
			        if (typeof (pt) !== "undefined") callback(pt);
			    }
			}
			return this.points;
		},
		_mergeOptions: function(data){
            var self = this;
			if("object" == typeof data)
				for (p in data) { self.options[p] = data[p]; }
		}
	};

    /***************************************************************
     * Brushes.pencil
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _pencil = function (data) {
            var self = this;
			 /* @const
			 * @type {string}
			 */
            self.className = "pencil";
            data = data || {};
            data.weight = 0.5;
            self.init(data);
        };
    _pencil.prototype = new Brush;
    _pencil.prototype._init = function (data) {
    	var self = this;
        if (self.context) {
            self.context.lineCap = "square";
            self.context.lineJoin = "miter";
        }
    };

    /***************************************************************
     * Brushes.pen
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _pen = function (data) {
			var self = this;
			/* @const
			 * @type {string}
			 */
            self.className = "pen";
            data = data || {};
            data.weight = 3.0;
            self.init(data);
        };

    _pen.prototype = new Brush;
    _pen.prototype._init = function (data) {
    	var self = this;
        if (self.context) {
            self.context.lineCap = "block";
            self.context.lineJoin = "round";
        }
    };

    /***************************************************************
     * Brushes.marker
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _marker = function (data) {
            var self = this;
            /* @const
			 * @type {string}
			 */
            self.className = "marker";
            data = data || {};
            data.weight = 5.0;
            self.init(data);
        };
    _marker.prototype = new Brush;
    _marker.prototype._init = function (data) {
    	var self = this;
        if (self.context) {
            self.context.lineCap = "round";
            self.context.lineJoin = "bevel";
        }
    };

    /***************************************************************
     * Brushes.charcoal
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    _charcoal = function (data) {
        var self = this;
        /* @const
		 * @type {string}
		 */
        self.className = "charcoal";
        self.data = data || {};
        self.data.weight = 5.0;
        self.init(data);
    };
    _charcoal.prototype = new Brush;
    _charcoal.prototype._init = function (data) {
    	var self = this;
    	var ctx = self.context;
        if (ctx && ctx.globalCompositeOperation) {
            ctx.globalCompositeOperation = "darker";
        }
    };
    _charcoal.prototype.stroke = function (g, c) {
    	var self = this;
		var ctx = self.context;
		ctx.lineWidth = self.options.size;
		ctx.strokeStyle = self._strokeStyle({
            weight: 0.05
        });
        self.points.push([g, c]); /* add current point */
        var scratchPressure = Math.random() % 80;
        for (var i = (scratchPressure / 2) * 7; i >= 0; i--) {
            ctx.beginPath();
            ctx.lineCap = "butt";
            ctx.lineJoin = "bevel";
            ctx.moveTo(g + i, c - i);
            ctx.lineWidth = self.options.size * i;
            ctx.lineTo(g, c + (self.options.pressure * i));
            ctx.stroke();
            self.count++;
        };
    };

    /***************************************************************
     * Brushes.stars
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _stars = function (data) {
            var self = this;
            /* @const
			 * @type {string}
			 */
            self.className = "stars";
            data = data || {};
            data.weight = 5.0;
            self.init(data);
        };
    _stars.prototype = new Brush;
    _stars.prototype._init = function (data) {
    	var self = this;
    	var ctx = self.context;
        if (ctx && ctx.globalCompositeOperation) {
            ctx.globalCompositeOperation = "source-over";
        }

        if(ctx) {
            ctx.lineCap = "square";
            ctx.lineJoin = "miter";
        }
    };
    _stars.prototype.stroke = function (g, c) {
    	var self = this;
        self.context.lineWidth = self.options.size;
        self.context.strokeStyle = self._strokeStyle({
            weight: self.options.weight
        });

        if (self.pointDistance(g, c, self.prevMouseX, self.prevMouseY) < self.options.size * 1.3) {
            return;
        }
        self.context.fillStyle = self._strokeStyle({
            randomize: self.options.randomize
        });

        var control = Math.PI / 3;
        var radians = Math.cos(control) * g + Math.sin(control) * c;

        self.points.push([g, c]); /* add current point */
        self.count++;

        var starAngle = 2.0 * Math.PI / 5.0;
        var nextIndex = 2;

        self.context.save();
        self.context.translate(g, c);
        self.context.rotate(radians);

        self.context.beginPath();
        var lastX = Math.cos(0),
            lastY = Math.sin(0);
        self.context.moveTo(lastX, lastY);
        for (var counter = 1; counter < 7; counter++) {
            lastX = Math.cos(nextIndex * starAngle);
            lastY = Math.sin(nextIndex * starAngle);
            self.context.lineTo(lastX, lastY);
            nextIndex = (nextIndex + 2) % 5;
        }
        self.context.fill();
        self.context.stroke();
        self.context.closePath();
        self.context.restore();

        self.prevMouseX = g;
        self.prevMouseY = c;
    };

    /***************************************************************
     * Brushes.boxes
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _boxes = function (data) {
            var self = this;
            /* @const
			 * @type {string}
			 */
            self.className = "boxes";
            data = data || {};
            data.weight = 0.5;
            self.init(data);
        };
    _boxes.prototype = new Brush;
    _boxes.prototype._init = function (data) {
    	var self = this;
        if (self.context && self.context.globalCompositeOperation) {
            self.context.globalCompositeOperation = "source-over";
        }

        if(self.context) {
            self.context.lineCap = "square";
            self.context.lineJoin = "miter";
        }
    };
    _boxes.prototype.stroke = function (x, y) {
    	var self = this;
        self.context.lineWidth = 2.0; /* BRUSH_SIZE will determine size of box */
        self.context.strokeStyle = self._strokeStyle({
            weight: self.options.weight
        });
        if (self.pointDistance(x, y, self.prevMouseX, self.prevMouseY) < self.options.size * 1.5) {
            return;
        }

        self.points.push([x, y]);
        self.count++;

        var control = Math.PI / 3;
        var radians = Math.cos(control) * x + Math.sin(control) * y;
        self.context.fillStyle = self._strokeStyle({
            randomize: self.options.randomize
        });

        self.context.save();

        var baseX = 3 + self.options.size * self.options.pressure;
        var baseY = 2 + self.options.size * self.options.pressure;

        self.context.translate(x, y);
        self.context.rotate(radians);

        self.context.beginPath();
        self.context.moveTo(-baseX, baseY);
        self.context.lineTo(baseX, baseY);
        self.context.lineTo(baseX, -baseY);
        self.context.lineTo(-baseX, -baseY);
        self.context.lineTo(-baseX, baseY);
        self.context.fill();
        self.context.stroke();
        self.context.closePath();
        self.context.restore();

        self.prevMouseX = x;
        self.prevMouseY = y;
    };

    /***************************************************************
     * Brushes.hearts
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _hearts = function (data) {
            var self = this;
            /* @const
			 * @type {string}
			 */
            self.className = "hearts";
            data = data || {};
            data.weight = 0.5;
            self.init(data);
        };
    _hearts.prototype = new Brush;
    _hearts.prototype._init = function (data) {
    	var self = this;
        if(self.context) {
            self.context.lineCap = "round";
            self.context.lineJoin = "round";
            self.context.strokeStyle = self._strokeStyle({
                weight: self.options.weight
            });
            self.context.fillStyle = self._strokeStyle({
                randomize: self.options.randomize
            });
            self.context.lineWidth = 2.0;
        }
    };
    _hearts.prototype.stroke = function (x, y) {
    	var self = this;

        if (self.pointDistance(x, y, self.prevMouseX, self.prevMouseY) < self.options.size * 1.5) {
            return;
        }

        self.points.push([x, y]);
        self.count++;

        var radians = 45;

        self.context.save();

        var baseLen = 5 + self.options.size * self.options.pressure;
        self.context.translate(x, y);
        self.context.rotate(Math.PI * -120 / 180);
        self.context.beginPath();
        self.context.moveTo(-baseLen, 0);
        self.context.arc(0, 0, baseLen, 0, Math.PI, false);
        self.context.lineTo(baseLen, 0);
        self.context.arc(baseLen, -baseLen, baseLen, Math.PI * 90 / 180, Math.PI * 270 / 180, true);
        self.context.lineTo(baseLen, -baseLen * 2);
        self.context.lineTo(-baseLen, -baseLen * 2);
        self.context.lineTo(-baseLen, 0);
        self.context.fill();
        self.context.closePath();
        self.context.restore();

        self.prevMouseX = x;
        self.prevMouseY = y;
    };

    /***************************************************************
     * Brushes.blood
	 * @param {Object} [data] The data object is optional.
     * @author Jim Schubert
     * @description Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _blood = function (data) {
            var self = this;
            /* @const
			 * @type {string}
			 */
            self.className = "blood";
            data = data || {};
            data.weight = 1.5;
            self.init(data);
        };
    _blood.prototype = new Brush;
    _blood.prototype._init = function (data) {
    	var self = this;
        if (self.context && self.context.globalCompositeOperation) {
            self.context.globalCompositeOperation = "darker";
        }
        if(self.context) {
            self.context.lineCap = "round";
            self.context.lineJoin = "bevel";
        }        
    };
    _blood.prototype.stroke = function (x, y) {
    	var self = this;
        self.context.fillStyle = self._strokeStyle({
            randomize: self.options.randomize
        });
        self.context.strokeStyle = self._strokeStyle({
            randomize: !! self.options.randomize
        });
        self.context.lineWidth = 1.5 * self.options.size + self.options.pressure;

        self.context.beginPath();
        self.context.moveTo(self.prevMouseX, self.prevMouseY);
        self.context.lineTo(x, y);
        self.context.fill();
        self.context.stroke();
        self.context.closePath();

        var rand = new Date().getMilliseconds() % 40; /* brush range */
        if (self.pointDistance(x, y, self.prevMouseX, self.prevMouseY) > rand) {

            if (self.options.pressure > 0) {
                var drip = new Date().getMilliseconds() % 640; /* canvas size */
                self.context.beginPath();
                self.context.moveTo(x, y);
                var newY = y + drip;
                if (newY > self.context.canvas.height) {
                    newY = y + Math.ceil(Math.random);
                }
                self.context.lineTo(x, newY);
                self.context.fill();
                self.context.stroke();
                self.context.closePath();
            }

            self.points.push([x, y]);
            self.count++;
        }
        self.prevMouseX = x;
        self.prevMouseY = y;
    };

    var _brushes = { }
    _brushes['pencil'] = _pencil;
    _brushes['pen'] = _pen;
    _brushes['marker'] = _marker;
    _brushes['charcoal'] = _charcoal;
    _brushes['stars'] = _stars;
    _brushes['boxes'] = _boxes;
    _brushes['hearts'] = _hearts;
    _brushes['blood'] = _blood;
    _brushes['Brush'] = Brush;
        
	if ("object" === typeof module && "object" === typeof module.exports) {
		module.exports.Brushes = _brushes;
		module.exports.Brush = Brush;
	}
	
	Brushes = _brushes;
}(this));
