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
          isZoomOut: false
        }

        this.takeGlassL.metadata.isExtended = false;
        this.takeLipTop.metadata.isRotated = false;
        this.takeHead.metadata.isShrinked = false;

        this.take.scaling = BABYLON.Vector3.One();
        this.take.rotation = BABYLON.Vector3.Zero();
        this.take.position = new BABYLON.Vector3(-0.375, -0.1, 0);
        this.takeYellowCap.setEnabled(false);

        this.take.parent = this;

        this.isTakeLoaded = true;
      })
      .catch(console.error);

    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "eri.glb", scene)
      .then((result) => {

        this.eri = result.meshes[0];
        this.eri.name = "eri";

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

        this.eriEyes.rotationQuaternion = null;
        this.eriHair.rotationQuaternion = null;
        this.eriHat.rotationQuaternion = null;
        this.eriHead.rotationQuaternion = null;
        this.eriStrow.rotationQuaternion = null;
        this.eriNose.rotationQuaternion = null;
        this.eriEarL.rotationQuaternion = null;
        this.eriEarR.rotationQuaternion = null;
        this.eriCheese.rotationQuaternion = null;

        childMeshes.forEach((mesh) => {
          (mesh.material as BABYLON.StandardMaterial).ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
          mesh.metadata.initialMaterial = mesh.material.clone("initialMaterial");
        });

        this.eriHat.metadata.isRotated = false;
        this.eriEyes.metadata.isSwapped = false;

        this.eri.scaling = BABYLON.Vector3.One();
        this.eri.rotation = BABYLON.Vector3.Zero();
        this.eri.position = new BABYLON.Vector3(0.375, -0.1, 0);
        this.eriCheese.setEnabled(false);

        this.eri.parent = this;

        this.isEriLoaded = true;
      })
      .catch(console.error);

    BABYLON.SceneLoader.ImportMeshAsync('', "./models/", "shape.glb", scene)
      .then((result) => {
        this.shape = result.meshes[0];
        this.shape.name = "shape";
        this.shape.scaling = new BABYLON.Vector3(50, 50, 50);

        const childMeshes = this.shape.getChildMeshes();
        childMeshes.forEach((mesh, i) => {
          console.log(`[${i}] ${mesh.id}`);
          (mesh.material as BABYLON.StandardMaterial).ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
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

        this.shape.parent = this;

        this.isShapeLoaded = true;
      })
      .catch(console.error);

    this.skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 5 }, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skybox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/skybox", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    this.skybox.material = skyboxMaterial;
    this.skybox.visibility = 0;
  }
}
