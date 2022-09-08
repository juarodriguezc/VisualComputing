# Visual masking 

Las asdasjdaskd nknskdjankdjnaksdja sdka dkajd akjdanksdjanksdj


## Image kernels

{{< details "Masking" >}}
```js
//Global variables
//Bar variables
let barWidth = 65, barHeight = 22;
let dir = false, moveR = true, showBars = true, showGuide = false;
let speedR = 5;
let xPos = 0, yPos = 180, yDif = 100;
let barsFoot = 4;
//Color selector
let colorOptions = ['blue-yellow', 'red-green', 'grey'];
let colorOptionsInv = {
  'blue-yellow':0,
  'red-green':1,
  'grey':2
}
let colors = [["#000099","#F2F200"],["#4C0000","#00E500"],["#000000","#FFF"]]

let barColors = [["#000","#FFF"],["#333","#CCC"],["#000","#FFF"]]

//Menu variables
let menuWidth = 130;
let selColor;
let colorSelected = 0;
let sliderBars;
let sliderSpeed;
let chbMove;
let chbBars;
let chbGuide;
function setup() {
  frameRate(60);
  createCanvas(705, 475);
  //Create the color selector
  selColor = createSelect();
  for(var option in colorOptions)
    selColor.option(colorOptions[option]);
  selColor.changed(colorSelectEvent);
  selColor.position(width-menuWidth+22, 95);
  //Create the barsFoot slider
  sliderBars = createSlider(1, 10, barsFoot, 1);
  sliderBars.position(width-menuWidth+25, 160);
  sliderBars.style('width', '80px');
  //Create the barsFoot slider
  sliderSpeed = createSlider(1, 20, speedR, 1);
  sliderSpeed.position(width-menuWidth+25, 250);
  sliderSpeed.style('width', '80px');
  //Create checkbox for movement
  chbMove = createCheckbox('Move', moveR);
  chbMove.position(width-menuWidth+18, 330);
  chbMove.changed(moveEvent);
  chbMove.style('font-family: Arial; font-size: 16px;');
  //Create checkbox for show bars
  chbBars = createCheckbox('Show bars', showBars);
  chbBars.position(width-menuWidth+18, 350);
  chbBars.changed(barsEvent);
  chbBars.style('font-family: Arial; font-size: 16px;');

  //Create checkbox for show guide
  chbGuide = createCheckbox('Show guide', showGuide);
  chbGuide.position(width-menuWidth+18, 370);
  chbGuide.changed(guideEvent);
  chbGuide.style('font-family: Arial; font-size: 16px;');

}

function draw() {
  background("#CCC")
  //Update vars
  barsFoot = sliderBars.value()
  nLines = (width-100)/(barWidth/barsFoot)
  speedR = sliderSpeed.value()
  
  noStroke();
  //Define the movement logic
  if(xPos <= 0)
    dir = false;
  if(xPos + barWidth >= width - menuWidth)
    dir = true;
  if(moveR){
    if(dir == false)
      xPos+=(speedR/4);
    else
      xPos-=(speedR/4);
  }
  
  //Draw the vertical lines
  for(var i = 0; i < nLines; i+=2){
    if(showBars){
      noStroke();
      fill(barColors[colorSelected][0]);
      rect(i*(barWidth/barsFoot),0,(barWidth/barsFoot),height);
      fill(barColors[colorSelected][1]);
      rect((i+1)*(barWidth/barsFoot),0,(barWidth/barsFoot),height);
    }
  }
  //Draw the horizontal rect
  fill(colors[colorSelected][1])
  rect(xPos,yPos,barWidth, barHeight);
  fill(colors[colorSelected][0])
  rect(xPos,yPos+yDif,barWidth, barHeight);
  if(showGuide){
    fill("#FF0000");
    rect(xPos,yPos,5,yDif+barHeight);
    rect(xPos+barWidth-5,yPos,5,yDif+barHeight);
  }
    
  //Draw the menu
  drawMenu();
}

function drawMenu(){
  //Menu
  fill("#6674c8");
  rect(width-menuWidth,0,width,height);
  //Title
  fill("black")
  textStyle(BOLD);
  textSize(16);
  text("Parameters",width-menuWidth+16,30);
  //Colors section
  textSize(14);
  textStyle(NORMAL);
  text("Colors",width-menuWidth+35,75);
  //Bars foot section
  text("Bars / Foot",width-menuWidth+22,150);
  stroke("black");
  fill("white")
  rect(width-menuWidth+28,175,60,25);
  noStroke();
  fill("black")
  textSize(16)
  text(barsFoot,width-menuWidth+50,195);
  //Speed section
  text("Speed",width-menuWidth+35,240);
  stroke("black");
  fill("white")
  rect(width-menuWidth+28,265,60,25);
  noStroke();
  fill("black")
  textSize(16)
  text(int(speedR),width-menuWidth+50,285);
}

//Events for menu

function colorSelectEvent() {
  colorSelected = colorOptionsInv[selColor.value()]
}

function moveEvent(){
  moveR = chbMove.checked()
}

function barsEvent(){
  showBars = chbBars.checked()
}

function guideEvent(){
  showGuide = chbGuide.checked()
}
```
{{< /details >}}



{{< p5-iframe sketch="/VisualComputing/sketches/workshop1/2/masking.js" width="725" height="675" >}}


## Image Histogram

{{< details "Histogram class" >}}
```js
//Class for histogram
class Histogram {
  constructor(data, x, y, binWidth = 10, colors = undefined, title="Histogram of different channels", width = 400, height = 300, extStroke = true) {    
    //Values for style
    this.barColDef = []
    this.barColDefC = ["#1F76B470", "#FF7F0E70", "#2CA02C70", "#D6272770", "#9467BD70", "#8C564B70", "#E377C270","#BCBD2270", "#17BECF70"];
    //Get data size
    if(data[0].length == undefined)
      this.data = [data];
    else
      this.data = data;
    this._nData = this.data.length;
    if(colors != undefined){
      if(colors.length < this._nData)
        print("The data and colors dimensions are different");
      this.barColDef = this.barColDef.concat(colors, this.barColDefC);
    }
    else
      this.barColDef = this.barColDefC;
    
    //Set the parameter values    
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.binWidth = binWidth;
    this.extStroke = extStroke;
    this.title = (title == undefined)?undefined:title.toString();
    //Calculate the values for drawing
    this._xCanvas = this.x + this.width * 5/32
    this._yCanvas = (this.title == undefined)?this.y + this.height * 2/32 : this.y + this.height * 3/32;
    this._widthCanvas = this.width * 13/16;
    this._heightCanvas = this.height * 25/32;
    this._canvasPadding = this._widthCanvas / 32;
    //Drawable area
    this._widthDCanvas = this._widthCanvas - 2 * this._canvasPadding;
    this._heightDCanvas = this._heightCanvas - this._canvasPadding;
    this._lineSize = this._widthDCanvas / 80;
    this._nLinesX = 7;
    this._nLinesY = 5;
    //Min and max val from data
    let res = this.getMinMaxData(this.data, this._nData);
    this._minVal = res.min;
    this._maxVal = res.max;
    //Calculate the frequency
    this._frequency = this.getFrequency(this.binWidth);
    this._freqLen = this._frequency[0].length;
    this._binW = this._widthDCanvas / (this._freqLen);
    this._nLinesX = (this._freqLen < this._nLinesX)?this._freqLen:this._nLinesX;
    this._nLinesX = (this._nLinesX == 1)?2:this._nLinesX;
    //Calculate lines for axis X
    this._closerValX = this.getCloserVal((this._maxVal - this._minVal + 1) / (this._nLinesX) );
    this._minX = this.getMinX();
    this._xSpaceLine = Math.ceil((this._maxVal - this._minVal + 1) / this.binWidth * this.binWidth);
    //Calculate lines for axis Y
    this._maxFreq = this.getMinMaxData(this._frequency).max;
    this._closerValY = this.getCloserVal((this._maxFreq + 1) / (this._nLinesY) );
  }
  
  draw(visibleData = undefined){
    strokeWeight(Math.ceil(this.width/1000));
    stroke("#222222");
    push();
    //Delete the stroke if neccesary
    if(!this.extStroke)noStroke();
    //Draw the background of the histogram
    fill("#F9F9F9");
    rect(this.x, this.y, this.width, this.height);
    pop();
    //Draw the histogram canva
    rect(this._xCanvas, this._yCanvas, this._widthCanvas, this._heightCanvas );
    //Draw the title if is defined
    if(this.title !== undefined){
      push();
      noStroke();
      fill("#444444");
      textAlign(CENTER);
      textStyle(BOLD);
      textSize(this.height * 1/20)
      text(this.title, this._xCanvas + (this._widthCanvas / 2), this._yCanvas - 2*this._lineSize);
      pop();
    }
    //Draw lines for horizontal axis
    for(let i = -1; i < this._nLinesX+5; i++){
      if(this.getPosX(this._minX + this._closerValX*i) < this._xCanvas + this._widthCanvas && this.getPosX(this._minX + this._closerValX*i) > this._xCanvas){
        line(this.getPosX(this._minX + this._closerValX*i), this._yCanvas + this._heightCanvas , this.getPosX(this._minX + this._closerValX*i), this._yCanvas + this._heightCanvas + this._lineSize);  
      }
    }
    //Draw numbers for horizontal axis
    push();
    noStroke();
    textAlign(CENTER);
    textSize(this.height * 1/29);
    for(let i = -1; i < this._nLinesX+5; i++){
      if(this.getPosX(this._minX + this._closerValX*i) < this._xCanvas + this._widthCanvas && this.getPosX(this._minX + this._closerValX*i) > this._xCanvas){
        text(this._minX + this._closerValX*i, this.getPosX(this._minX + this._closerValX*i),this._yCanvas + this._heightCanvas + 5*this._lineSize)
      }
    }
    pop();
    
    //Draw lines for vertical axis
    for(let i = 0; i < this._nLinesY+5; i++){
      if(this.getPosY(this._closerValY*i) > this._yCanvas){
        line(this._xCanvas, this.getPosY(this._closerValY*i), this._xCanvas-this._lineSize, this.getPosY(this._closerValY*i));
      }
    }
    
    //Draw numbers for vertical axis
    push();
    noStroke();
    textAlign(RIGHT, CENTER);
    textSize(this.height * 1/28);
    for(let i = 0; i < this._nLinesY+5; i++){
      if(this.getPosY(this._closerValY*i) > this._yCanvas){
        if(this._closerValY >= 10000){
          text((this._closerValY*i).toExponential(), this._xCanvas-(2)*this._lineSize, this.getPosY(this._closerValY*i));
        }
        else{
          text(this._closerValY*i, this._xCanvas-(2)*this._lineSize, this.getPosY(this._closerValY*i));
        }
      }
    }
    pop();
    //Save current state
    push();
    noStroke();
    //Draw the data not Parameter
    if(visibleData == undefined){
      for(let i=0; i < this._nData; i++){
        fill(this.barColDef[i]);
        for(let j = 0; j < this._freqLen; j++){
          //Make it shorter
          rect(this._xCanvas + this._canvasPadding + this._binW*j, this._yCanvas + this._heightCanvas -0.5, this._binW, -(this._heightDCanvas + (this._yCanvas + this._canvasPadding - this.getPosY(this._frequency[i][j]))));
        }
      }
    }else{
      for(let i=0; i < this._nData; i++){
        if(visibleData[i] != false){
          fill(this.barColDef[i]);
          for(let j = 0; j < this._freqLen; j++){
            //Make it shorter
            rect(this._xCanvas + this._canvasPadding + this._binW*j, this._yCanvas + this._heightCanvas -0.5, this._binW, -(this._heightDCanvas + (this._yCanvas + this._canvasPadding - this.getPosY(this._frequency[i][j]))));
          }
        }
      }
    }
    pop();
    
  }
  
  getMinMaxData(data){
    var size = data.length;
    let arrMin = Array(size).fill(0);
    let arrMax = Array(size).fill(0);
    for(let i = 0; i < size; i++){
      let res = this.getMinMaxArr(data[i]);
      arrMin[i] = res.min;
      arrMax[i] = res.max;
    }
    return {min: Math.min.apply(Math, arrMin), max: Math.max.apply(Math, arrMax)};
  }
  
  getMinMaxArr(arr) {
    let min = arr[0];
    let max = arr[0];
    let i = arr.length;

    while (i--) {
      min = arr[i] < min ? arr[i] : min;
      max = arr[i] > max ? arr[i] : max;
    }
    return { min, max };
  }
  
  getFrequency(binWidth){
    
    let freqData = new Array(this._nData);
    
    for(let i = 0; i < this._nData; i++){
      //Create array for frequency
      let freqArray = new Array(Math.ceil((this._maxVal - this._minVal + 1) / binWidth)).fill(0);
      //Calculate frecuency
      for(let j = 0; j < this.data[i].length ; j++){
        freqArray[Math.floor((this.data[i][j] - this._minVal)/binWidth)]++;
      }
      freqData[i] = freqArray;
    }
    
    return freqData;
  }
  
  getCloserVal(step){
    let vals = [1,2,5,10];
    let rVal = Math.round(step);
    if(rVal >= 15){
      let strVal = rVal.toString();
      return (Math.round(rVal / Math.pow(10, strVal.length - 1))) * Math.pow(10, strVal.length - 1)
      
    }else{
      let difArr = Array(vals.length).fill(0);
      for(let i = 0; i<vals.length; i++){
        difArr[i] = Math.abs(rVal - vals[i]);
      }
      let minVal = Math.min.apply(Math, difArr);
      return vals[difArr.indexOf(minVal)];
    }
  }
  
  getMinX(){
    let val = this._minVal;
    while(val % this._closerValX != 0){
      val++;
    }
    return val;
  }
  
  getPosX(x){
    return (x - this._minVal)*(this._widthDCanvas / this._xSpaceLine) + this._xCanvas + this._canvasPadding;
  }
  
  getPosY(y){
    return (this._yCanvas + this._heightCanvas) - (y)*(this._heightDCanvas / this._maxFreq);
  }
  
  
}
```
{{< /details >}}

{{< details "Images histogram" >}}
```js

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


  
```
{{< /details >}}



{{< p5-iframe sketch="/VisualComputing/sketches/workshop1/2/imageHist.js" lib1="/VisualComputing/sketches/workshop1/2/histogram.js"  width="725" height="675" >}}




https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

