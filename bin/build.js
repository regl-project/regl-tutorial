var drmark = require('drmark')
var fs = require('fs')

var transform = [
  'es2020',
  [
    'multi-regl-transform',
    {
      target: '#container'
    }
  ]
]

var src = fs.readFileSync(process.argv[2], 'utf8')
drmark(src, { transform: transform }, function (err, html) {
  if (err) {
    console.error(err)
    return
  }
  console.log(`
<!DOCTYPE html>
<html>
  <head>
    <title>learn regl!</title>
    <meta charset=utf-8>
    <link rel=StyleSheet href="main.css" type="text/css">
  </head>
  <body>
    <div id="container" align="center">
${html}
    </div>
  </body>
</html>`)
})
