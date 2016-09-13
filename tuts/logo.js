const logo = require('./assets/logo3d.js')
const perspective = require('gl-mat4/perspective')
const lookAt = require('gl-mat4/lookAt')
const identity = require('gl-mat4/identity')
const rotateZ = require('gl-mat4/rotateZ')
const rotateX = require('gl-mat4/rotateX')

module.exports = function (regl) {
  const projection = new Float32Array(16)
  const view = new Float32Array(16)
  const model = new Float32Array(16)

  const drawLogo = regl({
    vert: `
    precision mediump float;
    uniform mat4 projection, view, model;
    attribute vec3 position, normal;
    varying vec3 vnormal;
    varying float dist;
    void main () {
      vnormal = (vec4(normal, 0) * model).xyz;
      dist = position.z;
      gl_Position = projection * view * model * vec4(position - vec3(300, 25, 50), 1);
    }
    `,

    frag: `
    precision mediump float;
    uniform vec3 lightDir, color[2];
    varying float dist;
    varying vec3 vnormal;
    void main () {
      vec3 diffuse = mix(color[0], color[1],
        0.5 * (1.0 + dot(normalize(lightDir), vnormal) + 0.001 * dist));
      gl_FragColor = vec4(sqrt(diffuse), 1);
    }
    `,

    attributes: {
      position: logo.positions,
      normal: logo.normals
    },

    uniforms: {
      projection: ({viewportWidth, viewportHeight}) =>
        perspective(projection,
          Math.PI / 4.0,
          viewportWidth / viewportHeight,
          1.0,
          2000.0),
      view: lookAt(view,
        [0, 0, -500],
        [0, 0, 0],
        [0, -1, 0]),
      model: ({tick}) =>
        rotateZ(model,
          rotateX(model,
            identity(model),
            -Math.PI / 8.0 * (1.0 + Math.sin(
              0.5 * Math.PI * Math.pow(Math.sin(0.01 * (tick)), 3.0)))),
          Math.PI / 20.0 * (0.6 + Math.sin(0.01 * (tick)))),
      lightDir: [ 0.2, -1, 0.2 ],
      'color[0]': regl.prop('color[0]'),
      'color[1]': regl.prop('color[1]')
    },

    elements: logo.cells
  })

  regl.frame(({tick}) => {
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    })
    drawLogo({
      color: [
        [1, 0, 1],
        [0, 1, 1]
      ],
      delay: 0
    })
  })
}
