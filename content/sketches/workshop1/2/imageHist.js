let path = "/VisualComputing/sketches/workshop1/2/img/";

//Global variables
let dWidth;

let imagesPath = {
  mandrill: [0, path+"mandrill.png"],
  sunset: [1, path+"sunset.jpg"],
  landscape: [2, path+"landscape.jpg"],
  astronaut: [3, path+"astronaut.jpg"],
}
  
  
let selImage = imagesPath.mandrill;
let img;
let aspectRatio = 0;

let images = []

//Menu variables
let mWidth;
let selectImg;
let imgInput;

let histogram;

let cImgLoad = -2;

let colors = ["#FF000099", "#00FF0099", "#0000FF99", "#9F9FBE99", "#D1DA4899"];

let data = [];

//RGB, LUMA, SUM
let showChannel = [true, true, true, false, false];
let namesButtons = ['R','G','B',"LUM","SUM"];
let buttons = [];
let btUpdate;


function setup() {
  pixelDensity(1);
  createCanvas(705, 650);
  //Set vars of canvas
  mWidth = width * 1/5;
  dWidth = width - mWidth;
  //Draw inputs
  drawMenuInputs();
  //Load default images
  for(let image in imagesPath){
    images[imagesPath[image][0]] = loadImage(imagesPath[image][1]);
  }
  img = images[selImage[0]];
  aspectRatio = img.width / img.height;
  imageMode(CENTER);
  histogram = new Histogram([0],30,10 * height /15 - 175, 1, colors, undefined, 500, 350);
  
  for(i = 0; i < 5; i++){
    buttons[i] = createButton(namesButtons[i]);
    buttons[i].style("width:100px");
    if(showChannel[i] == true)
      buttons[i].style("background-color: rgb(160,252,133);");
    else
      buttons[i].style("background-color: rgb(255,255,255);");
    buttons[i].position(dWidth + 20, 400 + 30*i);
    
  }
  buttons[0].mousePressed(bt0Ch);
  buttons[1].mousePressed(bt1Ch);
  buttons[2].mousePressed(bt2Ch);
  buttons[3].mousePressed(bt3Ch);
  buttons[4].mousePressed(bt4Ch);
  
  
  btUpdate = createButton("Actualizar datos");
  btUpdate.style("background-color: rgb(197,197,197); width:120px; height: 40px;");
  btUpdate.position(dWidth + 10, 300);
  btUpdate.mousePressed(updateData);
  
  
  
  
}


function draw() {
  background("#EEE");
  if (img) {
    
    if(img.width != 0 && img.height != 0 && cImgLoad == 0){
      aspectRatio = img.width / img.height;
      cImgLoad++;
    }
    image(img,dWidth / 2, 3 * height /15, ((height-50) / 3) * aspectRatio, (height-50) / 3);
    if(img.width != 0 && img.height != 0 && cImgLoad == 1){
      //Calculate values
      loadPixels();
      data = getRGBLAlt(pixels, ((height-50) / 3) * aspectRatio, (height-50) / 3, dWidth / 2, 3 * height /15);
      updatePixels();
      //Create new histogram
      histogram = new Histogram(data,30,10 * height /15 - 175, 1, colors, undefined, 500, 350);
      cImgLoad++;
    }
    if(img.width > 1 && img.height > 1 && cImgLoad == -2){
        //Calculate values
        img.loadPixels();
        data = getRGBL(img.pixels, img.width, img.height);

        img.updatePixels();
        //Create new histogram
        histogram = new Histogram(data,30,10 * height /15 - 175, 1, colors, undefined, 500, 350);
        cImgLoad++;
    }
    histogram.draw(showChannel);
  }
  drawMenu("#6674C8");
}


function drawMenuInputs(){
  //Image selector
  selectImg = createSelect();
  selectImg.style("width:120px; textAlign: center;")
  for(var image in imagesPath)    
    selectImg.option(image);
  selectImg.position(dWidth + 14, 120);
  selectImg.changed(imageSelEvent);
  selectImg.option("Personalizada");
  selectImg.disable("Personalizada");
  
  //Input para cargar la imagen
  imgInput = createFileInput(handleFile);
  imgInput.size(130,40);
  imgInput.position(dWidth + 14, 200);
  imgInput.style("textAlign: center; ")
  
}

function drawMenu(color){
  //Draw menu rect
  noStroke();
  fill(color);
  rect(dWidth,0,width,height);
  //Draw the kernel section
  fill("#000");
  textAlign(CENTER);
  textSize(17);
  textStyle(BOLD);
  text("Masking", dWidth + mWidth / 2, 50);
  //Draw select image section
  textSize(12);
  textStyle(BOLD);
  text("Selecciona la imagen", dWidth + mWidth / 2, 100);
  text("O carga la imagen", dWidth + mWidth / 2, 180);
  
  
}


//Events



function imageSelEvent(){
  selImage = imagesPath[selectImg.value()];
  img = images[selImage[0]];
  aspectRatio = img.width / img.height;
  cImgLoad = -1;
  
  //Calculate values
  img.loadPixels();
  data = getRGBL(img.pixels, img.width, img.height);
  img.updatePixels();
  //Create new histogram
  histogram = new Histogram(data,30,10 * height /15 - 175, 1, colors, undefined, 500, 350);
  
  
}

function handleFile(file) {
  if (file.type === 'image') {
    img = (createImg(file.data, ''));
    img.hide();
    cImgLoad = 0;
    selectImg.selected("Personalizada");
    
  } else {
    img = null;
  }
}

function updateData(){
  cImgLoad = -1;
  //Calculate values
  img.loadPixels();
  data = getRGBL(img.pixels, img.width, img.height);
  img.updatePixels();
  //Create new histogram
  histogram = new Histogram(data,30,10 * height /15 - 175, 1, colors, undefined, 500, 350);
  
}


function getRGBL(data, width, height){
  //Create arrays for each channel
  var R = Array(data.length / 4).fill(0);
  var G = Array(data.length / 4).fill(0);
  var B = Array(data.length / 4).fill(0);
  var A = Array(data.length / 4).fill(0);
  var L = Array(data.length / 4).fill(0);
  //Iterate the data
  for(i = 0; i < height; i++){
    for(j = 0; j < width; j++){
      R[j + width * i] = data[(j + width * i)*4];
      G[j + width * i] = data[(j + width * i)*4 + 1];
      B[j + width * i] = data[(j + width * i)*4 + 2];
      A[j + width * i] = data[(j + width * i)*4 + 3];
    }
  }
  var SUM = R.concat(G,B);
  for(i = 0; i < R.length; i++){
    L[i] = getLuma(R[i], G[i], B[i]);
  }
  
  var temp = [R, G, B, L, SUM];
  var retVal = [];
  for(let i = 0; i < 5; i++){
    if(showChannel[i] == true){
      retVal[i] = temp[i];
    }else{
      retVal[i] = [0];
    }
  }
  return retVal;
}

function getRGBLAlt(dataImg, w, h, x, y){
  w = Math.floor(w);
  h = Math.floor(h);
  //Create arrays for each channel
  var R = Array(Math.ceil(w * h)).fill(0);
  var G = Array(Math.ceil(w * h)).fill(0);
  var B = Array(Math.ceil(w * h)).fill(0);
  var A = Array(Math.ceil(w * h)).fill(0);
  var L = Array(Math.ceil(w * h)).fill(0);
  var SUM = Array(Math.ceil(w * h)).fill(0);
  //Create start and end vars
  let xStart = x - w / 2;
  let yStart = y - h / 2;
  let xEnd = x + w / 2;
  let yEnd = y +h / 2;  
  for(let i = yStart, i2 = 0; i < yEnd; i++, i2++ ){
    let j2=0;
    for(let j = xStart, j2=0; j < xEnd; j++, j2++){
      R[j2 + w * i2] = dataImg[(j + width * i)*4];
      G[j2 + w * i2] = dataImg[(j + width * i)*4 + 1];
      B[j2 + w * i2] = dataImg[(j + width * i)*4 + 2];
      A[j2 + w * i2] = dataImg[(j + width * i)*4 + 3];
    }
  }
  for(i = 0; i < R.length; i++){
    L[i] = getLuma(R[i], G[i], B[i]);
  }
  
  var temp = [R, G, B, L, SUM];
  var retVal = [];
  for(let i = 0; i < 5; i++){
    if(showChannel[i] == true){
      retVal[i] = temp[i];
    }else{
      retVal[i] = [0];
    }
  }
  
  return retVal;
}

function getLuma(R, G, B){
  return 0.299 * R + 0.587 * G + 0.114 * B;
}


function bt0Ch(){
  showChannel[0] = !showChannel[0];
  if(showChannel[0] == true)
    buttons[0].style("background-color: rgb(160,252,133);");
  else
    buttons[0].style("background-color: rgb(255,255,255);");
}

function bt1Ch(){
  showChannel[1] = !showChannel[1];
  if(showChannel[1] == true)
    buttons[1].style("background-color: rgb(160,252,133);");
  else
    buttons[1].style("background-color: rgb(255,255,255);");
}

function bt2Ch(){
  showChannel[2] = !showChannel[2];
  if(showChannel[2] == true)
    buttons[2].style("background-color: rgb(160,252,133);");
  else
    buttons[2].style("background-color: rgb(255,255,255);");
}

function bt3Ch(){
  showChannel[3] = !showChannel[3];
  if(showChannel[3] == true)
    buttons[3].style("background-color: rgb(160,252,133);");
  else
    buttons[3].style("background-color: rgb(255,255,255);");
}

function bt4Ch(){
  showChannel[4] = !showChannel[4];
  if(showChannel[4] == true)
    buttons[4].style("background-color: rgb(160,252,133);");
  else
    buttons[4].style("background-color: rgb(255,255,255);");
}

