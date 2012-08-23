[![build status](https://secure.travis-ci.org/jimschubert/brushes.js.png)](http://travis-ci.org/jimschubert/brushes.js)
# brushes.js

This is a simple Brush object framework that I wrote after seeing Mr. Doob's [Harmony project](http://mrdoob.com/projects/harmony/).

# Requirements

The only requirement for using `./src/brushes.js` is to have a browser which supports HTML5 canvas 2d context.

To run the tests, you will need node.js and nodeunit installed.

## Installing node.js
__Instructions taken from [Mastering Node](http://github.com/jimschubert/masteringnode). Be sure to check it out!__

To build and install node from source, we first need to obtain the code. The first method of doing so is
via `git`, if you have git installed you can execute:

    $ git clone http://github.com/joyent/node.git && cd node
    $ git checkout v0.4.0

For those without _git_, or who prefer not to use it, we can also download the source via _curl_, _wget_, or similar:

    $ curl -# http://nodejs.org/dist/node-v0.4.0.tar.gz > node.tar.gz
    $ tar -zxf node.tar.gz

Now that we have the source on our machine, we can run `./configure` which discovers which libraries are available for node to utilize such as _OpenSSL_ for transport security support, C and C++ compilers, etc. `make` which builds node, and finally `make install` which will install node.

    $ ./configure && make && sudo make install

## Getting nodeunit

Note: This has changed a bit. 
`require.paths` is removed in later versions of node.  You'll have to either install modules locally or globally.  You can now install using:

    npm install -d

This installs all of the dependencies specified in `package.json` into the *node_modules* directory. When you run node, it traverses up the directory tree looking at all *node_modules* directories for the dependency.

# Testing
After installing the dependencies, you can easily start the tests by running

    $ make test

If you hate make, you can also run the test runner directly

    $ node test/run.js

# Minify
You can minify the script by running

    $ make clean minify

This will output to `src/brushes.min.js`

# brushes.js Usage

This is a snippet from `examples/points/points.html`:

		var points = [
			[50, 150],
			[150, 150],
			[150, 50],
			[50, 50],
			[50, 150]
		];

		var examples = ['blood', 'boxes', 'charcoal', 'hearts', 'marker', 'pen', 'pencil', 'stars'];

		for(var i = 0;i < points.length;i++){ 
			pointsDiv.html(pointsDiv.html() + "[" + points[i][0] + "," + points[i][1] + "]</br>");
		}

		for(var example = 0;example<examples.length; example++){
			var canvas = $('#canvas-' + examples[example]).get(0),
				ctx = canvas.getContext("2d"),
				brush = new Brushes[examples[example]]({
					context: ctx,
					size: 1,
					color: [244,14,68],
					randomize: true, /* color has to be set to randomize it */
					pressure: 2
				}),
				lastX = points[0][0],
				lastY = points[0][1],
				canvasPos = findPos(canvas, null);

			for (var i = 0; i < points.length; i++) {
				var x = points[i][0],
					y = points[i][1];
				brush.strokeStart(lastX, lastY);
				brush.stroke(x, y);
				lastX = x; 
				lastY = y;
			}
			brush.strokeEnd();
		}
