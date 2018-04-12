/**
* @creator:minn
* @qq:394286006
*/
class shader {
  constructor(dom) {
      this.dom=dom;
      this.vertexPositionAttribute;
      this.vertexAttribute;
      this.shaderProgram;
      this.createShader(dom);
  }

  static getInstance(dom){
    return new shader(dom);
  }

  createShader(dom){
    let arr=dom.getElementsByTagName('head');
    arr[arr.length-1].innerHTML+='<script id="shader-fs" type="x-shader/x-fragment"> varying highp vec2 vCube; uniform sampler2D uSampler; void main(void){ gl_FragColor=texture2D(uSampler,vec2(vCube.s,vCube.t));}</script>';
    arr[arr.length-1].innerHTML+='<script id="shader-vs" type="x-shader/x-vertex"> attribute vec3 aVertexPosition ;attribute vec2 aVertexCube; uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying highp vec2 vCube;void main(void){gl_Position=uPMatrix*uMVMatrix*vec4(aVertexPosition,1.0);vCube=aVertexCube;}</script>';
  }

  

initShaders(webGL){

    let fragmentShader=this.getShader(webGL,'shader-fs');
    let vertexShader=this.getShader(webGL,'shader-vs');
    this.shaderProgram=webGL.createProgram();
    webGL.attachShader(this.shaderProgram,vertexShader);
    webGL.attachShader(this.shaderProgram,fragmentShader);
   
    webGL.linkProgram(this.shaderProgram);
    if(!webGL.getProgramParameter(this.shaderProgram,webGL.LINK_STATUS)){
      console.log('create shader fail:'+ webGL.getProgramInfoLog(shaderProgram));
    }
    webGL.useProgram(this.shaderProgram);
    this.vertexPositionAttribute=webGL.getAttribLocation(this.shaderProgram,'aVertexPosition');
    webGL.enableVertexAttribArray(this.vertexPositionAttribute);
    this.vertexAttribute=webGL.getAttribLocation(this.shaderProgram,'aVertexCube');
    webGL.enableVertexAttribArray(this.vertexAttribute);

  }

getShader(webGL,id){
       let shaderScript;
       let theSource;
       let currentChild;
       let shader;
       shaderScript=this.dom.getElementById(id);
       if(!shaderScript){
        return null;
       }
       theSource='';
       currentChild=shaderScript.firstChild;
       while(currentChild){
           if(currentChild.nodeType==currentChild.TEXT_NODE){
               theSource+=currentChild.textContent;
           }
           currentChild=currentChild.nextSibling;
       }

       if(shaderScript.type=='x-shader/x-fragment'){
          shader=webGL.createShader(webGL.FRAGMENT_SHADER);
       }else if(shaderScript.type=='x-shader/x-vertex'){
          shader=webGL.createShader(webGL.VERTEX_SHADER);
       }else{
        return null;
       }
       
       webGL.shaderSource(shader,theSource);
       webGL.compileShader(shader);
      

       if(!webGL.getShaderParameter(shader,webGL.COMPILE_STATUS)){
            console.log('compileShader  fail:'+webGL.getShaderInfoLog(shader));
            return null;
       }

       return shader;
  }

  
}
export default shader;
