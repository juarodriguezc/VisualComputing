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