# basics

## what is webgl?
[WebGL](https://www.khronos.org/webgl/) lets your access your computer's [graphics processing unit (GPU)](https://en.wikipedia.org/wiki/Graphics_processing_unit) from a web browser.  You can use it to create high performance interactive 2D and 3D graphics as well as speed up some computations.

## how does WebGL work?
At its core, WebGL is a programmable API for drawing triangles really fast.  The coordinates

* Vertex shaders
* Fragment shaders

<script>
const regl = require('regl')()
const text = require('./tuts/text.js')(regl)

regl.container.style.width = '100%'
regl.container.style.height = '200px'

const box = regl({
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
your project, `bundle.js`:

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

# hello regl

## drawing a color

<script show>
// First we import regl and call the constructor
const regl = require('regl')()

// Then we hook a callback to draw the current frame
regl.frame(() => {
  // And in the frame loop we clear the screen color to magenta
  regl.clear({
    color: [1, 0, 1, 1]
  })
})
</script>

## animation

<script show>
const regl = require('regl')()

regl.frame(({tick}) => {
  // Instead of magenta, we oscillate the color
  regl.clear({
    color: [0.5 * (1.0 + Math.cos(tick * 0.01)), 0, 1, 1]
  })
})
</script>

# next
