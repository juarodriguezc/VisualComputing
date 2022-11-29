let maskShader;
let img;
let video_src;
let video_on;
let mask;

let path = '/VisualComputing/sketches/workshop3/ImageProcessing'

function preload() {
  video_src = createVideo([path+'/img/video.mp4']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader(path+'/mask.frag', { varyings: Tree.texcoords2 });
  //img = loadImage('/sketches/shaders/tree.jpeg');
  //img = loadImage('./img/lupin.png');
  img = loadImage(path+'/img/cuy.webp');
  //img = loadImage('/sketches/shaders/acacias.jpeg');
  //img = loadImage('/sketches/shaders/honda.jpg');
  //img = loadImage('/sketches/shaders/v.jpg');
  //img = loadImage('/sketches/shaders/v.jpeg');
  //img = loadImage('/sketches/shaders/pictographs.jpg');
  //img = loadImage('/sketches/shaders/honda.png');
  //img = loadImage('/sketches/shaders/fire_breathing.jpg');
  //img = loadImage('/sketches/shaders/lenna.png');
  //img = loadImage('/sketches/shaders/mandrill.png');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  video_on = createCheckbox('video', false);
  video_on.style('color', 'white');
  video_on.changed(() => {
    if (video_on.checked()) {
      maskShader.setUniform('texture', video_src);
      video_src.loop();
    } else {
      maskShader.setUniform('texture', img);
      video_src.pause();
    }
  });
  video_on.position(10, 50);
  prewitt = createCheckbox('prewitt', false);
  prewitt.position(10, 10);
  prewitt.style('color', 'white');
  ridges = createCheckbox('ridges', false);
  ridges.position(10, 30);
  ridges.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  // /*
  if (prewitt.checked()) {
    //maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
    //maskShader.setUniform('mask', [1/16, 2/16, 1/16, 2/16, 4/16, 2/16, 1/16, 2/16, 1/16]);
    maskShader.setUniform('mask', [5, 5, 5, -3, 0, -3, -3, -3, -3]);
    //maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    //maskShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
  }
  else if(ridges.checked()){
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    //maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
  }
  else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  /*
  push();
  noStroke();
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  pop();
  */
  // */
  //quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}