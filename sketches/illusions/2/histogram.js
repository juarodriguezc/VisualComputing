let data = Array(400) // array size is 10
				.fill()
				.map(() => Math.floor(255 * Math.random()));

function setup() {
  createCanvas(600, 500);
  test = new Histogram(data,10,100, 10, undefined, 400, 300);
}

function draw() {
  background(220);
  test.draw();
}

//Class for histogram
class Histogram {
  constructor(data, x, y, binWidth = 10,  title="Histogram of R channel", width = 400, height = 300, extStroke = true) {
    //Set the parameter values
    this.data = data
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
    this._canvasPadding = 8;
    //Drawable area
    this._widthDCanvas = this._widthCanvas - 2 * this._canvasPadding;
    this._heightDCanvas = this._heightCanvas - this._canvasPadding;
    this._nLinesX = 7;
    this._nLinesY = 5;
    //Min and max val from data
    this._minVal = Math.min.apply(Math, this.data);
    this._maxVal = Math.max.apply(Math, this.data);
    //Calculate the frequency
    this._frequency = this.getFrequency(this.binWidth);
    this._freqLen = this._frequency.length;
    this._binW = this._widthDCanvas / this._freqLen;
    this._nLinesX = (this._frequency.length < this._nLinesX)?this._frequency.length:this._nLinesX;
    //Calculate lines for axis X
    this._closerValX = this.getcloserVal((this._maxVal - this._minVal + 1) / (this._nLinesX - 1) )
    this._minX = this.getMinX();
    this._xSpaceLine = Math.ceil((this._maxVal - this._minVal + 1) / this.binWidth * this.binWidth);
    //Calculate lines for axis Y
    this._maxFreq = Math.max.apply(Math, this._frequency);
    this._closerValY = this.getcloserVal((this._maxFreq + 1) / (this._nLinesY) )
    
  }
  
  draw(){
    strokeWeight(1);
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
      text(this.title, this._xCanvas + (this._widthCanvas / 2), this._yCanvas - 6);
      pop();
    }
    //Draw lines for horizontal axis
    for(let i = -1; i < this._nLinesX+2; i++){
      if(this.getPosX(this._minX + this._closerValX*i) < this._xCanvas + this._widthCanvas && this.getPosX(this._minX + this._closerValX*i) > this._xCanvas){
        line(this.getPosX(this._minX + this._closerValX*i), this._yCanvas + this._heightCanvas , this.getPosX(this._minX + this._closerValX*i), this._yCanvas + this._heightCanvas + 4);  
      }
    }
    //Draw numbers for horizontal axis
    push();
    noStroke();
    textAlign(CENTER);
    textSize(this.height * 1/25);
    for(let i = -1; i < this._nLinesX+2; i++){
      if(this.getPosX(this._minX + this._closerValX*i) < this._xCanvas + this._widthCanvas && this.getPosX(this._minX + this._closerValX*i) > this._xCanvas){
        text(this._minX + this._closerValX*i, this.getPosX(this._minX + this._closerValX*i),this._yCanvas + this._heightCanvas + 20)
      }
    }
    pop();
    
    //Draw lines for vertical axis
    for(let i = 0; i < this._nLinesY+2; i++){
      if(this.getPosY(this._closerValY*i) > this._yCanvas){
        line(this._xCanvas, this.getPosY(this._closerValY*i), this._xCanvas-3, this.getPosY(this._closerValY*i));
      }
    }
    
    //Draw numbers for vertical axis
    push();
    noStroke();
    textAlign(CENTER);
    textSize(this.height * 1/25);
    for(let i = 0; i < this._nLinesY+2; i++){
      if(this.getPosY(this._closerValY*i) > this._yCanvas){
        text(this._closerValY*i, this._xCanvas-15, this.getPosY(this._closerValY*i)+3);
      }
    }
    pop();
    //Save current state
    push();
    //Draw the data
    noStroke();
    fill("#1F76B4");
    for(let i = 0; i < this._freqLen; i++){
      //Make it shorter
      rect(this._xCanvas + this._binW*i + this._canvasPadding, this._yCanvas + this._heightCanvas -0.5, this._binW + 1, -(this._heightDCanvas + (this._yCanvas + this._canvasPadding - this.getPosY(this._frequency[i]))))
    }
    pop();
    
  }
  
  getFrequency(binWidth){
    //Create array for frequency
    var freqArray = new Array(Math.ceil((this._maxVal - this._minVal + 1) / binWidth)).fill(0);
    //Calculate frecuency
    for(var i = 0; i < this.data.length ; i++){
      freqArray[Math.floor((data[i] - this._minVal)/binWidth)]++;
    }
    return freqArray;
  }
  
  getcloserVal(step){
    var vals = [1,2,5,10];
    var rVal = Math.round(step);
    if(rVal >= 15){
      var strVal = rVal.toString();
      return (Math.round(rVal / Math.pow(10, strVal.length - 1))) * Math.pow(10, strVal.length - 1)
      
    }else{
      var difArr = Array(vals.length).fill(0);
      for(let i = 0; i<vals.length; i++){
        difArr[i] = Math.abs(rVal - vals[i]);
      }
      var minVal = Math.min.apply(Math, difArr);
      return vals[difArr.indexOf(minVal)];
    }
  }
  
  getMinX(){
    var val = this._minVal;
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