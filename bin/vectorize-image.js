var getPixels = require('get-pixels')
var surfaceNets = require('surface-nets')
// var simplify = require('simplify-planar-graph')
var cleanPSLG = require('clean-pslg')
var cdt2d = require('cdt2d')
var normals = require('angle-normals')
var boundary = require('simplicial-complex-boundary')
// var refineMesh = require('refine-mesh')
var loopSubdivide = require('loop-subdivide')

var X = 1.0

getPixels(process.argv[2], function (err, pixels) {
  if (err) {
    console.error(err)
    return
  }
  var graph = surfaceNets(pixels.pick(-1, -1, 0), 128)
  var edges = graph.cells
  var positions = graph.positions

  cleanPSLG(positions, edges)
  var triangles = cdt2d(positions, edges, {
    delaunay: true,
    exterior: false,
    interior: true
  })

  edges = boundary(triangles)

  var N = positions.length
  var positions3D = positions.map(function (p) {
    return [+p[0].toFixed(4), +p[1].toFixed(4), 1]
  }).concat(positions.map(function (p) {
    return [+p[0].toFixed(4), +p[1].toFixed(4), 99]
  }))

  var OFFSET = positions3D.length

  var vertexNormals = positions.map(function () {
    return [1, 0]
  })
  edges.forEach(function (e) {
    var p0 = positions[e[0]]
    var p1 = positions[e[1]]
    var dx = p0[0] - p1[0]
    var dy = p0[1] - p1[1]
    var l = Math.sqrt(dx * dx + dy * dy)
    for (var i = 0; i < 2; ++i) {
      vertexNormals[e[i]][0] -= dy / l
      vertexNormals[e[i]][1] += dx / l
    }
  })
  vertexNormals.forEach(function (n) {
    var l = Math.sqrt(n[0] * n[0] + n[1] * n[1])
    n[0] /= l
    n[1] /= l
  })

  var normals3D = positions.map(function () {
    return [0, 0, 1]
  }).concat(positions.map(function () {
    return [0, 0, -1]
  }))

  positions.forEach(function (p, i) {
    var n = vertexNormals[i]
    positions3D.push(
      [p[0] + X * n[0], p[1] + X * n[1], 0.5],
      [p[0] + X * n[0], p[1] + X * n[1], 99.5])
    normals3D.push(
      [n[0], n[1], 0],
      [n[0], n[1], 0]
    )
  })

  var cells3D = triangles.slice().concat(triangles.map(function (t) {
    return [t[1] + N, t[0] + N, t[2] + N]
  }))

  edges.forEach(function (e) {
    var a = 2 * e[0] + OFFSET
    var b = 2 * e[1] + OFFSET
    cells3D.push(
      [e[1], e[0], a],
      [e[1], a, b],
      [e[0] + N, e[1] + N, a + 1],
      [e[1] + N, b + 1, a + 1],
      [a, b, a + 1],
      [b + 1, a + 1, b]
    )
  })

  var refined = {
    cells: cells3D,
    positions: positions3D
  }
  refined.normals = normals3D

  console.log('module.exports=', JSON.stringify(refined, null, 2))
})
