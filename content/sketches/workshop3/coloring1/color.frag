// in glsl it is mandatory to define a precision!
precision mediump float;

uniform bool cmy;
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;


void main() {
  gl_FragColor = uMaterial1 * uMaterial2;
}