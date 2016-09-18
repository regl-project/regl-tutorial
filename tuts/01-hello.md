# basics
`regl` is a library for writing WebGL programs.

## what is webgl?
[WebGL](https://www.khronos.org/webgl/) lets your access your computer's [graphics processing unit (GPU)](https://en.wikipedia.org/wiki/Graphics_processing_unit) from a web browser.

## how does WebGL work?
At its core, WebGL is an [API](https://en.wikipedia.org/wiki/Application_programming_interface) for drawing triangles really fast.  With the right set up, this can be used to create 3D scenes, fast and detailed animations or perform massive parallel computations.

Before getting too far into the details, let's start take a high level look at how WebGL works.

WebGL is programmed using [shaders](https://en.wikipedia.org/wiki/Shader), which are programs written in [GLSL](https://www.opengl.org/documentation/glsl/) that run on the GPU.  There are two kinds of shaders:

* [Vertex shaders](https://www.opengl.org/wiki/Vertex_Shader), which determine where the triangles are drawn.
* [Fragment shaders](https://www.opengl.org/wiki/Fragment_Shader), which determine the color of pixels on each triangle.

Shaders receive information from 3 different types of variables:

* [Attributes](https://www.opengl.org/wiki/Vertex_Shader#Inputs) are user defined inputs sent to vertex shader.  They are stored in arrays on the GPU.
* [Varyings](https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/varying.php) are output from the vertex shader and interpolated across rendered primitives for each triangle
* [Uniforms](https://www.opengl.org/wiki/Uniform_(GLSL)) are global variables which are broadcast to all shaders.

Vertex shaders receive inputs from attributes and output varying data to fragment shaders.  Fragment shaders take in the interpolated varying variables and output pixel colors.

<script>
var regl = require('regl')()
var text = require('./tuts/text.js')(regl)

regl.container.style.width = '100%'
regl.container.style.height = '200px'

var box = regl({
  vert: `
  precision mediump float;
  uniform vec2 scale, translate;
  attribute vec2 position;
  void main () {
    gl_Position = vec4(scale * position + translate, 0.5, 1);
  }
  `,

  frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }
  `,

  attributes: {
    position: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, -1],
      [-1, 1],
      [1, 1]
    ]
  },

  uniforms: {
    color: regl.prop('color'),
    translate: regl.prop('translate'),
    scale: regl.prop('scale')
  },

  count: 6
})

const arrow = regl({
  vert: `
  precision mediump float;
  uniform vec2 scale, translate;
  attribute vec2 position;
  varying float phase;
  void main () {
    phase = -position.x;
    gl_Position = vec4(scale * position + translate, 0.5, 1);
  }
  `,

  frag: `
  precision mediump float;
  uniform vec4 color;
  uniform float time;
  varying float phase;
  void main () {
    gl_FragColor = vec4(sqrt(
      mix(color.xyz, vec3(0, 0, 0.5), (0.5 + 0.5 * cos(time + 12.0 * phase)))), 1.0);
  }
  `,

  attributes: {
    position: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
      [1, 2],
      [1, -2],
      [2, 0]
    ]
  },

  uniforms: {
    color: regl.prop('color'),
    translate: regl.prop('translate'),
    scale: regl.prop('scale'),
    time: ({tick}) => 0.2 * tick
  },

  count: 9
})

const drawPolygon = regl({
  vert: `
  precision mediump float;
  uniform vec2 scale, offset;
  uniform float angle;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fragColor;
  void main () {
    fragColor = color;
    gl_Position = vec4(scale * vec2(
      cos(angle) * position.x - sin(angle) * position.y,
      sin(angle) * position.x + cos(angle) * position.y) + offset, 0, 1);
    gl_PointSize = 8.0;
  }
  `,

  frag: `
  precision mediump float;
  uniform float intensity;
  varying vec3 fragColor;
  void main () {
    gl_FragColor = vec4(sqrt(fragColor + intensity), 1);
  }
  `,

  attributes: {
    color: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ],
    position: [
      [1, 0],
      [0, 1],
      [-1, -1]
    ]
  },

  uniforms: {
    scale: regl.prop('scale'),
    offset: regl.prop('translate'),
    angle: regl.prop('angle'),
    intensity: regl.prop('intensity')
  },

  count: 3,

  primitive: regl.prop('primitive')
})

regl.frame(({viewportWidth, viewportHeight, tick}) => {
  regl.clear({
    depth: 1
  })

  const aspect = viewportWidth / viewportHeight

  let angle = 0.005 * tick
  angle = 2.0 * Math.PI * (angle - Math.floor(angle))

  const intensity = 0.25 * (1.0 + Math.sin(0.01 * tick))

  box([
  {
    translate: [-0.8, 0],
    scale: [0.15, 0.15 * aspect],
    color: [0.8, 0.8, 0.8, 1]
  }, {
    translate: [0, 0],
    scale: [0.15, 0.15 * aspect],
    color: [0.8, 0.8, 0.8, 1]
  }, {
    translate: [0.8, 0],
    scale: [0.15, 0.15 * aspect],
    color: [0.8, 0.8, 0.8, 1]
  }])

  drawPolygon([{
    translate: [-0.8, 0],
    angle: 0,
    scale: [0.1, 0.1 * aspect],
    primitive: 'points',
    intensity: 0
  }, {
    translate: [0, 0],
    angle,
    scale: [0.1, 0.1 * aspect],
    primitive: 'points',
    intensity: 0
  }, {
    translate: [0, 0],
    angle,
    scale: [0.1, 0.1 * aspect],
    primitive: 'line loop',
    intensity: 0
  }, {
    translate: [0.8, 0],
    angle,
    scale: [0.1, 0.1 * aspect],
    primitive: 'triangles',
    intensity: intensity
  }])

  arrow([{
    translate: [-0.48, 0],
    scale: [0.15, aspect * 0.03],
    color: [1, 0, 1, 1]
  }, {
    translate: [0.32, 0],
    scale: [0.15, aspect * 0.03],
    color: [0, 1, 1, 1]
  }])

  text('uniforms', [-0.1, 0.65], 0.05, [0, 0, 0, 1])
  text('{ angle: ' + angle.toFixed(4) + ',', [-0.3, 0.5], 0.05, [0, 0, 0, 1])
  text('intensity: ' + intensity.toFixed(4) + ' }', [0.01, 0.5], 0.05, [0, 0, 0, 1])
  text('attributes', [-0.9, -0.9], 0.05, [0, 0, 0, 1])
  text('vertex shader', [-0.6, -0.2 * aspect], 0.05, [0, 0, 0, 1])
  text('varying variables', [-0.17, -0.9], 0.05, [0, 0, 0, 1])
  text('fragment shader', [0.2, -0.2 * aspect], 0.05, [0, 0, 0, 1])
  text('pixels', [0.75, -0.9], 0.05, [0, 0, 0, 1])
})
</script>

# getting set up

## npm

The regl ecosystem is based around [npm](https://npmjs.com), a package manager
for javascript. To use npm, you'll need to install
[node.js](https://nodejs.org/).

The distributions on [the nodejs website](https://nodejs.org/en/download/) come
with nodejs and npm included.

You may also prefer to follow [distribution-specific
instructions](https://nodejs.org/en/download/package-manager/) for your platform.

Once you have node.js and npm installed, in a new project directory do:

```
npm install regl
```

The node.js module system gives you a function `require()` that you can use to
load packages. For example, to load the regl package, in your code you can do:

```
var regl = require('regl')
```

Whenever you `npm install` some package, you can `require()` it by its name in
your code.

To load other files in your project instead of packages, use a relative path
beginning in `'./'` or `'../'`. For example:

```
var len = require('./len.js')
```

will assign the exports of the local file `len.js` into the variable `len`.

The `require()` function returns whatever functionality a package saw fit to
export. A package set exports by assigning to the variable `module.exports`. For
example, in `len.js` we can export a function:

``` js
module.exports = function len (a, b, c) {
  return Math.sqrt(a*a+b*b+c*c)
}
```

You can export any kind of object, not only functions, but it's very common to
export a function.

Each file in the node module system has its own module scope so you don't have
to worry about local variable declarations with `var` leaking out.

## browserify

Packages from npm come in many separate files and use the node.js module system
to import and export dependencies.

To make the node.js module system work in the browser, use
[browserify](http://browserify.org) to compile all your dependencies into a
payload of javascript that you can deliver in a single script tag.

It's good to have a copy of the browserify around for building files for
production. Install browserify by running:

``` sh
sudo npm install -g browserify
```

This will give you a `browserify` command you can invoke starting from a file,
such as `main.js` and will create a bundle of all the files necessary to run
your project.

Start by writing code that requires `regl` and other libs in `main.js` and then
you can run browserify to produce  `bundle.js`:

```
browserify main.js > bundle.js
```

## budo

In development, it's nice to have a tool that will recompile your code every
time you make a change to a file. You can use
[budo](https://npmjs.com/package/budo) to incrementally recompile your code like
so:

```
budo main.js --open
```

This command will compile your code using browserify, set up a local http
server with your code in a basic html scaffold and open a web browser.

Every time you change your code, you can reload the page. If you prefer budo to
handle that for you, you can pass in `--live`:

```
budo main.js --open --live
```

and budo will reload the page whenever a file changes.

### aside: ES6

*This section is optional*

[ECMAScript version 6](http://es6-features.org/) (also known as ES6) is a new version of JavaScript which is currently being rolled out.  It adds many nice features like [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) which make writing shader code much easier.

Modern browsers like [Google Chrome](https://www.google.com/chrome/index.html) and [Firefox](https://www.mozilla.org/en-US/firefox/new/) already support most of the new language features, but many older browsers like iOS Safari do not yet.

If you want to use ES6 features when you are writing your regl, it is a good idea to transpile your JavaScript down to ES5 so that users with legacy browsers can still see your creation.

A simple way to do this is with the [es2020 browserify transform](https://github.com/yoshuawuyts/es2020) that implements a subset of ES6 features.  To install it with npm type:

```
npm install es2020
```

And then to use the transform with browserify run:

```
browserify -t es2020 main.js > bundle.js
```

Or in budo:

```
budo main.js --open --live -- -t es2020
```

# hello regl

## drawing a color

Now that you have regl set up, let's jump in and create a simple application.  For this first example, we're going to make a program that just clears the screen to a solid color.  Copy and paste the following code into an example file and try running it:

<script show>
// First we import regl and call the constructor
var regl = require('regl')()

// Then we hook a callback to draw the current frame
regl.frame(function () {
  // And in the frame loop we clear the screen color to magenta
  regl.clear({
    // This line determines the color of the screen.  It has 4 components:
    //  [red, green, blue, alpha]
    //
    // Each of these is a number between 0 and 1, where 0 = dark and 1 = light.
    // alpha is a special color controlling transparency.
    //
    color: [1, 0, 1, 1]
    //
    // Try changing these numbers in your program and see what happens!
  })
})
</script>

## animation
`regl.frame` is a [callback](https://en.wikipedia.org/wiki/Callback_%28computer_programming%29#JavaScript) method that takes a function which is executed each frame

<script show>
var regl = require('regl')()

regl.frame(function () {
  // Instead of magenta, we oscillate the color
  regl.clear({
    color: [0, 0.5 * (1.0 + Math.cos(Date.now() * 0.01)), 1, 1]
  })
})
</script>
