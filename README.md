# brushes.js

This is a simple Brush object framework that I wrote after seeing Mr. Doob's [Harmony project](http://mrdoob.com/projects/harmony/).

# Usage

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
        

