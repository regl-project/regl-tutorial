const vectorizeText = require('vectorize-text')

const geometryCache = {}

module.exports = function (regl) {
  function stringGeometry (str, font) {
    if (!(font in geometryCache)) {
      geometryCache[font] = {}
    }
    if (str in geometryCache[font]) {
      return geometryCache[font][str]
    }
    const {cells, positions} = vectorizeText(str, {
      triangles: true,
      font,
      textAlign: 'left',
      textBaseline: 'alphabetic'
    })
    const lo = [Infinity, Infinity]
    const hi = [-Infinity, -Infinity]
    const data = new Float32Array(6 * cells.length)
    let ptr = 0
    for (let i = 0; i < cells.length; ++i) {
      const c = cells[i]
      for (let j = 0; j < 3; ++j) {
        const p = positions[c[j]]
        for (let k = 0; k < 2; ++k) {
          const x = k ? -p[k] : p[k]
          lo[k] = Math.min(lo[k], x)
          hi[k] = Math.max(hi[k], x)
          data[ptr++] = x
        }
      }
    }
    const result = {
      buffer: regl.buffer(data),
      count: data.length / 2,
      bounds: [lo, hi]
    }
    geometryCache[font][str] = result
    return result
  }

  function textBuffer (str, font_) {
    const offset = [0, 0]
    const parts = str.split('')
    const font = font_ || 'sans-serif'
    const result = []
    for (let i = 0; i < parts.length; ++i) {
      const tok = parts[i]
      if (tok === ' ') {
        offset[0] += 0.2
      } else if (tok === '\t') {
        offset[0] += 0.4
      } else if (tok === '\n') {
        offset[0] = 0
        offset[1] -= 1.0
      } else {
        const {buffer, bounds, count} = stringGeometry(tok, font)
        result.push({
          position: buffer,
          count: count,
          offset: offset.slice()
        })
        offset[0] += bounds[1][0] + 0.025
      }
    }
    return result
  }

  const drawTextCommand = regl({
    vert: `
    precision mediump float;
    uniform vec2 offset, translate;
    uniform float scale, aspect;
    attribute vec2 position;
    void main () {
      gl_Position = vec4(vec2(scale, scale * aspect) * (position + offset) + translate, 0, 1);
    }
    `,

    frag: `
    precision mediump float;
    uniform vec4 color;
    void main () {
      gl_FragColor= color;
    }
    `,

    attributes: {
      position: regl.prop('position')
    },

    uniforms: {
      offset: regl.prop('offset')
    },

    count: regl.prop('count')
  })

  const drawTextScope = regl({
    uniforms: {
      color: regl.prop('color'),
      translate: regl.prop('translate'),
      scale: regl.prop('scale'),
      aspect: ({viewportWidth, viewportHeight}) =>
        viewportWidth / viewportHeight
    }
  })

  function drawText (str, translate, scale, color, font) {
    drawTextScope({
      translate: translate || [0, 0],
      scale: scale || 1,
      color: color || [1, 1, 1, 1]
    }, function () {
      drawTextCommand(textBuffer(str, font))
    })
  }

  drawText.buffer = textBuffer

  return drawText
}
