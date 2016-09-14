<script>
var regl = require('regl')()
var style = regl.container.style
style.width = '100%'
style.height = '350px'
require('./tuts/logo.js')(regl)
</script>

# what is regl?

[`regl`](https://github.com/regl-project/regl) is a light weight WebGL wrapper focusing on stability, performance and maintainability.  It makes it to get started writing your own shaders and custom graphical effects with minimal overhead, and its thoroughly documented and tested API means that you can count on it to continue working years down the road.  Here are some things people have made using regl:

* TODO insert gallery

# curriculum

1. [hello regl](01-hello.html)
1. [drawing a triangle](02-triangle.html)
1. [props and animations](03-animation.html)
1. [batch mode](04-batch.md)
1. [scopes and context](05-batch.md)
1. [buffers and elements](06-buffers.html)
1. [textures](07-textures.html)
1. [framebuffers and gpgpu](08-framebuffers.html)
1. [the webgl state machine](09-state.html)
1. [extensions, profiling, etc.](10-extensions.html)
1. [using modules](11-modules.html)

# more information

* [Official website](https://regl.party)
* [GitHub](https://github.com/regl-project/regl)
* [API Docs](https://github.com/regl-project/regl/blob/gh-pages/API.md)
* [Chat](https://gitter.im/mikolalysenko/regl)
* [Awesome regl](https://github.com/regl-project/awesome-regl)
