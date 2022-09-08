//Global variables
let dWidth;
let img;


let kernels = {
  sobelo: [1,2,3,4,5,6,7,8,9],
  test2: [9,8,7,6,5,4,3,2,1],
  
}
let selKernel = kernels.sobelo;



//Menu variables
let mWidth;
let input;
let kernelInp = new Array(9);
let selectKernel;
let btApply;


function setup() {
  createCanvas(705, 475);

  mWidth = width * 1/5;
  dWidth = width - mWidth;
  
  //Input para cargar la imagen
  input = createFileInput(handleFile);
  input.position(0, 0);
  input.size(200,200);
  input.style("textAlign: center; flex-direction: row;")

  //Botón para aplicar el filtro
  btApply = createButton('Aplicar');
  btApply.position(dWidth + 25, 250);
  btApply.style("textAlign: center; width:100px;");
  btApply.mousePressed(handleApply);
  
  drawMenuInputs();
  
  
  
}

function draw() {
  background("#EEE");
  if (img) {
    image(img, 0, 0, 200, 200);
  }
  drawMenu("#6674C8");
  
}


function drawMenuInputs(){
  //Kernel matrix input
  for(var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
      var val = selKernel[3*i+j].toString();
      kernelInp[3*i+j] = createInput(val);
      kernelInp[3*i+j].style("textAlign: center;")
      kernelInp[3*i+j].size(20,20);
      kernelInp[3*i+j].position(dWidth + 15 + (j * 40) + 10, 60 +i*40);
    }
  }
  //Kernel selector
  selectKernel = createSelect();
  selectKernel.style("width:120px; textAlign: center;")
  for(var ker in kernels)
    selectKernel.option(ker);
  selectKernel.position(dWidth + 20, 210);
  selectKernel.changed(kernelSelEvent);
  
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
  text("Kernel", dWidth + mWidth / 2, 30);
  //Draw select kernel section
  textSize(12);
  textStyle(NORMAL);
  text("Selecciona el kernel:", dWidth + mWidth / 2, 195);
  
}

function updateKernel(){
  //Update kernel matrix input
  for(var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
      var val = selKernel[3*i+j].toString();
      kernelInp[3*i+j].value(val);
    }
  }
}


//Events

function kernelSelEvent(){
  selKernel = kernels[selectKernel.value()];
  updateKernel();
  
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
  } else {
    img = null;
  }
}

function handleApply(){
  
}