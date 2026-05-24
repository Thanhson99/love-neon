(function(){
  var canvas = document.getElementById('canvas');
  var gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
    desynchronized: true
  });

  if(!gl){
    console.error('Unable to initialize WebGL.');
    return;
  }

  gl.clearColor(0, 0, 0, 1);

  var vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  var fragmentSource = `
precision highp float;

uniform float width;
uniform float height;
uniform float viewWidth;
uniform float viewHeight;
uniform float heartScale;
uniform float heartYOffset;
vec2 resolution = vec2(width, height);

uniform float time;

#define POINT_COUNT 28

const float PI = 3.14159265359;
const float TAU = 6.28318530718;
float intensity = 0.95;
float radius = 0.011;

vec2 sdBezierWithT(vec2 pos, vec2 A, vec2 B, vec2 C){
  vec2 a = B - A;
  vec2 b = A - 2.0 * B + C;
  vec2 c = a * 2.0;
  vec2 d = A - pos;

  float kk = 1.0 / dot(b, b);
  float kx = kk * dot(a, b);
  float ky = kk * (2.0 * dot(a, a) + dot(d, b)) / 3.0;
  float kz = kk * dot(d, a);

  float res = 0.0;
  float closestT = 0.0;

  float p = ky - kx * kx;
  float p3 = p * p * p;
  float q = kx * (2.0 * kx * kx - 3.0 * ky) + kz;
  float h = q * q + 4.0 * p3;

  if(h >= 0.0){
    h = sqrt(h);
    vec2 x = (vec2(h, -h) - q) / 2.0;
    vec2 uv = sign(x) * pow(abs(x), vec2(1.0 / 3.0));
    closestT = clamp(uv.x + uv.y - kx, 0.0, 1.0);

    vec2 qos = d + (c + b * closestT) * closestT;
    res = length(qos);
  }else{
    float z = sqrt(-p);
    float v = acos(q / (p * z * 2.0)) / 3.0;
    float m = cos(v);
    float n = sin(v) * 1.732050808;
    vec3 ts = vec3(m + m, -n - m, n - m) * z - kx;
    ts = clamp(ts, 0.0, 1.0);

    vec2 qos = d + (c + b * ts.x) * ts.x;
    float dis = dot(qos, qos);
    res = dis;
    closestT = ts.x;

    qos = d + (c + b * ts.y) * ts.y;
    dis = dot(qos, qos);
    if(dis < res){
      res = dis;
      closestT = ts.y;
    }

    qos = d + (c + b * ts.z) * ts.z;
    dis = dot(qos, qos);
    if(dis < res){
      res = dis;
      closestT = ts.z;
    }

    res = sqrt(res);
  }

  return vec2(res, closestT);
}

vec2 getHeartPosition(float t){
  return vec2(
    16.0 * sin(t) * sin(t) * sin(t),
    -(13.0 * cos(t) - 5.0 * cos(2.0 * t) - 2.0 * cos(3.0 * t) - cos(4.0 * t))
  );
}

float getGlow(float dist, float radius, float intensity){
  return pow(radius / max(dist, 0.0001), intensity);
}

float getHeartDistance(vec2 pos, float scale, out float pathT){
  float dist = 10000.0;
  pathT = 0.0;

  for(int i = 0; i < POINT_COUNT; i++){
    float prevT = float(i - 1) / float(POINT_COUNT);
    float pointT = float(i) / float(POINT_COUNT);
    float nextT = float(i + 1) / float(POINT_COUNT);
    vec2 prevPoint = getHeartPosition(prevT * TAU);
    vec2 point = getHeartPosition(pointT * TAU);
    vec2 nextPoint = getHeartPosition(nextT * TAU);
    vec2 curveStart = (prevPoint + point) * 0.5;
    vec2 curveEnd = (point + nextPoint) * 0.5;
    vec2 segment = sdBezierWithT(pos, scale * curveStart, scale * point, scale * curveEnd);

    if(segment.x < dist){
      dist = segment.x;
      pathT = fract((float(i) + segment.y) / float(POINT_COUNT));
    }
  }

  return dist;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float widthHeightRatio = viewWidth / viewHeight;
  vec2 centre = vec2(0.5, 0.5);
  vec2 pos = centre - uv;
  pos.y /= widthHeightRatio;
  pos.y += heartYOffset;

  float scale = 0.000015 * viewHeight * heartScale;

  float pathT = 0.0;
  float dist = getHeartDistance(pos, scale, pathT);
  float glow = getGlow(dist, radius, intensity);

  vec3 pink = vec3(1.0, 0.16, 0.45);
  vec3 cyan = vec3(0.08, 0.68, 1.0);
  vec3 violet = vec3(0.68, 0.22, 0.95);
  float colorWave = 0.5 + 0.5 * sin(TAU * (pathT * 2.0 - time * 0.34));
  float highlightBase = 0.5 + 0.5 * sin(TAU * (pathT - time * 0.42));
  float highlight = highlightBase * highlightBase;
  highlight *= highlight;
  highlight *= highlight;
  vec3 heartColor = mix(pink * 0.94, cyan * 1.08, colorWave);
  heartColor = mix(heartColor, violet, highlight * 0.26);

  float edgeFade = 1.0 - smoothstep(0.72, 1.08, length(pos));
  vec3 col = vec3(0.0);
  col += 10.0 * vec3(smoothstep(0.003, 0.001, dist));
  col += glow * heartColor * 0.95;
  col += highlight * glow * vec3(1.0, 0.9, 1.0) * 0.28;
  col *= edgeFade;

  col = 1.0 - exp(-col);
  gl_FragColor = vec4(col, 1.0);
}
`;

  function compileShader(source, type){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      throw new Error('Shader compile failed: ' + gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  function getAttribLocation(program, name){
    var location = gl.getAttribLocation(program, name);
    if(location === -1){
      throw new Error('Cannot find attribute ' + name + '.');
    }
    return location;
  }

  function getUniformLocation(program, name){
    var location = gl.getUniformLocation(program, name);
    if(!location){
      throw new Error('Cannot find uniform ' + name + '.');
    }
    return location;
  }

  var program = gl.createProgram();
  gl.attachShader(program, compileShader(vertexSource, gl.VERTEX_SHADER));
  gl.attachShader(program, compileShader(fragmentSource, gl.FRAGMENT_SHADER));
  gl.linkProgram(program);
  gl.useProgram(program);

  var vertexData = new Float32Array([
    -1, 1,
    -1, -1,
    1, 1,
    1, -1
  ]);
  var vertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  var positionHandle = getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionHandle);
  gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 8, 0);

  var timeHandle = getUniformLocation(program, 'time');
  var widthHandle = getUniformLocation(program, 'width');
  var heightHandle = getUniformLocation(program, 'height');
  var viewWidthHandle = getUniformLocation(program, 'viewWidth');
  var viewHeightHandle = getUniformLocation(program, 'viewHeight');
  var heartScaleHandle = getUniformLocation(program, 'heartScale');
  var heartYOffsetHandle = getUniformLocation(program, 'heartYOffset');
  var resizeFrame = 0;

  function resizeCanvas(){
    var isMobile = window.innerWidth < 700;
    var renderScale = isMobile ? 0.48 : 0.56;
    canvas.width = Math.floor(window.innerWidth * renderScale);
    canvas.height = Math.floor(window.innerHeight * renderScale);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(widthHandle, canvas.width);
    gl.uniform1f(heightHandle, canvas.height);
    gl.uniform1f(viewWidthHandle, window.innerWidth);
    gl.uniform1f(viewHeightHandle, window.innerHeight);
    var heartScale = window.LoveNeon.getHeartScale(window.innerWidth, window.innerHeight);
    gl.uniform1f(heartScaleHandle, heartScale);
    gl.uniform1f(heartYOffsetHandle, window.LoveNeon.getHeartYOffset(heartScale));
  }

  function draw(now){
    if(document.hidden){
      requestAnimationFrame(draw);
      return;
    }

    gl.uniform1f(timeHandle, now * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function(){
    if(resizeFrame){
      return;
    }

    resizeFrame = requestAnimationFrame(function(){
      resizeFrame = 0;
      resizeCanvas();
    });
  });
  resizeCanvas();
  requestAnimationFrame(draw);
})();
