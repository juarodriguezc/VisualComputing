# Shaders

## Non Euclidian Geometry



### Ejemplo del profesor

{{< details "sketch.js" >}}
```js

let easycam;
let edge = 80;
let scooter;
let scooterTex;
let amogus;
let amogusTex;
let texShader;


let path = '/VisualComputing/sketches/workshop3/nonEuclidian1'

function preload() {
  // no varyings need to be emitted from the vertex shader
  texShader = readShader(path+'/shader.frag',
                         { varyings: Tree.NONE });
  amogus = loadModel(path+'/models/amogus.obj', true);
  scooter = loadModel(path+'/models/scooter.obj', true);
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // no need to normalize the texture
  // textureMode(NORMAL);
  shader(texShader);
  // resolution will be used to sample the offscreen textures
  emitResolution(texShader);
  easycam = createEasyCam();
  scooterTex = createGraphics(width, height, WEBGL);
  amogusTex = createGraphics(width, height, WEBGL);
}

function draw() {
  // 1. compute current main canvas camera params
  let position = treeLocation();
  let center = p5.Vector.add(position, treeDisplacement());
  let up = treeDisplacement(Tree.j);
  // in case the current camera projection params are needed check:
  // https://github.com/VisualComputing/p5.treegl#frustum-queries
  // 2. offscreen rendering
  // bunny graphics
  amogusTex.background(150);
  amogusTex.reset();
  amogusTex.camera(position.x, position.y , position.z,
                  center.x, center.y, center.z,
                  up.x, up.y, up.z);
  amogusTex.push();
  amogusTex.noStroke();
  
  amogusTex.push();
  
  amogusTex.fill('red');
  // most models use positive y-coordinates
  amogusTex.scale(1, -1);
  amogusTex.scale(0.7);
  amogusTex.rotateY(frameCount * 0.03);
  amogusTex.model(scooter);
  amogusTex.pop();

  
  
  amogusTex.pop();
  
  
  // teapot graphics
  scooterTex.background(150);
  scooterTex.reset();
  scooterTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  scooterTex.push();
  scooterTex.noStroke();
  scooterTex.fill('blue');
  scooterTex.scale(1, -1);
  scooterTex.scale(0.7);
  scooterTex.model(amogus);
  scooterTex.pop();
  
  
  
  // 3. main canvas
  background(0);
  push();
  // front (+z)
  stroke('purple');
  strokeWeight(5);
  texShader.setUniform('texture', amogusTex);
  beginShape();
  vertex(-edge, -edge, +edge);
  vertex(+edge, -edge, +edge);
  vertex(+edge, +edge, +edge);
  vertex(-edge, +edge, +edge);
  endShape(CLOSE);
  // right (+x)
  texShader.setUniform('texture', scooterTex);
  beginShape();
  vertex(+edge, -edge, +edge);
  vertex(+edge, -edge, -edge);
  vertex(+edge, +edge, -edge);
  vertex(+edge, +edge, +edge);
  endShape(CLOSE);
  pop();
}

```
{{< /details >}}

{{< details "shader.frag" >}}
```js

precision mediump float;

uniform sampler2D texture;


uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = texture2D(texture, vec2(st.s, 1.0 - st.t));
}

```
{{< /details >}}


{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/nonEuclidian1/sketch.js" lib1="https://freshfork.github.io/p5.EasyCam/p5.easycam.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="425" height="425" >}}


### Cubo completo

{{< details "sketch.js" >}}
```js


let path = '/VisualComputing/sketches/workshop3/nonEuclidian2'

let easycam;
let edge = 80;

// Create model for each face
let scooter;
let scooterRTex;
let scooterGTex;



let amogus;
let amogusBTex;
let amogusYTex;

let cow;
let cowOTex;
let cowPTex;

let texShader;

function preload() {
  // no varyings need to be emitted from the vertex shader
  texShader = readShader(path+'/shader.frag',
                         { varyings: Tree.NONE });
  
  
  scooter = loadModel(path+'/models/scooter.obj', true);
  amogus = loadModel(path+'/models/amogus.obj', true);
  cow = loadModel(path+'/models/cow.obj', true);
  
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // no need to normalize the texture
  // textureMode(NORMAL);
  shader(texShader);
  // resolution will be used to sample the offscreen textures
  emitResolution(texShader);
  easycam = createEasyCam();
  
  scooterRTex = createGraphics(width, height, WEBGL);
  scooterGTex = createGraphics(width, height, WEBGL);
  
  amogusBTex = createGraphics(width, height, WEBGL);
  amogusYTex = createGraphics(width, height, WEBGL);
  
  cowOTex = createGraphics(width, height, WEBGL);
  cowPTex = createGraphics(width, height, WEBGL);
}

function draw() {
  // 1. compute current main canvas camera params
  let position = treeLocation();
  let center = p5.Vector.add(position, treeDisplacement());
  let up = treeDisplacement(Tree.j);
  // in case the current camera projection params are needed check:
  // https://github.com/VisualComputing/p5.treegl#frustum-queries
  // 2. offscreen rendering
  // bunny graphics
  
  // Red scooter
  scooterRTex.background(150);
  scooterRTex.reset();
  scooterRTex.camera(position.x, position.y , position.z,
                  center.x, center.y, center.z,
                  up.x, up.y, up.z);
  
  
  scooterRTex.push();
  scooterRTex.noStroke(); 
  scooterRTex.fill('red');
  // most models use positive y-coordinates
  scooterRTex.scale(1, -1);
  scooterRTex.scale(0.7);
  scooterRTex.rotateY(frameCount * 0.03);
  scooterRTex.model(scooter);
  scooterRTex.pop();
  
  
  
  
  // Green scooter
  scooterGTex.background(150);
  scooterGTex.reset();
  scooterGTex.camera(position.x, position.y , position.z,
                  center.x, center.y, center.z,
                  up.x, -up.y, up.z);
  scooterGTex.push();
  scooterGTex.noStroke(); 
  scooterGTex.fill('green');
  // most models use positive y-coordinates
  scooterGTex.scale(1, -1);
  scooterGTex.scale(0.7);
  scooterGTex.rotateY(frameCount * -0.05);
  scooterGTex.model(scooter);
  scooterGTex.pop();
  
  
  
  // Blue amogus
  amogusBTex.background(150);
  amogusBTex.reset();
  amogusBTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  amogusBTex.push();
  amogusBTex.noStroke();
  amogusBTex.fill('blue');
  amogusBTex.scale(1, -1);
  amogusBTex.scale(0.7);
  amogusBTex.model(amogus);
  amogusBTex.pop();
  
  
  // Blue amogus
  amogusYTex.background(150);
  amogusYTex.reset();
  amogusYTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  amogusYTex.push();
  amogusYTex.noStroke();
  amogusYTex.fill('yellow');
  amogusYTex.scale(1, -1);
  amogusYTex.scale(0.7);
  amogusYTex.model(amogus);
  amogusYTex.pop();
  
  
  // Orange cow
  cowOTex.background(150);
  cowOTex.reset();
  cowOTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  cowOTex.push();
  cowOTex.noStroke();
  cowOTex.fill('orange');
  cowOTex.scale(1, -1);
  cowOTex.scale(0.7);
  cowOTex.rotateY(frameCount * -0.008);
  cowOTex.model(cow);
  cowOTex.pop();
  
  
   // Purkple cow
  cowPTex.background(150);
  cowPTex.reset();
  cowPTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  cowPTex.push();
  cowPTex.noStroke();
  cowPTex.fill('purple');
  cowPTex.scale(1, -1);
  cowPTex.scale(0.7);
  cowPTex.model(cow);
  cowPTex.pop();
  
  
  
  // 3. main canvas
  background(0);
  push();
  
  stroke('purple');
  strokeWeight(5);
  
  
  // front (+z)
  
  texShader.setUniform('texture', scooterRTex);
  beginShape();
  vertex(-edge, -edge, +edge);
  vertex(+edge, -edge, +edge);
  vertex(+edge, +edge, +edge);
  vertex(-edge, +edge, +edge);
  endShape(CLOSE);
  
  // front (-z)
  texShader.setUniform('texture', scooterGTex);
  beginShape();
  vertex(-edge, -edge, -edge);
  vertex(+edge, -edge, -edge);
  vertex(+edge, +edge, -edge);
  vertex(-edge, +edge, -edge);
  endShape(CLOSE);
  
  
  // right (+x)
  texShader.setUniform('texture', amogusYTex);
  beginShape();
  vertex(+edge, -edge, +edge);
  vertex(+edge, -edge, -edge);
  vertex(+edge, +edge, -edge);
  vertex(+edge, +edge, +edge);
  endShape(CLOSE);
  
  // left (-x)
  texShader.setUniform('texture', amogusBTex);
  beginShape();
  vertex(-edge, -edge, +edge);
  vertex(-edge, -edge, -edge);
  vertex(-edge, +edge, -edge);
  vertex(-edge, +edge, +edge);
  endShape(CLOSE);
  
  
  // bottom (-y)
  texShader.setUniform('texture', cowOTex);
  beginShape();
  vertex(edge, -edge, +edge);
  vertex(edge, -edge, -edge);
  vertex(-edge, -edge, -edge);
  vertex(-edge, -edge, +edge);
  endShape(CLOSE);
  
  
  // bottom (+y)
  texShader.setUniform('texture', cowPTex);
  beginShape();
  vertex(edge, +edge, +edge);
  vertex(edge, +edge, -edge);
  vertex(-edge, +edge, -edge);
  vertex(-edge, +edge, +edge);
  endShape(CLOSE);
  
  
  pop();
  
}

```
{{< /details >}}

{{< details "shader.frag" >}}
```js

precision mediump float;

uniform sampler2D texture;


uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = texture2D(texture, vec2(st.s, 1.0 - st.t));
}


```
{{< /details >}}


{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/nonEuclidian2/sketch.js" lib1="https://freshfork.github.io/p5.EasyCam/p5.easycam.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="425" height="425" >}}


### Tetraedro

{{< details "sketch.js" >}}
```js


let path = '/VisualComputing/sketches/workshop3/nonEuclidian3'
let easycam;
let edge = 150;

let amogus;
let amogusBTex;
let amogusYTex;

let cow;
let cowOTex;
let cowPTex;

let texShader;

function preload() {
  // no varyings need to be emitted from the vertex shader
  texShader = readShader(path+'/shader.frag',
                         { varyings: Tree.NONE });
  
  
  amogus = loadModel(path+'/models/amogus.obj', true);
  cow = loadModel(path+'/models/cow.obj', true);
  
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // no need to normalize the texture
  // textureMode(NORMAL);
  shader(texShader);
  // resolution will be used to sample the offscreen textures
  emitResolution(texShader);
  easycam = createEasyCam();

  amogusBTex = createGraphics(width, height, WEBGL);
  amogusYTex = createGraphics(width, height, WEBGL);
  
  cowOTex = createGraphics(width, height, WEBGL);
  cowPTex = createGraphics(width, height, WEBGL);
}

function draw() {
  // 1. compute current main canvas camera params
  let position = treeLocation();
  let center = p5.Vector.add(position, treeDisplacement());
  let up = treeDisplacement(Tree.j);
  // in case the current camera projection params are needed check:
  // https://github.com/VisualComputing/p5.treegl#frustum-queries
  // 2. offscreen rendering
  
  
  // Blue amogus
  amogusBTex.background(200);
  amogusBTex.reset();
  amogusBTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  amogusBTex.push();
  amogusBTex.noStroke();
  amogusBTex.fill('blue');
  amogusBTex.scale(1, -1);
  amogusBTex.scale(0.7);
  amogusBTex.model(amogus);
  amogusBTex.pop();
  
  
  // Blue amogus
  amogusYTex.background(200);
  amogusYTex.reset();
  amogusYTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  amogusYTex.push();
  amogusYTex.noStroke();
  amogusYTex.fill('yellow');
  amogusYTex.scale(1, -1);
  amogusYTex.scale(0.7);
  amogusYTex.model(amogus);
  amogusYTex.pop();
  
  
  // Orange cow
  cowOTex.background(200);
  cowOTex.reset();
  cowOTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  cowOTex.push();
  cowOTex.noStroke();
  cowOTex.fill('orange');
  cowOTex.scale(1, -1);
  cowOTex.scale(1.2);
  cowOTex.model(cow);
  cowOTex.pop();
  
  
   // Purkple cow
  cowPTex.background(200);
  cowPTex.reset();
  cowPTex.camera(position.x, position.y, position.z,
                   center.x, center.y, center.z,
                   up.x, up.y, up.z);
  cowPTex.push();
  cowPTex.noStroke();
  cowPTex.fill('purple');
  cowPTex.scale(1, -1);
  cowPTex.scale(1.2);
  cowPTex.model(cow);
  cowPTex.pop();
  
  
  
  // 3. main canvas
  background(0);
  push();
  
  stroke(int(random(80, 200)), int(random(80, 200)), int(random(80, 200)));

  strokeWeight(5);
  //Bottom
  texShader.setUniform('texture', cowOTex);
  
  
  beginShape(TRIANGLES);
  vertex(-edge, edge, edge);
  vertex(edge, edge, edge);
  vertex(0, edge, -edge);
  endShape(CLOSE);
  
  
  texShader.setUniform('texture', cowPTex);
  
  //Front
  beginShape(TRIANGLES);
  vertex(-edge, edge, edge);
  vertex(edge, edge, edge);
  vertex(0, -edge, 0);
  endShape(CLOSE);
  
  
  texShader.setUniform('texture', amogusBTex);
  
  //Right
  beginShape(TRIANGLES);
  vertex(0, edge, -edge);
  vertex(edge, edge, edge);
  vertex(0, -edge, 0);
  endShape(CLOSE);
  
  
  //Left
  texShader.setUniform('texture', amogusYTex);
  
  beginShape(TRIANGLES);
  vertex(0, edge, -edge);
  vertex(-edge, edge, edge);
  vertex(0, -edge, 0);
  endShape(CLOSE);
  
  
  
  pop();
  
}


```
{{< /details >}}

{{< details "shader.frag" >}}
```js


precision mediump float;

uniform sampler2D texture;


uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = texture2D(texture, vec2(st.s, 1.0 - st.t));
}

```
{{< /details >}}

{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/nonEuclidian3/sketch.js" lib1="https://freshfork.github.io/p5.EasyCam/p5.easycam.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="425" height="425" >}}


## Bibliografía
- [Visual Computing Course Page](https://visualcomputing.github.io/)
