/*
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
var Brush = function () {
        this.init();
    };
Brush.prototype = {
    DEBUG: false,
    _debug: function (msg) {
        if (this.DEBUG) {
            console.log(msg);
        }
    },
    constructor: Brush,
    options: {},
    className: "Brush",
    WEIGHT: 0.1,
    BRUSH_SIZE: 1,
    BRUSH_PRESSURE: 1,
    COLOR: [0, 0, 0],
    RANDOM_COLORS: false,
    context: null,
    prevMouseX: null,
    prevMouseY: null,
    points: new Array(),
    count: 0,
    _strokeStyle: function (data) {
        data = data || {};
        var weight = data.weight || this.WEIGHT;
        var r = this.COLOR[0];
        var g = this.COLOR[1];
        var b = this.COLOR[2];
        var a = weight * this.BRUSH_PRESSURE;
        if (data.randomize) {
            var randomized = "".concat("rgba(", Math.floor(Math.random() * r), ",", Math.floor(Math.random() * g), ",", Math.floor(Math.random() * b), ",", a, ")");
            this._debug("_strokeStyle: " + randomized);
            return randomized;
        }
        var normal = "".concat("rgba(", r, ",", g, ",", b, ",", a, ")");
        this._debug("_strokeStyle: " + normal);
        return normal;
    },
    init: function (data) {
        this._debug("Entering init for " + this.className);
        if (data && data.context) {
            this.options = data;
            this.reset(this.options);
        } else {
            var $tag = this.window && this.window.document && this.window.document.getElementsByTagName;
            if ($tag) {
                var canvas = $tag('canvas') ? $tag('canvas')[0] : null;
                if (canvas) {
                    this.context = canvas.getContext("2d");
                }
            }
        }
        if ("function" === typeof this._init) {
            this._init(data);
        }
        this._debug("Leaving init.");
    },
    reset: function (data) {
        this._debug("Entering reset.");

        data = data || this.options;
        if (data) {
            this.context = data.context || this.context.canvas.getContext('2d');
            this.BRUSH_SIZE = data.size || this.BRUSH_SIZE;
            this.BRUSH_PRESSURE = data.pressure || this.BRUSH_PRESSURE;
            this.COLOR = data.color || this.COLOR;
            this.RANDOM_COLORS = data.randomColors || data.randomize || false;
            this.WEIGHT = data.weight || this.WEIGHT;
            this.prevMouseX = null;
            this.prevMouseY = null;
            this.points = new Array();
            this.count = 0;
        }
        this._setContextDefaults();
        this._init();
        this._debug("Leaving reset.");
    },
    destroy: function () {
        this._debug("Destroy.");
    },
    strokeEnd: function () {
        this._debug("strokeEnd.");
        this.context.closePath();
    },
    strokeStart: function (b, a) {
        this._debug("strokeStart");
        this.prevMouseX = b;
        this.prevMouseY = a
    },
    stroke: function (newX, newY) {
        this._debug("stroke");
        var context = this.context;
        context.beginPath();
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
        this._debug("_setContextDefaults");
        this.context.fillStyle = this._strokeStyle();
        this.context.font = "10px sans-serif";
        this.context.globalAlpha = 1;
        this.context.globalCompositeOperation = "darker";
        this.context.lineCap = "square";
        this.context.lineJoin = "miter";
        this.context.lineWidth = this.BRUSH_SIZE * this.BRUSH_PRESSURE;
        this.context.miterLimit = 10;
        this.context.shadowBlur = 0;
        this.context.shadowColor = "rgba(0,0,0,0.0)";
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.strokeStyle = this._strokeStyle();
        this.context.textAlign = "start";
        this.context.textBaseline = "alphabetic";
    },
    _eachPoint: function (reverse, callback) {
        if (typeof (callback) !== "function") {
            this._debug("callback was not a function, existing _eachPoint");
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
    }
};

var Brushes = (function (brush) {

    var brushes = this,
        _brush = brush;

    /***************************************************************
     * Brushes.pencil
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _pencil = function (data) {
            var self = this;
            self.className = "pencil";
            data = data || {};
            data.weight = 0.5;
            self.context = data.context;
        };
    _pencil.prototype = new _brush;
    _pencil.prototype._init = function (data) {
        if (self.context) {
            self.context.lineCap = "square";
            self.context.lineJoin = "miter";
        }
        self._debug("_init");
    };

    /***************************************************************
     * Brushes.pen
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _pen = function (data) {
            var self = this;
            self.className = "pen";
            data = data || {};
            data.weight = 3.0;
            self.context = data.context;
        };

    _pen.prototype = new _brush;
    _pen.prototype._init = function (data) {
        if (self.context) {
            self.context.lineCap = "block";
            self.context.lineJoin = "round";
        }
        self._debug("_init");
    };

    /***************************************************************
     * Brushes.marker
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _marker = function (data) {
            var self = this;
            self.className = "marker";
            data = data || {};
            data.weight = 5.0;
            self.context = data.context;
        };
    _marker.prototype = new _brush;
    _marker.prototype._init = function (data) {
        if (self.context) {
            self.context.lineCap = "round";
            self.context.lineJoin = "bevel";
        }
        self._debug("_init");
    };

    /***************************************************************
     * Brushes.charcoal
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    _charcoal = function (data) {
        var self = this;
        self.className = "charcoal";
        data = data || {};
        data.weight = 5.0;
        self.context = data.context;
    };
    _charcoal.prototype = new _brush;
    _charcoal.prototype._init = function (data) {
        if (self.context && self.context.globalCompositeOperation) {
            self.context.globalCompositeOperation = "darker";
        }
    };
    _charcoal.prototype.stroke = function (g, c) {
        self.context.lineWidth = self.BRUSH_SIZE;
        self.context.strokeStyle = self._strokeStyle({
            weight: 0.05
        });
        self.points.push([g, c]); /* add current point */
        var scratchPressure = Math.random() % 80;
        for (var i = (scratchPressure / 2) * 7; i >= 0; i--) {
            self.context.beginPath();
            self.context.lineCap = "butt";
            self.context.lineJoin = "bevel";
            self.context.moveTo(g + i, c - i);
            self.context.lineWidth = self.BRUSH_SIZE * i;
            self.context.lineTo(g, c + (self.BRUSH_PRESSURE * i));
            self.context.stroke();
            self.count++;
        };
    };

    /***************************************************************
     * Brushes.stars
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _stars = function (data) {
            var self = this;
            self.className = "stars";
            data = data || {};
            data.weight = 5.0;
            self.context = data.context;
        };
    _stars.prototype = new _brush;
    _stars.prototype._init = function (data) {
        if (self.context && self.context.globalCompositeOperation) {
            self.context.globalCompositeOperation = "source-out";
            console.log("stars._init");
        }

        self.context.lineCap = "square";
        self.context.lineJoin = "miter";
    };
    _stars.prototype.stroke = function (g, c) {
        self.context.lineWidth = self.BRUSH_SIZE;
        self.context.strokeStyle = self._strokeStyle({
            weight: self.WEIGHT
        });

        if (self.pointDistance(g, c, self.prevMouseX, self.prevMouseY) < self.BRUSH_SIZE * 1.3) {
            return;
        }
        self.context.fillStyle = self._strokeStyle({
            randomize: self.RANDOM_COLORS
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
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _boxes = function (data) {
            var self = this;
            self.className = "boxes";
            data = data || {};
            data.weight = 0.5;
            self.context = data.context;
        };
    _boxes.prototype = new _brush;
    _boxes.prototype._init = function (data) {
        if (self.context && self.context.globalCompositeOperation) {
            self.context.globalCompositeOperation = "source-over";
        }

        self.context.lineCap = "square";
        self.context.lineJoin = "miter";
    };
    _boxes.prototype.stroke = function (x, y) {
        self.context.lineWidth = 2.0; /* BRUSH_SIZE will determine size of box */
        self.context.strokeStyle = self._strokeStyle({
            weight: self.WEIGHT
        });
        if (self.pointDistance(x, y, self.prevMouseX, self.prevMouseY) < self.BRUSH_SIZE * 1.5) {
            return;
        }

        self.points.push([x, y]);
        self.count++;

        var control = Math.PI / 3;
        var radians = Math.cos(control) * x + Math.sin(control) * y;
        self.context.fillStyle = self._strokeStyle({
            randomize: self.RANDOM_COLORS
        });

        self.context.save();

        var baseX = 3 + self.BRUSH_SIZE * self.BRUSH_PRESSURE;
        var baseY = 2 + self.BRUSH_SIZE * self.BRUSH_PRESSURE;

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
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _hearts = function (data) {
            var self = this;
            self.className = "hearts";
            data = data || {};
            data.weight = 0.5;
            self.context = data.context;
        };
    _hearts.prototype = new Brush;
    _hearts.prototype._init = function (data) {
        self.context.lineCap = "round";
        self.context.lineJoin = "round";
    };
    _hearts.prototype.stroke = function (x, y) {
        self.context.lineWidth = 2.0; /* BRUSH_SIZE will determine size of hearts */
        self.context.strokeStyle = self._strokeStyle({
            weight: self.WEIGHT
        });

        if (self.pointDistance(x, y, self.prevMouseX, self.prevMouseY) < self.BRUSH_SIZE * 1.5) {
            return;
        }

        self.points.push([x, y]);
        self.count++;

        var radians = 45;
        self.context.fillStyle = self._strokeStyle({
            randomize: self.RANDOM_COLORS
        });

        self.context.save();

        var baseLen = 5 + self.BRUSH_SIZE * self.BRUSH_PRESSURE;
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
     * @param {Object} data
     * @author Jim Schubert
     * @classDescription Returns a usable brush object for writing
     * to HTML canvas element's context
     ***************************************************************/
    var _blood = function (data) {
            var self = this;
            self._debug("blood constructor");
            self.className = "blood";
            data = data || {};
            data.weight = 1.5;
            self.context = data.context;
        };
    _blood.prototype = new Brush;
    _blood.prototype._init = function (data) {
        self._debug("blood._init");
        if (self.context && self.context.globalCompositeOperation) {
            self.context.globalCompositeOperation = "darker";
        }
        self.context.lineCap = "round";
        self.context.lineJoin = "bevel";
    };
    _blood.prototype.stroke = function (x, y) {
        self._debug("blood.stroke");
        self.context.fillStyle = self._strokeStyle({
            randomize: self.RANDOM_COLORS
        });
        self.context.strokeStyle = self._strokeStyle({
            randomize: !! self.RANDOM_COLORS
        });
        self.context.lineWidth = 1.5 * self.BRUSH_SIZE + self.BRUSH_PRESSURE;

        self.context.beginPath();
        self.context.moveTo(self.prevMouseX, self.prevMouseY);
        self.context.lineTo(x, y);
        self.context.fill();
        self.context.stroke();
        self.context.closePath();

        var rand = new Date().getMilliseconds() % 40; /* brush range */
        if (self.pointDistance(x, y, self.prevMouseX, self.prevMouseY) > rand) {

            if (self.BRUSH_PRESSURE > 0) {
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

    return {
        pencil: _pencil,
        pen: _pen,
        marker: _marker,
        charcoal: _charcoal,
        stars: _stars,
        boxes: _boxes,
        hearts: _hearts,
        blood: _blood
    }

}(Brush));

if ("object" === typeof module) {
    module.exports.Brushes = Brushes;
    module.exports.Brush = Brush;
}
