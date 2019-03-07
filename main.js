var gl = null
var canvas = null
var shaderProgram = null
var vertexBuffer = null

function startup() {
  var canvas = document.getElementById("myCanvas")
  var gl = createGLContext(canvas)
}

function createGLContext(canvas) {
  var names = ['webgl']
  var context = null
  for (let i = 0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i])
    } catch (error) { }
    if (context) {
      break
    }
  }
  if (context) {
    context.viewportWidth = canvas.width
    context.viewportHeight = canvas.height
  }
  return context
}

function loadShader(type, shaderSource) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("error shader", gl.getErrors())
    gl.deleteShader(shader)
    shader = null
  }
  return shader
}

function setupShader() {
  let vertexShaderSource = 
  `attribute vec3 aVertexPos;
   attribute vec4 aVertexColor;
   varying vec4 vColor;

   void main() {
     vColor = aVertexColor;
      gl_Position = vec4(aVertexPos, 1.0);
   }`;

   let fragmentShaderSource = `
   precision mediump float;
   varying vec4 vColor;
   void main(){
     gl_FragColor = vColor;
   }`;
   
   var vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource)
   var fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
   shaderProgram = gl.createProgram()
   gl.attachShader(shaderProgram, vertexShader)
   gl.attachShader(shaderProgram, fragmentShader)
   gl.linkProgram(shaderProgram)
   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
     console.error("link program error", gl.getErrors())
   }
   gl.useProgram(shaderProgram)
   shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPos")
   shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor")

   gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
   gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute)   
}

var vertexSizeInBytes = 0
function setupBuffers() {
  vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  var triangleVertices = [
    0.0, 0.5, 0.0, 255, 0, 0, 255,
    0.5, -0.5, 0.0, 0, 250, 6, 255,
    -0.5, -0.5, 0.0, 0, 0, 255, 255,
  ];

  var nbrOfVertices = 3
  vertexSizeInBytes = 3 * Float32Array.BYTES_PER_ELEMENT + 4 * Uint8Array.BYTES_PER_ELEMENT
  var vertexSizeInFloats = vertexSizeInBytes / Float32Array.BYTES_PER_ELEMENT
  var buffer = new ArrayBuffer(nbrOfVertices * vertexSizeInBytes)
  var posView = new Float32Array(buffer)
  var colorView = new Uint8Array(buffer)

  for (let i = 0; i < nbrOfVertices; i++) {
    let start1 = i * vertexSizeInFloats
    let colorStart = i * vertexSizeInBytes + 12
    let start2 = i * 7
    posView[start1] = triangleVertices[start2] 
    posView[start1 + 1] = triangleVertices[start2 + 1] 
    posView[start1 + 2] = triangleVertices[start2 + 2] 
    colorView[colorStart] = triangleVertices[start2 + 3] 
    colorView[colorStart + 1] = triangleVertices[start2 + 4] 
    colorView[colorStart + 2] = triangleVertices[start2 + 5] 
    colorView[colorStart + 3] = triangleVertices[start2 + 6]  
  }

  gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW)
  // vertexBuffer.itemSize = 3
  // vertexBuffer.numberOfItems = 3
  vertexBuffer.positionSize = 3
  vertexBuffer.colorSize = 4
  vertexBuffer.numOfIterms = 3
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.positionSize, gl.FLOAT, false, vertexSizeInBytes, 0)
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexBuffer.colorSize, gl.FLOAT, true, vertexSizeInBytes, 12)
  
  // gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
  //  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute)   
  
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numOfIterms)
}

function setup() {
  canvas = document.getElementById("myCanvas")
  gl = createGLContext(canvas)
  setupShader()
  setupBuffers()
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  draw()
}