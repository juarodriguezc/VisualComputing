# Shaders

## Coloring





{{< details "sketch.js" >}}
```js
let colorShader;
let cmy;
let v1, v2, v3;

let uMaterial1, uMaterial2;

// Color picker
let colorPickerL, colorPickerR;
const colorL = "#CC804D";
const colorR = "#E61A66";

function preload() {
  // The vertex shader defines how vertices are projected onto clip space.
  // Most of the times a projection and modelview matrix are needed for it:
  // https://visualcomputing.github.io/docs/shaders/programming_paradigm/
  // Here, however, we are going to:
  // 1. Define the triangle vertices directly in clip space, thus bypassing
  // both of these matrices (matrices: Tree.NONE). The p5 mandelbrot vertex
  // shader does just the same: https://p5js.org/reference/#/p5/loadShader
  // 2. Interpolate vertex color data (varyings: Tree.color4). Note that
  // color data is defined in a per vertex basis with the p5 fill command.
  // Have a look at the generated vertex shader in the console!
  // readShader: https://github.com/VisualComputing/p5.treegl#handling
  colorShader = readShader('/VisualComputing/sketches/workshop3/coloring1/color.frag',
                          { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);
  // https://p5js.org/reference/#/p5/shader
  shader(colorShader);
  
  colorPickerL = createColorPicker(colorL);
  colorPickerL.position(10, 10);
  colorPickerL.input(drawSquares);
  
  // Create color picker Right
  colorPickerR = createColorPicker(colorR);
  colorPickerR.position( width - 140, 10);
  colorPickerR.input(drawSquares)
  drawSquares();
  
}

function drawSquares() {
  background(0);
  
  //Left square
  // Create color picker Left
  uMaterial1 = colorPickerL.color().levels.map(x => x / 255);
  uMaterial2 = colorPickerR.color().levels.map(x => 1);
  selectColor();
  beginShape();
  fill(colorPickerL.color());
  vertex(-0.9, 0.9);
  vertex(-0.9, 0.1);
  vertex(-0.1, 0.1);
  vertex(-0.1, 0.9);
  endShape();
  
  
  uMaterial1 = colorPickerL.color().levels.map(x => 1);
  uMaterial2 = colorPickerR.color().levels.map(x => x / 255);
  selectColor();
  //Right square
  beginShape();
  fill(colorPickerR.color());
  vertex(0.9, 0.9);
  vertex(0.9, 0.1);
  vertex(0.1, 0.1);
  vertex(0.1, 0.9);
  endShape();
  
  //Result square
  
  uMaterial1 = colorPickerL.color().levels.map(x => x / 255);
  uMaterial2 = colorPickerR.color().levels.map(x => x / 255);
  selectColor();
  beginShape();
  fill("#00AAFF");
  vertex(-0.4, -0.1);
  vertex(-0.4, -0.9);
  vertex(0.4, -0.9);
  vertex(0.4, -0.1);
  endShape();
}

// Send 
function selectColor(){
  colorShader.setUniform('uMaterial1', uMaterial1);
  colorShader.setUniform('uMaterial2', uMaterial2);
}

```
{{< /details >}}

{{< details "color.frag" >}}
```js
// in glsl it is mandatory to define a precision!
precision mediump float;

uniform bool cmy;
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;


void main() {
  gl_FragColor = uMaterial1 * uMaterial2;
}

```
{{< /details >}}


{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/coloring1/sketch.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="325" height="325" >}}



## Coloring luminance


{{< details "sketch.js" >}}
```js
let colorShader;
let cmy;
let v1, v2, v3;

let uMaterial1, uMaterial2;
let brightnessC;

// Color picker
let colorPickerL, colorPickerR;
const colorL = "#CC804D";
const colorR = "#E61A66";

// Brightness picker
let bSlider;

function preload() {
  // The vertex shader defines how vertices are projected onto clip space.
  // Most of the times a projection and modelview matrix are needed for it:
  // https://visualcomputing.github.io/docs/shaders/programming_paradigm/
  // Here, however, we are going to:
  // 1. Define the triangle vertices directly in clip space, thus bypassing
  // both of these matrices (matrices: Tree.NONE). The p5 mandelbrot vertex
  // shader does just the same: https://p5js.org/reference/#/p5/loadShader
  // 2. Interpolate vertex color data (varyings: Tree.color4). Note that
  // color data is defined in a per vertex basis with the p5 fill command.
  // Have a look at the generated vertex shader in the console!
  // readShader: https://github.com/VisualComputing/p5.treegl#handling
  colorShader = readShader('/VisualComputing/sketches/workshop3/coloring2/color.frag',
                          { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);
  // https://p5js.org/reference/#/p5/shader
  shader(colorShader);
  
  colorPickerL = createColorPicker(colorL);
  colorPickerL.position(10, 10);
  colorPickerL.input(drawSquares);
  
  // Create color picker Right
  colorPickerR = createColorPicker(colorR);
  colorPickerR.position( width - 140, 10);
  colorPickerR.input(drawSquares)
  
  // Create brightness slider
  bSlider = createSlider(0, 1, 0.5, 0);
  bSlider.position(100, 140);
  bSlider.style('width', '80px');
  
  bSlider.input(drawSquares);
  
  drawSquares();
  
}

function drawSquares() {
  background(0);
  
  //Left square
  
  uMaterial1 = colorPickerL.color().levels.map(x => x / 255);
  uMaterial2 = colorPickerR.color().levels.map(x => 1);
  brightnessC = 1.0;
  //Set the uniforms
  selectColor();
  beginShape();
  fill(colorPickerL.color());
  vertex(-0.9, 0.9);
  vertex(-0.9, 0.1);
  vertex(-0.1, 0.1);
  vertex(-0.1, 0.9);
  endShape();
  
  //Right square
  
  uMaterial1 = colorPickerL.color().levels.map(x => 1);
  uMaterial2 = colorPickerR.color().levels.map(x => x / 255);
  brightnessC = 1.0;
  // Set the uniforms
  selectColor();
  beginShape();
  fill(colorPickerR.color());
  vertex(0.9, 0.9);
  vertex(0.9, 0.1);
  vertex(0.1, 0.1);
  vertex(0.1, 0.9);
  endShape();
  
  //Result square
  
  uMaterial1 = colorPickerL.color().levels.map(x => x / 255);
  uMaterial2 = colorPickerR.color().levels.map(x => x / 255);
  brightnessC = (float)(bSlider.value());
  // Set uniforms
  selectColor();
  beginShape();
  fill("#00AAFF");
  vertex(-0.4, -0.1);
  vertex(-0.4, -0.9);
  vertex(0.4, -0.9);
  vertex(0.4, -0.1);
  endShape();
}

// Send 
function selectColor(){
  colorShader.setUniform('uMaterial1', uMaterial1);
  colorShader.setUniform('uMaterial2', uMaterial2);
  colorShader.setUniform('brightness', brightnessC);
}

```
{{< /details >}}

{{< details "color.frag" >}}
```js
// in glsl it is mandatory to define a precision!
precision mediump float;

uniform float brightness;
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;


void main() {
  gl_FragColor = brightness * uMaterial1 * uMaterial2;
}

```
{{< /details >}}




{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/coloring2/sketch.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="325" height="325" >}}



## Bibliografía
- [Visual Computing Course Page](https://visualcomputing.github.io/)
