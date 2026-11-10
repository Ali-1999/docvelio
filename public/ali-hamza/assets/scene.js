(() => {
  'use strict';
  const canvas = document.getElementById('webgl-scene');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 420 && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return;
  const gl = canvas.getContext('webgl', { alpha:true,antialias:true,powerPreference:'low-power' });
  if(!gl) return;
  const vs = `attribute vec3 position; attribute vec3 normal; uniform float uTime; uniform float uRotate; uniform float uScroll; uniform vec2 uMouse; uniform mat4 uProjection; varying vec3 vNormal; varying vec3 vPosition; varying float vNoise;
    mat3 rotateY(float a){float s=sin(a),c=cos(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);} mat3 rotateX(float a){float s=sin(a),c=cos(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
    void main(){vec3 p=position;float n=sin(p.x*4.1+uTime*.36)*sin(p.y*3.6-uTime*.31)*sin(p.z*3.7+uTime*.18);p*=1.0+.09*n+.05*sin(p.y*6.0+uTime*.5);mat3 rot=rotateY(uRotate+uMouse.x*.27)*rotateX(.25+uMouse.y*.22+uScroll*.9);p=rot*p;vNormal=normalize(rot*normal);vPosition=p;vNoise=n;float distance=4.0+uScroll*.6;gl_Position=uProjection*vec4(p.x,p.y,p.z-distance,1.0);}`;
  const fs=`precision mediump float;varying vec3 vNormal;varying vec3 vPosition;varying float vNoise;uniform float uTime;uniform float uScroll;
  void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(-.7,1.2,1.6));float diffuse=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,vec3(0.,0.,1.)),0.),2.5);vec3 sage=vec3(.08,.48,.72),ivory=vec3(.48,.86,1.0),deep=vec3(.025,.07,.16);vec3 base=mix(deep,sage,.35+.45*diffuse);base=mix(base,ivory,pow(diffuse,2.2)*.78);base+=vec3(.34,.24,.68)*rim;base+=vec3(.025,.06,.13)*vNoise;float bands=pow(abs(sin(vPosition.y*11.+vPosition.x*3.+uTime*.2)),18.);base+=vec3(.22,.38,.75)*bands*.18;gl_FragColor=vec4(base,1.);}`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn('WebGL shader error');gl.deleteShader(s);return null;}return s;}
  const vert=shader(gl.VERTEX_SHADER,vs),frag=shader(gl.FRAGMENT_SHADER,fs);if(!vert||!frag)return;
  const program=gl.createProgram();gl.attachShader(program,vert);gl.attachShader(program,frag);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
  const vertices=[],normals=[],indices=[];const lat=72,lon=96;
  for(let y=0;y<=lat;y++){const phi=y*Math.PI/lat;for(let x=0;x<=lon;x++){const theta=x*2*Math.PI/lon;const nx=Math.sin(phi)*Math.cos(theta),ny=Math.cos(phi),nz=Math.sin(phi)*Math.sin(theta);vertices.push(nx*1.6,ny*1.6,nz*1.6);normals.push(nx,ny,nz);}}
  for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const a=y*(lon+1)+x,b=a+lon+1;indices.push(a,b,a+1,b,b+1,a+1);}
  function buffer(data,attribute){const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,attribute);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);}
  buffer(vertices,'position');buffer(normals,'normal');const indexBuf=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuf);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
  const uniforms={time:gl.getUniformLocation(program,'uTime'),rotate:gl.getUniformLocation(program,'uRotate'),scroll:gl.getUniformLocation(program,'uScroll'),mouse:gl.getUniformLocation(program,'uMouse'),projection:gl.getUniformLocation(program,'uProjection')};
  const mouse={x:0,y:0};let scroll=0,visible=true,raf=0,last=0,angle=0,contextLost=false;
  window.addEventListener('pointermove',e=>{mouse.x=(e.clientX/window.innerWidth-.5)*2;mouse.y=(e.clientY/window.innerHeight-.5)*2;},{passive:true});
  window.addEventListener('scroll',()=>{scroll=Math.min(1.6,window.scrollY/Math.max(window.innerHeight,1));},{passive:true});
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(draw);});io.observe(canvas);
  function draw(time){raf=0;if(!visible||document.hidden||contextLost)return;const delta=Math.min(.05,(time-last)/1000||0);last=time;angle+=delta*.17;const dpr=Math.min(devicePixelRatio||1,1.5);const w=Math.max(1,Math.floor(canvas.clientWidth*dpr)),h=Math.max(1,Math.floor(canvas.clientHeight*dpr));if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}const aspect=w/h,f=1/Math.tan(.78/2),near=.1,far=100;const proj=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);gl.uniformMatrix4fv(uniforms.projection,false,proj);gl.uniform1f(uniforms.time,time*.001);gl.uniform1f(uniforms.rotate,angle);gl.uniform1f(uniforms.scroll,scroll);gl.uniform2f(uniforms.mouse,mouse.x,mouse.y);gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);raf=requestAnimationFrame(draw);}
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(raf);raf=0;canvas.parentElement.classList.remove('has-webgl');});
  canvas.parentElement.classList.add('has-webgl');raf=requestAnimationFrame(draw);
})();
