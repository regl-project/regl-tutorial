# animations in regl

## props

Scale: 0 <input type="range" id="scale-input" min="0" max="1" step="0.01" /> 1

<script show>
const regl = require('regl')()

const drawTriangle = regl({
  vert: `
  precision mediump float;
  uniform float scale;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    fcolor = color;
    gl_Position = vec4(scale * position, 0, 1);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(sqrt(fcolor), 1);
  }
  `,

  attributes: {
    position: [
      [1, 0],
      [0, 1],
      [-1, -1]
    ],

    color: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
  },

  uniforms: {
    scale: regl.prop('scale')
  },

  count: 3
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawTriangle({
    scale: +document.querySelector('#scale-input').value
  })
})
</script>

## context

<script show>
const regl = require('regl')()

const drawTriangle = regl({
  vert: `
  precision mediump float;
  uniform float tick;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    fcolor = color;
    float scale = cos(0.01 * tick);
    gl_Position = vec4(scale * position, 0, 1);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(sqrt(fcolor), 1);
  }
  `,

  attributes: {
    position: [
      [1, 0],
      [0, 1],
      [-1, -1]
    ],

    color: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
  },

  uniforms: {
    tick: regl.context('tick')
  },

  count: 3
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawTriangle()
})
</script>

## functions

<script show="true">
const regl = require('regl')()

const drawTriangle = regl({
  vert: `
  precision mediump float;
  uniform vec2 translate;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    fcolor = color;
    gl_Position = vec4(position + translate, 0, 1);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(sqrt(fcolor), 1);
  }
  `,

  attributes: {
    position: [
      [1, 0],
      [0, 1],
      [-1, -1]
    ],

    color: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
  },

  uniforms: {
  },

  count: 3
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawTriangle()
})
</script>

## batch mode

## scopes
