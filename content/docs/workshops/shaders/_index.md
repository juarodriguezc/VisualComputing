---
bookCollapseSection: true
---

# ¿Qué es un Shader?
## Introducción

Un shader es un programa que se ejecuta en la **GPU** de la computadora y genera la salida visual de la pantalla dada la información que define una escena 2D o 3D. Entre la información que se puede definir con un shader está:

- Vértices
- Colores
- Texturas
- Luces

Los shaders no se encargan únicamente de las sombras de la escena, sino que se encargan de todas las etapas de renderizado.

A continuación se presenta el primer shader desarrollado para la asignatura:

## My first shader

{{< details "sketch.js" >}}
```js
    let colorShader;
let cmy;
let v1, v2, v3;

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
  colorShader = readShader('/VisualComputing/sketches/workshop3/firstShader/color.frag',
                          { matrices: Tree.NONE, varyings: Tree.color4 });
  

}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(475, 475, WEBGL);
  // https://p5js.org/reference/#/p5/shader
  shader(colorShader);
  randomizeTriangle();
}

function draw() {
  background(0);
  // the fill command is used to define the colors
  // (to be interpolated) in a per-vertex basis
  
  
  beginShape(TRIANGLES);
  fill('red');
  vertex(v1.x, v1.y);
  fill('green');
  vertex(v2.x, v2.y);
  fill('blue');
  vertex(v3.x, v3.y);
  endShape();
  
  
  
  beginShape();
  fill('orange');
  vertex(-0.2, -0.2);
  
  fill('blue');
  vertex(-0.2, 0.4);
  
  fill('red');
  vertex(0.4, 0.4);
  
  fill('green');
  vertex(0.4, -0.2);
  
  endShape();
  
}

// vertices are given directly in clip-space,
// i.e., both x and y vertex coordinates ∈ [-1..1]
function randomizeTriangle() {
  v1 = p5.Vector.random2D();
  v2 = p5.Vector.random2D();
  v3 = p5.Vector.random2D();
}

function keyPressed() {
  if (key == 'c') {
    cmy = !cmy;
    // https://p5js.org/reference/#/p5.Shader/setUniform
    colorShader.setUniform('cmy', cmy);
  }
  if (key == 'r') {
    randomizeTriangle();
  }
}

```
{{< /details >}}

{{< details "color.frag" >}}
```js
    // welcome to your first ever shader :)
// in glsl it is mandatory to define a precision!
precision mediump float;

// define color model: rgb (default) or cmy (its complementary)
uniform bool cmy;

// interpolated color is emitted from the vertex shader
// where the variable is defined in the same exact way
// see your console!
varying vec4 color4;

void main() {
  // Observe:
  // 1. All colors are normalized thus vec3(1.0, 1.0, 1.0) gives white
  // which is the same as vec3(1.0). See:
  // https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Vector_constructors
  // 2. Use always the decimal digit as in vec3(1.0). Doing it otherwise
  // could lead to errors.
  // 3. color4.rgb builds a vec3 with the first three components of color4
  // (which is a vec4) this is refer to as 'swizzling'
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  gl_FragColor = cmy ? vec4((vec3(1.0) - color4.rgb), color4.a) : color4;
}
```
{{< /details >}}

{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/firstShader/sketch.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="500" height="500" >}}

En este programa se utiliza un shader para controlar el color de las figuras mostradas en pantalla.

## Bibliografía

- [Visual Computing Course Page](https://visualcomputing.github.io/)

