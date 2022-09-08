let margin = 150;
let originX = margin;
let showResult = false;
let opacity = 200;
let button;

function setup() {
  createCanvas(700, 300);
  button = createButton('ShowResult');
  button.position(10, 10);
  button.mousePressed(toggleResult);
}

function draw() {
  background(255, 255, 255);
  
  strokeWeight(7);
  stroke(0, 0, 255, opacity);
  line(margin, height/2, width-margin, height/2);
  
  //First semi-triangle
  line(margin/2, height/4, margin, height/2);
  line(margin/2, 3*height/4, margin, height/2);
  
  //Second semi-triangle
  line(width-3*margin/2, height/4, width-margin, height/2);
  line(width-3*margin/2, 3*height/4, width-margin, height/2);
  
  //Custom triangle
  if(mouseIsPressed == true && mouseX > button.width && mouseY > button.height){
    originX = mouseX
  }
  line(originX+margin/2, height/4, originX, height/2);
  line(originX+margin/2, 3*height/4, originX, height/2);
  
  //important points
  stroke(0, 0, 255);
  point(margin, height/2);
  point(width-margin, height/2);
  point(originX, height/2);
  
  if(showResult){
    strokeWeight(3);
    stroke(0, 255, 0);
    let sizeResult = 5;
    line(width/2, height/2-sizeResult, width/2, height/2+sizeResult);
    text('Error: '+ round(abs(originX/(width/2)-1) * 100)+ '%', 100, 10);
  }
  
}

function toggleResult(){
  showResult = !showResult;
  opacity = 255 - opacity;
}