/**
* @creator:minn
* @qq:394286006
*/
class WebGL {
  constructor() {
    this.webGLEnabled=false;
    this.webGl;
  }

   getWebGL(dom,id){
    let webGL=null;
     try{
        let canvas=dom.getElementById(id);
        canvas.height=$(dom).height();
        canvas.width=$(dom).width();
        webGL=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
        this.webGLEnabled=true;
        webGL.clearDepth(1.0);
        webGL.enable(webGL.DEPTH_TEST);
        webGL.depthFunc(webGL.LEQUAL);
        this.webGL=webGL;
     }catch(e){  
       console.log('init error:'+e);
       this.webGLEnabled=false;
       webGL=null;
     }
    return webGL;
  }

}
export default WebGL;
