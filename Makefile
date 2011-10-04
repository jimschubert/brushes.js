JS = $(shell find src -type f \( -iname "*.js" ! -iname "*.min.js" \) )
MINIFY = $(JS:.js=.min.js)

UGLY = node ./node_modules/uglify-js/bin/uglifyjs

all: clean minify

minify: $(MINIFY)

clean:
	rm -f $(MINIFY)

test:
	node test/run.js

%.min.js: %.js
	$(UGLY) -o $@ $<

.PHONY: test clean minify
