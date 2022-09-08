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