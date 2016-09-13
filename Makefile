HTML = $(patsubst tuts/%.md,www/%.html,$(wildcard tuts/*.md))

all: $(HTML)
	echo "done"

upload: $(HTML)
	node ./bin/upload.js

www/%.html: tuts/%.md
	node ./bin/build.js $< > $@
