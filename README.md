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
For those who don't want to install nodeunit, it's linked as a submodule under `./deps/nodeunit`  After cloning this repository, do the following:

	git submodule init
	git submodule update

Now, running tests can be done by entering the following in a terminal from the project root:

	node ./test/run.js

# brushes.js Usage

This is a snippet from `examples/points/points.html`:

        var points = [
            [50, 150],
            [150, 150],
            [150, 50],
            [50, 50],
            [50, 150]
        ];

        var canvas = $('#canvas').get(0),
            context = canvas.getContext("2d"),
            marker = new Brushes.marker({
                context: context
            }),
            lastX = points[0][0],
            lastY = points[0][1],
            canvasPos = findPos(canvas, null),
            scrollAmount = getScrollXY();

        for (var i = 0; i < points.length; i++) {
            var x = points[i][0],
                y = points[i][1];
            marker.strokeStart(lastX, lastY);
            marker.stroke(x, y);
            lastX = x - canvasPos.x + scrollAmount.x;
            lastY = y - canvasPos.y + scrollAmount.y;
        }
        marker.strokeEnd();
        

