HTML = $(patsubst tuts/%.md,www/%.html,$(wildcard tuts/*.md))

all: $(HTML) www/fonts www/katex.css
	echo "done"

www/fonts:
	cp -r `node -pe "require('path').dirname(require.resolve('katex'))"`/dist/fonts www/
	
www/katex.css:
	cp -r `node -pe "require('path').dirname(require.resolve('katex'))"`/dist/katex.min.css www/katex.css

upload: $(HTML)
	node ./bin/upload.js

www/%.html: tuts/%.md
	node ./bin/build.js $< > $@
