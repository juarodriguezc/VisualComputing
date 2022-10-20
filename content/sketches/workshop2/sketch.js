
let fbo1, fbo2;
let cam1, cam2;
let length = 600;
let hue;
const size = 30
let foreshortening = true;
let box = true;


let handpose;
let detections = [];

let canvas;
let video;

let gesture;
let last_X_centroid = 0; 
let last_Y_centroid = 0; 

const DEFAULT_COLOR = "#00FF00";
const POINTER_COLOR = {
  1: "#FFFFFF",
  2: "#0000FF",
}



let points = [];

let buttonReset;

function setup() {
  createCanvas(length, 2*length);
  //Create button to delete points
  buttonReset = createButton('Clear draw');
  buttonReset.position(width + 20, 100);
  buttonReset.mousePressed(clearDraw);

  // frame buffer object instances (FBOs)
  fbo1 = createGraphics(width / 2, height/4, WEBGL);
  fbo2 = createGraphics(width / 2, height/4, WEBGL);
  //fbo2.ortho();
  fbo2.ortho(-fbo2.width / 2, fbo2.width / 2, -fbo2.height / 2, fbo2.height / 2, 1, 10000);
  // FBOs cams

  
  cam1 = new Dw.EasyCam(fbo1._renderer, { distance: 200 });
  let state1 = cam1.getState();
  cam1.state_reset = state1;   // state to use on reset (double-click/tap)
  cam1.setViewport([0, 0, width / 2, height]);
  cam1.setPanScale(0.005);
  cam2 = new Dw.EasyCam(fbo2._renderer, { rotation: [0.94, 0.33, 0, 0] });
  cam2.attachMouseListeners(this._renderer);
  let state2 = cam2.getState();
  cam2.state_reset = state2;   // state to use on reset (double-click/tap)
  cam2.setViewport([width / 2, 0, width / 2, height]);
  document.oncontextmenu = function () { return false; }
  // scene
  print(fbo1.distanceToBound([], Tree.NEAR));


  //HAND POSE RECOGNITION
  //Code based in Creativeguru97 repo
  // https://github.com/Creativeguru97/YouTube_tutorial/blob/master/Play_with_APIs/hand_detection/ml5_handpose/sketch.js
  push();
  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);
  video.hide();
  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.9, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }

  handpose = ml5.handpose(video, options, modelReady);
  colorMode(HSB);
}

function draw() {
  fbo1.background(175, 125, 115);
  fbo1.reset();
  fbo1.axes({ size: 100, bits: Tree.X | Tree.YNEG });
  fbo1.grid();
  scene1();
  
  
  if(detections.length){
    let X = getXcoordinates()
    let X_avg = X.reduce((a, b) => a + b, 0) / X.length;
    let Y = getYcoordinates()
    let Y_avg = Y.reduce((a, b) => a + b, 0) / Y.length;
    gesture = defineGesture()
    if (gesture == 1){
      //Añade los puntos a un arreglo
      points.push(detections[0].annotations.indexFinger[2]);
    }
    else if(gesture == 2){
      //ROTA CAMARA
      cam1.rotateY((X_avg - last_X_centroid)/50)
      //Para rotar también en Y
      //cam1.rotateX((Y_avg - last_Y_centroid)/50)
    }
    last_X_centroid = X_avg
    last_Y_centroid = Y_avg
  }

  

  beginHUD();
  image(fbo1, 0, 0);
  endHUD();

  //gesto 2: gira la cámara con el puño cerrado

  //
  fbo2.background(130);
  fbo2.reset();
  fbo2.axes();
  fbo2.grid();
  scene2();

  
  fbo2.push();
  fbo2.strokeWeight(3);
  fbo2.stroke(255, 0, 255);
  fbo2.fill(255, 0, 255, 100);
  fbo2.viewFrustum({ fbo: fbo1, bits: Tree.BODY });

  fbo2.pop();
  
  beginHUD();
  image(fbo2, width / 2, 0);
  endHUD();

  //CAMERA
  push();
  translate(width,0);
  scale(-1, 1);
  image(video, 0, height/4);
  pop();
  drawPredictions();
}

function clearDraw(){
  points = [];
}

function scene1() {
  let vis = fbo1.visibility(box ? { corner1: [-size / 2, -size / 2, -size / 2], corner2: [size / 2, size / 2, size / 2] } :
    { center: [0, 0, 0], radius: size });
  hue = vis === Tree.VISIBLE ? 'green' : vis === Tree.SEMIVISIBLE ? 'blue' : 'red';
  fbo1.fill(hue);
  fbo1.noStroke();
  //box ? fbo1.box(size) : fbo1.sphere(size);
  fbo1.push();
  fbo1.strokeWeight(0.1);
  fbo1.stroke("#FFFFFF");
  //fbo2.grid({ dotted: true });
  fbo1.pop();
  //fbo2.axes();
  //for (const point of points) {

  //Draw the points saved in the array
  for (var i = 0; i < points.length; i++) {
    brushCanvas(points[i]);
  }
  
  //Draw the guide point if the hand is detected
  if(detections.length){  
    brushCanvas(detections[0].annotations.indexFinger[2], POINTER_COLOR[gesture] || DEFAULT_COLOR);
  }
}

function scene2() {
  //fbo2.fill(hue);
  //fbo2.noStroke();
  //box ? fbo2.box(size) : fbo2.sphere(size);
  //Draw the points saved in the array
  for (var i = 0; i < points.length; i++) {
    brushCanvasFbo2(points[i]);
  }
}

function keyPressed() {
  if (key === 'p') {
    foreshortening = !foreshortening;
    let eyeZ = (fbo1.height / 2) / tan(PI / 6);
    foreshortening ? fbo1.perspective(PI / 3, fbo1.width / fbo1.height, eyeZ / 10, eyeZ) :
      fbo1.ortho(-fbo1.width / 2, fbo1.width / 2, -fbo1.height / 2, fbo1.height / 2, 1, 500);
  }
  /*
  if (key === 'b') {
    box = !box;
  }
  */
}

function brushCanvas(point, color="#FFFFFF") {
  fbo1.push();
  fbo1.noStroke();
  fbo1.translate(point[0]/1.8-width/4, point[1]-height/8, point[2]);
  fbo1.fill(color)
  fbo1.sphere(8);
  fbo1.pop();
}

function brushCanvasFbo2(point, color="#FFFFFF") {
  fbo2.push();
  fbo2.noStroke();
  fbo2.translate(point[0]/1.8-width/4, point[1]-height/8, point[2]);
  fbo2.fill(color)
  fbo2.sphere(8);
  fbo2.pop();
}

function modelReady() {
  console.log("Model ready!");
  handpose.on('predict', results => {
    detections = results;
  });
}

function drawPredictions(){
  translate(0, height/4);
  if(detections.length > 0){

    drawLandmarks([0, 1], 0);//palm base
    drawLandmarks([1, 5], 60);//thumb
    drawLandmarks([5, 9], 120);//index finger
    drawLandmarks([9, 13], 180);//middle finger
    drawLandmarks([13, 17], 240);//ring finger
    drawLandmarks([17, 21], 300);//pinky
  }
}

function drawLandmarks(indexArray, hue){
  noFill();
  strokeWeight(10);
  for(let i=0; i<detections.length; i++){
    for(let j=indexArray[0]; j<indexArray[1]; j++){
      let x = detections[i].landmarks[j][0];
      let y = detections[i].landmarks[j][1];
      let z = detections[i].landmarks[j][2];
      stroke(hue, 40, 255);
      point(x, y);
    }
  }
}

function defineGesture(){
  let X = getXcoordinates()
  let X_std = getStandardDeviation(X)
  
  let X_range = Math.max(...X) - Math.min(...X)

  let Y = getYcoordinates()
  let Y_std = getStandardDeviation(Y)
  let Y_avg = Y.reduce((a, b) => a + b, 0) / Y.length;
  let Y_range = Math.max(...Y) - Math.min(...Y)

  let index_X_top = detections[0].landmarks[8][0]
  let index_Y_top = detections[0].landmarks[8][1]

  console.log(X_std, Y_std);
  console.log("Range X", X_range);
  console.log("Range Y", Y_range);
  // stretched index
  if( (Math.abs(index_Y_top - Y_avg) > 1.5*Y_std) ){
    return 1;
  }
  // Fist
  if( X_std < 50 && Y_std < 50 && Y_range < 180){
    return 2;
  }

  return 0;
}

function getXcoordinates(){
  return detections[0].landmarks.map(function(x){
    return x[0];
  })
}

function getYcoordinates(){
  return detections[0].landmarks.map(function(x){
    return x[1];
  })
}

function getStandardDeviation (array) {
  //Función tomada de stackoverflow
  //https://stackoverflow.com/questions/7343890/standard-deviation-javascript
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}