
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