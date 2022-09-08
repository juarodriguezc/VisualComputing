let input_val;
let img;
let histogram;
let c;

var colors = ["#FF0000CC", "#00FF00CC", "#0000FFAA"];

let data = [
  Array(2000) // array size is 10
				.fill()
				.map(() => Math.floor(255 * Math.random())),
  Array(2000) // array size is 10
				.fill()
				.map(() => Math.floor(255 * Math.random())),
  Array(2000) // array size is 10
				.fill()
				.map(() => Math.floor(255 * Math.random())),  
  ]


function setup() {
  createCanvas(500, 500);
  
  
  input_val = createFileInput(handleFile);
  input_val.position(0, 600);
  histogram = new Histogram(data,10,100, 1, colors, undefined, 400, 300);
}

function draw() {
  background(125);
  if (img) {
    image(img, 0, 0, 300, 300);
  }
  if(c){
    image(c, 300,300,100,100);
  }
  
  histogram.draw();
  
  loadPixels();
  
  for (let i = 0; i < height; i++) {
    for(let j = 0; j < width; j++){
      //pixels[(i * width + j) * 4 + 0] = 255;
      //pixels[(i * width + j) * 4 + 1] = 0;
      //pixels[(i * width + j) * 4 + 2] = 255;
      pixels[(i * width + j) * 4 + 3] = 125;
    }
  }
  updatePixels();
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
    c = get();
  } else {
    img = null;
  }
}

function mousePressed() {
  print(c);
}