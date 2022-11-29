
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