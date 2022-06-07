import * as BABYLON from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

export default class Tatoe {

  take: BABYLON.AbstractMesh;

  constructor(public scene: BABYLON.Scene) {
    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "take.glb", scene)
      .then((result) => {
        this.take = result.meshes[0];
      })
      .catch(console.error);
  }
}
