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
    //Draw the histogram canva
    rect(this._xCanvas, this._yCanvas, this._widthCanvas, this._heightCanvas );
    pop();
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
            rect(this._xCanvas + this._canvasPadding + this._binW*j, this._yCanvas + this._heightCanvas -0.5, Math.floor(this._binW), -(this._heightDCanvas + (this._yCanvas + this._canvasPadding - this.getPosY(this._frequency[i][j]))));
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
