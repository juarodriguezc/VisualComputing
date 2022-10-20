# Aplicación de dibujo 3d con la mano

### Introducción
El siguiente trabajo nace depués de observar diferentes proyectos que, haciendo uso de librerías como treegl, logran ser apilcaciones para dibujar en 3 dimensiones. El reto que nos propusimos fue intentar cambiar la interfaz convencional para este tipo de aplicaciones (un mouse) por otra más innovadora como puede ser el caso de nuestra mano, la misma que utilizaban intuitivamente nuestros ancestros para hacer pinturas rupestres. Tuvimos la idea de usar la mano aprovechando que en la actualidad existe un gran avance de modelos de inteligencia artificial orientados a *detectar* objectos (como por ejemplo partes del cuerpo y, por supuesto, la mano).
Para la implementación del ejercicio utilizamos P5 con WEBGL, TreeGL, easyCam (para manejo del canvas 3D) y la librería [ML5](https://ml5js.org/) de donde sacamos el modelo de detección de las manos. Adicionalmente implementamos nuestro propio sistema calibrado para, a partir de la detección de la mano, identificar Gestos.
Como guía también utilizamos un [video de YouTube de Kazuki Umeda](https://www.youtube.com/watch?v=BX8ibqq0MJU) y encontramos soluciones a diferentes problemas que obtuvimos en foros que están debidamente referenciados en el código.

![Arte rupestre hecho con la mano](https://tripin.travel/wp-content/uploads/2020/02/cueva-de-las-manos-1.jpg)

### Detección de Objetos con Machine Learning
En los últimos años hemos venido presenciando un gran *boom* en el campo de la inteligencia artificial. Más específicamente, los modelos de Machine Learning (ML) han tomado gran fuerza, ya que muchos hacen uso de un *aprendizaje supervizado* entrenandolos con grandes cantidades de datos (cosa que en nuestros días hay a montones).
Es tal la tecnología actual, que no son pocas las tareas que modelos de ML pueden resolver, solo por mencionar algunas podemos nombrar:
- Clasificación.
- Regresión.
- Recomendación.
- **Detección de Objetos**

Esta última es la que nos atañe en este trabajo. La tarea de detectar e identificar elementos en una imagen o un video está muy bien lograda. Existen varios modelos entrenados de uso libre que ayudan a este trabajo (ejm *EfficientDet*, *COCO* etc) que son capaces de detectar y etiquetar miles de posibles objetos.
También existen otros modelos más especializados. Así es el caso de [*Handpose*](https://github.com/tensorflow/tfjs-models/tree/master/handpose), el que utilizamos en nuestro trabajo, cuya tarea para que está entrenado es identificar 15 puntos escenciales de una mano en un video.

![Ejemplo Handpose](https://user-images.githubusercontent.com/43569216/81646758-261df680-946f-11ea-825a-81d8d81abe4e.gif)

### Implementación en P5
- WEBGL
- TreeGL
- esaycam
- ML5
- **Aproximación a detección de Gestos:** Con la salida del modelo *Handpose* intentamos dar una solución para que con esos datos se identificaran gestos. Lo hicimos con estadísticos. Partiendo de la idea que los gestos se pueden diferenciar de acuerdo a distribución estadísitica que tienen los puntos en cada uno de los ejes. Así, si la desviación estandar de los puntos es "pequeña" (es decir es menor a un umbral) entonces seguramente el gesto de la mano es un puño. Ese umbral se debe calibra de acuerdo a qué tan cerca se esté de la cámara. Para el otro gesto (índice levantado), la idea es similar. Si el punto asociado a la punta del dedo índice está "lejos" del resto de puntos (es decir está a x-desviaciones estandar de la media) entonces seguramente el indice está levantado. Ese parámetro *x* también se debe calibrar

### Trabajos futuros
Pudimos observar que esta propuesta tiene mucho potencial, se pueden agregar más gestos para hacer el editor mucho mas completo gestos como:
- Borrar
- Cambiar de color
- Girar la cámara en más dimensiones.

También queda pendiente el ejercicio de poder controlar la profundidad de la cámara para dibujar. A pesar de que el modelo da una aproximación de la profundidad de los puntos, se podría mejorar considerablemente.



{{< details "Código fuente" >}}
```js

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
```
{{< /details >}}


{{<p5-iframe sketch="/VisualComputing/sketches/workshop2/sketch.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib3="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5treegl.js" lib4="https://unpkg.com/ml5@latest/dist/ml5.min.js" width="700" height="1000" >}}



## Bibliografía
- [Multiple Hands Detection in p5.js, Kazuki Umeda YouTube](https://michaelbach.de/ot/mot-feetLin/](https://www.youtube.com/watch?v=BX8ibqq0MJU)
  [[Multiple Hands Detection in p5.js, Kazuki Umeda Repo](https://github.com/Creativeguru97/YouTube_tutorial/tree/master/Play_with_APIs/hand_detection/ml5_handpose)
- [ML5 Reference](https://learn.ml5js.org/#/reference/index)
- [Visual Computing Course Page](https://visualcomputing.github.io/)
