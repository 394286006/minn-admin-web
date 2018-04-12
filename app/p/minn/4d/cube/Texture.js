/**
* @creator:minn
* @qq:394286006
*/
class Texture {
  constructor() {
     this.texture;
  }

  static getInstance(){
    return new Texture();
  }

initTextures(webGL){
    this.texture=webGL.createTexture();
    let image=new Image();
    image.webGL=webGL;
    image.texture=this.texture;
    image.addEventListener('load', this.handTextureLoaded, false);
    image.src='assets/394286006.png';
  }

 
  handTextureLoaded(){
    let webGL=this.webGL;
    webGL.bindTexture(webGL.TEXTURE_2D,this.texture);
    webGL.texImage2D(webGL.TEXTURE_2D,0,webGL.RGBA,webGL.RGBA,webGL.UNSIGNED_BYTE,this);
    webGL.texParameteri(webGL.TEXTURE_2D,webGL.TEXTURE_MAG_FILTER,webGL.LINEAR);
    webGL.texParameteri(webGL.TEXTURE_2D,webGL.TEXTURE_MIN_FILTER,webGL.LINEAR_MIPMAP_NEAREST);
    webGL.generateMipmap(webGL.TEXTURE_2D);
    webGL.bindTexture(webGL.TEXTURE_2D,null);

  }
  
}
export default Texture;
