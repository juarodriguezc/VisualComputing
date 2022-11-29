# Shaders

## Image processing





{{< details "sketch.js" >}}
```js

let maskShader;
let img;
let video_src;
let video_on;
let mask;

let path = '/VisualComputing/sketches/workshop3/ImageProcessing'

function preload() {
  video_src = createVideo([path+'/img/video.mp4']);
  video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader(path+'/mask.frag', { varyings: Tree.texcoords2 });
  //img = loadImage('/sketches/shaders/tree.jpeg');
  //img = loadImage('./img/lupin.png');
  img = loadImage(path+'/img/cuy.webp');
  //img = loadImage('/sketches/shaders/acacias.jpeg');
  //img = loadImage('/sketches/shaders/honda.jpg');
  //img = loadImage('/sketches/shaders/v.jpg');
  //img = loadImage('/sketches/shaders/v.jpeg');
  //img = loadImage('/sketches/shaders/pictographs.jpg');
  //img = loadImage('/sketches/shaders/honda.png');
  //img = loadImage('/sketches/shaders/fire_breathing.jpg');
  //img = loadImage('/sketches/shaders/lenna.png');
  //img = loadImage('/sketches/shaders/mandrill.png');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  video_on = createCheckbox('video', false);
  video_on.style('color', 'white');
  video_on.changed(() => {
    if (video_on.checked()) {
      maskShader.setUniform('texture', video_src);
      video_src.loop();
    } else {
      maskShader.setUniform('texture', img);
      video_src.pause();
    }
  });
  video_on.position(10, 50);
  prewitt = createCheckbox('prewitt', false);
  prewitt.position(10, 10);
  prewitt.style('color', 'white');
  ridges = createCheckbox('ridges', false);
  ridges.position(10, 30);
  ridges.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  // /*
  if (prewitt.checked()) {
    //maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
    //maskShader.setUniform('mask', [1/16, 2/16, 1/16, 2/16, 4/16, 2/16, 1/16, 2/16, 1/16]);
    maskShader.setUniform('mask', [5, 5, 5, -3, 0, -3, -3, -3, -3]);
    //maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    //maskShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
  }
  else if(ridges.checked()){
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    //maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
  }
  else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  /*
  push();
  noStroke();
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  pop();
  */
  // */
  //quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}

```
{{< /details >}}


{{< details "mask.frag" >}}
```js

precision mediump float;

uniform sampler2D texture;
// see the emitTexOffset() treegl macro
// https://github.com/VisualComputing/p5.treegl#macros
uniform vec2 texOffset;
// holds the 3x3 kernel
uniform float mask[9];

// we need our interpolated tex coord
varying vec2 texcoords2;

void main() {
  // 1. Use offset to move along texture space.
  // In this case to find the texcoords of the texel neighbours.
  vec2 tc0 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = texcoords2 + vec2(         0.0, -texOffset.t);
  vec2 tc2 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = texcoords2 + vec2(-texOffset.s,          0.0);
  // origin (current fragment texcoords)
  vec2 tc4 = texcoords2 + vec2(         0.0,          0.0);
  vec2 tc5 = texcoords2 + vec2(+texOffset.s,          0.0);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = texcoords2 + vec2(         0.0, +texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, +texOffset.t);

  // 2. Sample texel neighbours within the rgba array
  vec4 rgba[9];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);


  // 3. Apply convolution kernel
  vec4 convolution;
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*mask[i];
  }

  // 4. Set color from convolution
  gl_FragColor = vec4(convolution.rgb, 1.0); 
}

```
{{< /details >}}


{{<p5-iframe sketch="/VisualComputing/sketches/workshop3/ImageProcessing/sketch.js"  lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="675" height="525" >}}





## Bibliografía
- [Visual Computing Course Page](https://visualcomputing.github.io/)
