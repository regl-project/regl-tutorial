var NeoCities = require('neocities')
var prompt = require('prompt')
var glob = require('glob')
var path = require('path')

prompt.start()

prompt.get({
  properties: {
    password: {
      hidden: true
    }
  }
}, function (err, result) {
  if (err) {
    console.error(err)
    return
  }
  var api = new NeoCities('regl', result.password)
  glob('www/**.*', function (err, files) {
    if (err) {
      console.error(err)
      return
    }
    console.log('uploading:', files)

    api.upload(files.map(function (name) {
      return {
        name: path.relative('./www', name),
        path: name
      }
    }), function (resp) {
      console.log(resp)
    })
  })
})
