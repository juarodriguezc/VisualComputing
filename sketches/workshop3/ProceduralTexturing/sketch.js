let pg;
let truchetShader;
let img;
let lastMouse = 0;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('./truchet.frag',
                             { matrices: Tree.NONE, varyings: Tree.NONE });

  img = loadImage('./img/scotish.jpg');
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  // use truchetShader to render onto pg
  pg.shader(truchetShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(truchetShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  truchetShader.setUniform('u_zoom', 3);
  truchetShader.setUniform('texture', img);

  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture

  scotish = createCheckbox('scotish', false);
  scotish.position(10, 10);
  scotish.style('color', 'white');  
}

function draw() {
  background(33);
  orbitControl();
  cylinder(100, 200);
  if(scotish.checked()){
    texture(img);
  }
  else{
    texture(pg);
    lastMouse = abs(mouseX-lastMouse)
    truchetShader.setUniform('u_mouse', int(mouseX)/2000);

  }
}

function mouseMoved() {
  // https://p5js.org/reference/#/p5.Shader/setUniform
  //truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
  
  //truchetShader.setUniform('u_mouse', mouseX/2000);
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}