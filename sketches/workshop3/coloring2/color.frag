// in glsl it is mandatory to define a precision!
precision mediump float;

uniform float brightness;
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;


void main() {
  gl_FragColor = brightness * uMaterial1 * uMaterial2;
}