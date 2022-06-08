import * as BABYLON from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

export default class Tatoe {

  take: BABYLON.AbstractMesh;
  eri: BABYLON.AbstractMesh;
  shape: BABYLON.AbstractMesh;

  takeCap: BABYLON.AbstractMesh;
  takeHead: BABYLON.AbstractMesh;
  takeGlassL: BABYLON.AbstractMesh;
  takeGlassR: BABYLON.AbstractMesh;
  takeGlassFrame: BABYLON.AbstractMesh;
  takeNose: BABYLON.AbstractMesh;
  takeLipTop: BABYLON.AbstractMesh;
  takeLipBottom: BABYLON.AbstractMesh;
  takeYellowCap: BABYLON.AbstractMesh;

  eriEyes: BABYLON.AbstractMesh;
  eriHair: BABYLON.AbstractMesh;
  eriHat: BABYLON.AbstractMesh;
  eriHead: BABYLON.AbstractMesh;
  eriStrow: BABYLON.AbstractMesh;
  eriNose: BABYLON.AbstractMesh;
  eriEarL: BABYLON.AbstractMesh;
  eriEarR: BABYLON.AbstractMesh;
  eriCheese: BABYLON.AbstractMesh;

  shapeTa1: BABYLON.AbstractMesh;
  shapeTa2: BABYLON.AbstractMesh;
  shapeTa3: BABYLON.AbstractMesh;
  shapeTo1: BABYLON.AbstractMesh;
  shapeTo2: BABYLON.AbstractMesh;
  shapeE1: BABYLON.AbstractMesh;
  shapeE2: BABYLON.AbstractMesh;
  shapeE3: BABYLON.AbstractMesh;
  shapeE4: BABYLON.AbstractMesh;

  isTakeLoaded: boolean;
  isEriLoaded: boolean;
  isShapeLoaded: boolean;

  constructor(public scene: BABYLON.Scene) {

    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "take.glb", scene)
      .then((result) => {
        this.take = result.meshes[0];
        this.take.position = new BABYLON.Vector3(0.375, -0.1, 0);
        this.take.metadata = { isNormalMaterial: false }

        const childMeshes = this.take.getChildMeshes();
        this.takeHead = childMeshes[0];
        this.takeGlassR = childMeshes[1];
        this.takeNose = childMeshes[2];
        this.takeGlassFrame = childMeshes[3];
        childMeshes[5].parent = childMeshes[4];
        this.takeCap = childMeshes[4];
        this.takeLipTop = childMeshes[6];
        this.takeLipBottom = childMeshes[7];
        this.takeGlassL = childMeshes[8];
        childMeshes[10].parent = childMeshes[9];
        this.takeYellowCap = childMeshes[9];
        this.takeYellowCap.setEnabled(false);

        childMeshes.forEach((mesh) => {
          mesh.metadata.initialMaterial = mesh.material.clone("initialMaterial");
        });

        this.isTakeLoaded = true;
      })
      .catch(console.error);

    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "eri.glb", scene)
      .then((result) => {
        this.eri = result.meshes[0];
        this.eri.position = new BABYLON.Vector3(-0.375, -0.1, 0);

        const childMeshes = this.eri.getChildMeshes();
        this.eriEyes = childMeshes[0];
        this.eriHair = childMeshes[1];
        this.eriHat = childMeshes[2];
        this.eriHead = childMeshes[3];
        this.eriStrow = childMeshes[4];
        this.eriNose = childMeshes[5];
        this.eriEarL = childMeshes[6];
        this.eriEarR = childMeshes[7];
        this.eriCheese = childMeshes[8];
        this.eriCheese.setEnabled(false);

        childMeshes.forEach((mesh) => {
          mesh.metadata.initialMaterial = mesh.material.clone("initialMaterial");
        });

        this.isEriLoaded = true;
      })
      .catch(console.error);

    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "shape.glb", scene)
      .then((result) => {
        this.shape = result.meshes[0];
        this.shape.scaling = new BABYLON.Vector3(100, 100, 100);

        const childMeshes = this.shape.getChildMeshes();
        childMeshes.forEach((mesh, i) => {
          console.log(`[${i}] ${mesh.id}`);
        })

        this.shapeTa1 = childMeshes[0];
        this.shapeTa2 = childMeshes[1];
        this.shapeTa3 = childMeshes[2];
        this.shapeTo1 = childMeshes[4];
        this.shapeTo2 = childMeshes[7];
        this.shapeE1 = childMeshes[3];
        this.shapeE2 = childMeshes[6];
        this.shapeE3 = childMeshes[9];
        this.shapeE4 = childMeshes[5];

        this.isShapeLoaded = true;
      })
      .catch(console.error);
  }
}
