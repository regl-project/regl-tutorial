# basics

## what is webgl?
[WebGL](https://www.khronos.org/webgl/) lets your access your computer's [graphics processing unit (GPU)](https://en.wikipedia.org/wiki/Graphics_processing_unit) from a web browser.  You can use it to create high performance graphics, both in 2D and 3D


## how do GPUs work?

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
      [1, 1],
      [1, 2],
      [1, -2],
      [2, 0]
    ]
  },

  uniforms: {
    color: regl.prop('color'),
    translate: regl.prop('translate'),
    scale: regl.prop('scale')
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
  void main () {
    gl_Position = vec4(scale * vec2(
      cos(angle) * position.x - sin(angle) * position.y,
      sin(angle) * position.x + cos(angle) * position.y) + offset, 0, 1);
  }
  `
})

regl.frame(({viewportWidth, viewportHeight}) => {
  regl.clear({
    depth: 1
  })

  const aspect = viewportWidth / viewportHeight

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

  arrow([{
    translate: [-0.48, 0],
    scale: [0.15, aspect * 0.05],
    color: [1, 1, 1, 1]
  }, {
    translate: [0.32, 0],
    scale: [0.15, aspect * 0.05],
    color: [1, 1, 1, 1]
  }])

  text('uniforms', [-0.125, 0.75], 0.05, [0, 0, 0, 1])
  text('attributes', [-0.9, -0.9], 0.05, [0, 0, 0, 1])
  text('vertex shader', [-0.6, -0.2 * aspect], 0.05, [0, 0, 0, 1])
  text('varying variables', [-0.17, -0.9], 0.05, [0, 0, 0, 1])
  text('fragment shader', [0.2, -0.2 * aspect], 0.05, [0, 0, 0, 1])
  text('pixels', [0.75, -0.9], 0.05, [0, 0, 0, 1])
})
</script>

## what are shaders?

# getting set up

## npm

## browserify

## budo

# hello regl

## drawing a color

## animation

# next
