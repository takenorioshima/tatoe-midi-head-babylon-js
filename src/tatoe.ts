import * as BABYLON from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

export default class Tatoe extends BABYLON.AbstractMesh {

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

  skybox: BABYLON.AbstractMesh;

  isTakeLoaded: boolean;
  isEriLoaded: boolean;
  isShapeLoaded: boolean;

  constructor(public scene: BABYLON.Scene) {

    super("tatoe", scene);

    this.metadata = {
      isZoomOut: false
    }

    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "take.glb", scene)
      .then((result) => {
        this.take = result.meshes[0];
        this.take.name = "take";

        const childMeshes = this.take.getChildMeshes();
        this.takeCap = childMeshes[4].addChild(childMeshes[5]);
        this.takeHead = childMeshes[0];
        this.takeGlassL = childMeshes[8];
        this.takeGlassR = childMeshes[1];
        this.takeGlassFrame = childMeshes[3];
        this.takeNose = childMeshes[2];
        this.takeLipTop = childMeshes[6];
        this.takeLipBottom = childMeshes[7];
        this.takeYellowCap = childMeshes[9].addChild(childMeshes[10]);

        this.takeHead.rotationQuaternion = null;
        this.takeGlassL.rotationQuaternion = null;
        this.takeGlassR.rotationQuaternion = null;
        this.takeGlassFrame.rotationQuaternion = null;
        this.takeNose.rotationQuaternion = null;
        this.takeLipTop.rotationQuaternion = null;
        this.takeLipBottom.rotationQuaternion = null;

        childMeshes.forEach((mesh) => {
          (mesh.material as BABYLON.StandardMaterial).ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
          mesh.metadata.initialMaterial = mesh.material.clone("initialMaterial");
        });

        this.takeGlassL.metadata.initialPosition = this.takeGlassL.position;
        this.takeGlassR.metadata.initialPosition = this.takeGlassR.position;
        this.takeGlassFrame.metadata.initialPosition = this.takeGlassFrame.position;
        this.takeLipTop.metadata.initialPosition = this.takeLipTop.position;
        this.takeLipBottom.metadata.initialPosition = this.takeLipBottom.position;

        this.take.metadata = {
          isNormalMaterial: false,
          isWireframed: false,
          isZoomOut: false,
          initialScale: new BABYLON.Vector3(2, 2, 2)
        }

        this.takeGlassL.metadata.isExtended = false;
        this.takeLipTop.metadata.isRotated = false;
        this.takeHead.metadata.isShrinked = false;

        this.take.scaling = this.take.metadata.initialScale;
        this.take.rotation = BABYLON.Vector3.Zero();
        this.takeYellowCap.setEnabled(false);

        this.take.parent = this;

        this.isTakeLoaded = true;
      })
      .catch(console.error);
  }
}
