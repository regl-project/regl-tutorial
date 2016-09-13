<script>
var regl = require('regl')()
var style = regl.container.style
style.width = '100%'
style.height = '400px'
require('./tuts/logo.js')(regl)
</script>

# what is regl?

[`regl`](https://github.com/regl-project/regl) is a light weight WebGL wrapper focusing on stability, performance and maintainability.  It makes it to get started writing your own shaders and custom graphical effects with minimal overhead, and its thoroughly documented and tested API means that you can count on it to continue working years down the road.  Here are some things people have made using regl:

* TODO insert gallery

# syllabus

## introduction to regl
1. [hello regl](01-hello.html)
1. [drawing a triangle](02-triangle.html)
1. [animation](03-animation.html)
1. [buffers and elements](04-buffers.html)
1. [textures](05-textures.html)
1. [framebuffers and gpgpu](06-framebuffers.html)
1. [the webgl state machine](07-state.html)
1. [extensions, profiling, etc.](08-extensions.html)
1. [using modules](09-modules.html)

## 2d graphics

1. 2d transformations
1. matrices
1. colors and gamma
1. alpha blending
1. sprites, atlases and tiles
1. feedback effects
1. video
1. text

## 3d graphics

1. the depth buffer
1. 3d transformations
1. perspective and homogeneous coordinates
1. matrices
1. normals and simple lighting
1. environment mapping
1. shadows
1. advanced lighting
1. wrangling assets
1. texture mapping

# more information

* [Official website](https://regl.party)
* [GitHub](https://github.com/regl-project/regl)
* [API Docs](https://github.com/regl-project/regl/blob/gh-pages/API.md)
* [Chat](https://gitter.im/mikolalysenko/regl)
* [Awesome regl](https://github.com/regl-project/awesome-regl)
