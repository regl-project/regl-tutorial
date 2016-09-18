# your first triangle
WebGL just draws shaded triangles.  From this, we can create extremely detailed and efficient renderings.  For example, the animation below is drawn in WebGL using just one triangle with a complex fragment shader:

<script>
var regl = require('regl')()

regl.container.style.width = '100%'

var drawScene = regl({
  vert: `
  precision highp float;
  attribute vec2 position;
  varying vec2 v_uv;
  void main () {
    v_uv = position;
    gl_Position = vec4(position, 0, 1);
  }`,

  frag: `
  precision highp float;
  uniform float time;
  uniform sampler2D noiseTex;
  varying vec2 v_uv;
  void main () {
    gl_FragColor = texture2D(noiseTex, v_uv);
  }
  `,

  depth: {
    enable: false,
    mask: false
  },

  attributes: {
    position: [
      [-4, 0],
      [4, 4],
      [4, -4]
    ]
  },

  uniforms: {
    aspect: ({viewportWidth, viewportHeight}) => viewportWidth / viewportHeight,
    noiseTex: regl.texture({
      shape: [32, 32, 4],
      data: (function () {
        var data = new Uint8Array(32 * 32 * 4)
        for (var i = 0; i < data.length; ++i) {
          data[i] = Math.pow(Math.random(), 2.0) * 256
        }
        return data
      })(),

      min: 'linear mipmap linear',
      mag: 'linear',
      wrap: 'repeat'
    }),
    time: regl.context('time')
  },

  count: 3
})

regl.frame(() => {
  drawScene()
})
</script>

Many more examples like the above can be found on [shadertoy](https://www.shadertoy.com/), which is a great place to learn more about GLSL programming and computer graphics.

In this section we're going to cover the basics of drawing things in `regl` starting with a single triangle.

# commands
In `regl`, you write commands to tell the GPU how to render objects.  Each command contains a vertex and fragment shader, which tells the GPU what to draw.  Shaders are tiny programs that run on the GPU written in a special language called [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language).

Here is an example of a draw command in regl:

<script show>
// Again, we start out by requiring regl
var regl = require('regl')()

// Next, we create a new command.
//
// To do this, we call the main regl function and pass it an object giving a
// description of the rendering command and its properties:
//
var drawTriangle = regl({
  //
  // First we define a vertex shader.  This is a program which tells the GPU
  // where to draw the vertices.
  //
  vert: `
    // This is a simple vertex shader that just passes the position through
    attribute vec2 position;
    void main () {
      gl_Position = vec4(position, 0, 1);
    }
  `,

  //
  // Next, we define a fragment shader to tell the GPU what color to draw.
  //
  frag: `
    // This is program just colors the triangle white
    void main () {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  `,

  // Finally we need to give the vertices to the GPU
  attributes: {
    position: [
      [1, 0],
      [0, 1],
      [-1, -1]
    ]
  },

  // And also tell it how many vertices to draw
  count: 3
})

// Now that our command is defined, we hook a callback to draw it each frame:
regl.frame(function () {
  // First we clear the color and depth buffers like before
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  // Then we call the command that we just defined
  drawTriangle()
})
</script>

## glsl 101

## varying variables

<script show>
var regl = require('regl')()

var drawTriangle = regl({
  vert: `
  precision mediump float;
  attribute vec2 position;
  varying vec3 fcolor;
  void main () {
    fcolor = abs(vec3(position.x, 0, position.y));
    gl_Position = vec4(position, 0, 1);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(fcolor, 1);
  }
  `,

  attributes: {
    position: [
      [1, 0],
      [0, 1],
      [-1, -1]
    ]
  },

  count: 3
})

regl.frame(function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawTriangle()
})
</script>


## vertex attributes

<script show>
var regl = require('regl')()

var drawTriangle = regl({
  vert: `
  precision mediump float;
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 fcolor;
  void main () {
    fcolor = color;
    gl_Position = vec4(position, 0, 1);
  }
  `,

  frag: `
  precision mediump float;
  varying vec3 fcolor;
  void main () {
    gl_FragColor = vec4(fcolor, 1);
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

  count: 3
})

regl.frame(function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawTriangle()
})
</script>

## uniforms

<script show>
var regl = require('regl')()

var drawTriangle = regl({
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
    gl_FragColor = vec4(fcolor, 1);
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
    scale: 0.25
  },

  count: 3
})

regl.frame(function () {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawTriangle()
})
</script>

## advanced glsl
