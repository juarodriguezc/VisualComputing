let path = "/VisualComputing/sketches/workshop1/2/";

//Global variables
let dWidth;


let kernels = {
  sobelo: [1,2,3,4,5,6,7,8,9],
  test2: [9,8,7,6,5,4,3,2,1],
  
}
let selKernel = kernels.sobelo;

let imagesPath = {
  mandrill: [0, path+"img/mandrill.png"],
  sunset: [1, path+"/img/sunset.jpg"],
  mandrill2: [2, path+"img/mandrill.png"],
}
  

  
let selImage = imagesPath.mandrill;
let img;
let aspectRatio = 0;

let images = []

//Menu variables
let mWidth;
let kernelInp = new Array(9);
let selectKernel;
let selectImg;
let btApply;
let imgInput;


function setup() {
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
}

function draw() {
  background("#EEE");
  if (img) {
    //img.resize(0, (height-50) / 2);
    image(img,dWidth / 2, 5 * height /20, ((height-50) / 2) * aspectRatio, (height-50) / 2);
    image(img,dWidth / 2, 15 * height /20, ((height-50) / 2) * aspectRatio, (height-50) / 2);
  }
  
  drawMenu("#6674C8");
  
}


function drawMenuInputs(){
  

  //Botón para aplicar el filtro
  btApply = createButton('Aplicar');
  btApply.position(dWidth + 25, 250);
  btApply.style("textAlign: center; width:100px;");
  btApply.mousePressed(handleApply);
  
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
  

  
  //Image selector
  selectImg = createSelect();
  selectImg.style("width:120px; textAlign: center;")
  for(var image in imagesPath)    
    selectImg.option(image);
  selectImg.position(dWidth + 14, 380);
  selectImg.changed(imageSelEvent);
  
  
  
  
  //Input para cargar la imagen
  imgInput = createFileInput(handleFile);
  imgInput.size(130,40);
  imgInput.position(dWidth + 14, 460);
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
  text("Kernel", dWidth + mWidth / 2, 30);
  //Draw select kernel section
  textSize(12);
  textStyle(NORMAL);
  text("Selecciona el kernel:", dWidth + mWidth / 2, 195);
  //Draw select image section
  textSize(12);
  textStyle(BOLD);
  text("Selecciona la imagen", dWidth + mWidth / 2, 350);
  text("O carga la imagen", dWidth + mWidth / 2, 440);
  
  
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

function imageSelEvent(){
  selImage = imagesPath[selectImg.value()];
  img = images[selImage[0]];
  aspectRatio = img.width / img.height;
}

function handleFile(file) {
  if (file.type === 'image') {
    img = (createImg(file.data, ''));
    aspectRatio = img.width / img.height;
    img.hide();
  } else {
    img = null;
  }
}

function handleApply(){
  
}
