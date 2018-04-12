/**
* @creator:minn
* @qq:394286006
*/
class DataBuffer {
  constructor() {
      this.verticesBuffer;
      this.verticesTextureCoordBuffer;
      this.verticesIndexBuffer;
  }

  static getInstance(){
    return new DataBuffer();
  }

 initBuffers(webGL){
      this.verticesBuffer=webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER,this.verticesBuffer);

      let vertices=[
       // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
      ];
      

      webGL.bufferData(webGL.ARRAY_BUFFER,new Float32Array(vertices),webGL.STATIC_DRAW);

      this.verticesTextureCoordBuffer=webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, this.verticesTextureCoordBuffer);
      let textureCoordinates = [
          // Front
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Back
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Top
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Bottom
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Right
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0,
          // Left
          0.0,  0.0,
          1.0,  0.0,
          1.0,  1.0,
          0.0,  1.0
        ];

        webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(textureCoordinates),
              webGL.STATIC_DRAW);

    
      this.verticesIndexBuffer=webGL.createBuffer();
      webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER,this.verticesIndexBuffer);


      let verticesIndex=[
                       0, 1,  2,  0,  2,  3,  //font
                       4, 5,  6,  4,  6,  7,  //back
                       8, 9, 10,  8, 10, 11,  //top
                       12,13,14,  12,14, 15,  //bootom
                       16,17,18,  16,18, 19,  //right
                       20,21,22,  20,22, 23   //left

                        ];

      webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER,new Uint16Array(verticesIndex),webGL.STATIC_DRAW);



    }
  
}
export default DataBuffer;
