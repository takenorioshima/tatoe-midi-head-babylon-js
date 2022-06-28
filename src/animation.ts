import * as BABYLON from '@babylonjs/core'
import { NormalMaterial } from '@babylonjs/materials'
import Tatoe from './tatoe'

export default class Animation {

  backgroundColorsIndex: number;
  fps: number;
  easeOutFunction: BABYLON.CircleEase;

  constructor(public tatoe: Tatoe, public scene: BABYLON.Scene, public camera: BABYLON.ArcRotateCamera, public engine: BABYLON.Engine) {

    this.backgroundColorsIndex = 0;
    this.fps = 60;
    this.easeOutFunction = new BABYLON.CircleEase();
    this.easeOutFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

    window.addEventListener("keydown", (e) => {
      console.log(e);
      if (e.code === "Digit1") {
        this.moveShape(1);
      }
      if (e.code === "Digit2") {
        this.moveShape(2);
      }
      if (e.code === "Digit3") {
        this.moveShape(3);
      }
      if (e.code === "Digit4") {
        this.moveShape(4);
      }
      if (e.code === "Digit5") {
        this.rotateTatoe();
        this.moveShape(5);
      }
      if (e.code === "Digit6") {
        this.moveShape(6);
      }
      if (e.code === "Digit7") {
        this.moveShape(7);
      }
      if (e.code === "Digit8") {
        this.extendGlasses();
      }
      if (e.code === "Digit0") {
        this.moveShape(0);
      }
      if (e.code === "KeyB") {
        this.changeBackgroundColor();
      }
      if (e.code === "KeyC") {
        this.changeCameraPosition();
      }
      if (e.code === "KeyD") {
        this.dissolve();
      }
      if (e.code === "KeyE") {
        this.swapEyes();
      }
      if (e.code === "KeyH") {
        this.rotateHat();
      }
      if (e.code === "KeyL") {
        this.rotateLips();
      }
      if (e.code === "KeyM") {
        this.changeMaterial();
      }
      if (e.code === "KeyS") {
        this.shrinkHeads();
      }
      if (e.code === "KeyW") {
        this.showWireframes();
      }
      if (e.code === "KeyZ") {
        this.zoomOut();
      }
      if (e.code === "Escape") {
        this.reset();
      }
    });
  }

  changeBackgroundColor() {
    const backgroundColors = ["#33BF4F", "#DC4829", "#FFD000", "#2D94CE", "#B7BC9B"];
    this.scene.clearColor = BABYLON.Color4.FromHexString(backgroundColors[this.backgroundColorsIndex]);
    this.backgroundColorsIndex++;
    if (this.backgroundColorsIndex >= backgroundColors.length) {
      this.backgroundColorsIndex = 0;
    }
  }

  changeCameraPosition() {
    const camera = this.camera;
    const alpha = Math.random() * Math.PI * 2;
    const beta = Math.random() * Math.PI;

    const zoom = Math.random() * 2 + 3;
    const rect = this.engine.getRenderingCanvasClientRect();
    const aspect = rect.height / rect.width;

    camera.alpha = alpha;
    camera.beta = beta;

    camera.orthoLeft = -camera.radius / zoom;
    camera.orthoRight = camera.radius / zoom;
    camera.orthoBottom = -camera.radius * aspect / zoom;
    camera.orthoTop = camera.radius * aspect / zoom;
  }

  changeMaterial() {
    const childMeshes = this.tatoe.take.getChildMeshes().concat(this.tatoe.eri.getChildMeshes());

    if (!this.tatoe.take.metadata.isNormalMaterial) {
      childMeshes.forEach((mesh) => {
        mesh.material = new NormalMaterial("normalMaterial", this.scene);
      });
      this.tatoe.take.metadata.isNormalMaterial = true;
    } else {
      childMeshes.forEach((mesh) => {
        mesh.material = mesh.metadata.initialMaterial;
      });
      this.tatoe.take.metadata.isNormalMaterial = false;
    }
  }

  dissolve() {
    const totalFrame = 30;
    const childMeshes = this.tatoe.take.getChildMeshes().concat(this.tatoe.eri.getChildMeshes());

    if (!this.tatoe.take.metadata.isDissolved) {
      childMeshes.forEach((mesh) => {
        const initialPosition = mesh.metadata.initialPosition ? mesh.metadata.initialPosition : BABYLON.Vector3.Zero();
        this._animate("dissolvePosition", mesh, "position", totalFrame, initialPosition, this._randomVector3(-0.5, 0.5));
        this._animate("dissolveRotation", mesh, "rotation", totalFrame, BABYLON.Vector3.Zero(), this._randomVector3(0, Math.PI * 2));
        this._animate("dissolveScaling", mesh, "scaling", totalFrame, BABYLON.Vector3.One(), this._randomVector3(0.2, 2));
      });
      this.tatoe.take.metadata.isDissolved = true;
    } else {
      childMeshes.forEach((mesh) => {
        const initialPosition = mesh.metadata.initialPosition ? mesh.metadata.initialPosition : BABYLON.Vector3.Zero();
        this._animate("dissolvePosition", mesh, "position", totalFrame, mesh.position, initialPosition);
        this._animate("dissolveRotation", mesh, "rotation", totalFrame, mesh.rotation, BABYLON.Vector3.Zero());
        this._animate("dissolveScaling", mesh, "scaling", totalFrame, mesh.scaling, BABYLON.Vector3.One());
      });
      this.tatoe.take.metadata.isDissolved = false;
    }
  }

  extendGlasses() {
    const totalFrame = 7;
    const targets = [this.tatoe.takeGlassL, this.tatoe.takeGlassR];

    if (!this.tatoe.takeGlassL.metadata.isExtended) {
      targets.forEach((target) => {
        this._animate("extend", target, "scaling.z", totalFrame, target.scaling.z, 15);
      });
      this.tatoe.takeGlassL.metadata.isExtended = true;
    } else {
      targets.forEach((target) => {
        this._animate("extend", target, "scaling.z", totalFrame, target.scaling.z, 1);
      });
      this.tatoe.takeGlassL.metadata.isExtended = false;
    }
  }

  moveShape(shapeIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1) {
    const totalFrame = 30;
    const targets = [
      this.tatoe.shapeTa1,
      this.tatoe.shapeTa2,
      this.tatoe.shapeTa3,
      this.tatoe.shapeTo1,
      this.tatoe.shapeTo2,
      this.tatoe.shapeE1,
      this.tatoe.shapeE2,
      this.tatoe.shapeE3,
    ];
    const target = targets[shapeIndex];

    if (!target.metadata.isAffected) {
      this._animate("scaleShape", target, "scaling", totalFrame, target.scaling, this._randomVector3(0.1, 3));
      this._animate("rotateShape", target, "rotation", totalFrame, target.rotation, this._randomVector3(Math.PI * -2, Math.PI * 2));
      target.metadata.isAffected = true;
    } else {
      this._animate("scaleShape", target, "scaling", totalFrame, target.scaling, BABYLON.Vector3.One());
      this._animate("rotateShape", target, "rotation", totalFrame, target.rotation, BABYLON.Vector3.Zero());
      target.metadata.isAffected = false;
    }
  }

  rotateHat() {
    const totalFrame = 15;
    const target = this.tatoe.eriHat;

    if (!target.metadata.isRotated) {
      this._animate("scaleHat", target, "scaling", totalFrame, target.scaling, new BABYLON.Vector3(1.2, 1.2, 1.2));
      this._animate("rotateHat", target, "rotation.y", totalFrame, target.rotation.y, Math.PI * 2);
      this._animate("moveHat", target, "position.y", totalFrame, target.position.y, 0.3);
      target.metadata.isRotated = true;
    } else {
      this._animate("scaleHat", target, "scaling", totalFrame, target.scaling, BABYLON.Vector3.One());
      this._animate("rotateHat", target, "rotation.y", totalFrame, target.rotation.y, 0);
      this._animate("moveHat", target, "position.y", totalFrame, target.position.y, 0);
      target.metadata.isRotated = false;
    }
  }

  rotateLips() {
    const totalFrame = 15;
    const lipTop = this.tatoe.takeLipTop;
    const lipBottom = this.tatoe.takeLipBottom;

    if (!lipTop.metadata.isRotated) {
      this._animate("rotateLipTop", lipTop, "rotation.y", totalFrame, lipTop.rotation.y, Math.PI * 2);
      this._animate("rotateLipBottom", lipBottom, "rotation.y", totalFrame, lipBottom.rotation.y, -Math.PI * 2);
      lipTop.metadata.isRotated = true;
    } else {
      this._animate("rotateLip", lipTop, "rotation.y", totalFrame, lipTop.rotation.y, 0);
      this._animate("rotateLipBottom", lipBottom, "rotation.y", totalFrame, lipBottom.rotation.y, 0);
      this.tatoe.takeLipTop.metadata.isRotated = false;
    }
  }

  rotateTatoe() {
    const totalFrame = 15;
    const take = this.tatoe.take;
    const eri = this.tatoe.eri;

    this._animate("rotateTake", take, "rotation", totalFrame, take.rotation, this._randomVector3(0, Math.PI * 2));
    this._animate("rotateEri", eri, "rotation", totalFrame, eri.rotation, this._randomVector3(0, Math.PI * 2));
  }

  showWireframes() {
    const childMeshes = this.tatoe.take.getChildMeshes().concat(this.tatoe.eri.getChildMeshes());

    if (!this.tatoe.take.metadata.isWireframed) {
      childMeshes.forEach((mesh) => {
        mesh.material.wireframe = true;
      });
      this.tatoe.take.metadata.isWireframed = true;
    } else {
      childMeshes.forEach((mesh) => {
        mesh.material.wireframe = false;
        mesh.material = mesh.metadata.initialMaterial;
      })
      this.tatoe.take.metadata.isWireframed = false;
    }
  }

  shrinkHeads() {
    const totalFrame = 7;
    const takeHead = this.tatoe.takeHead;
    const eriHead = this.tatoe.eriHead;

    if (!this.tatoe.takeHead.metadata.isShrinked) {
      this._animate("shrinkTakeHead", takeHead, "scaling", totalFrame, this.tatoe.takeHead.scaling, BABYLON.Vector3.Zero());
      this._animate("shrinkEriHead", eriHead, "scaling", totalFrame, this.tatoe.eriHead.scaling, BABYLON.Vector3.Zero());
      this.tatoe.takeHead.metadata.isShrinked = true;
    } else {
      this._animate("unshrinkTakeHead", takeHead, "scaling", totalFrame, this.tatoe.takeHead.scaling, BABYLON.Vector3.One());
      this._animate("unshrinkEriHead", eriHead, "scaling", totalFrame, this.tatoe.eriHead.scaling, BABYLON.Vector3.One());
      this.tatoe.takeHead.metadata.isShrinked = false;
    }
  }

  swapEyes() {
    const glasses = new BABYLON.TransformNode("glasses", this.scene);
    this.tatoe.takeGlassL.parent = glasses;
    this.tatoe.takeGlassR.parent = glasses;
    this.tatoe.takeGlassFrame.parent = glasses;

    if (!this.tatoe.eriEyes.metadata.isSwapped) {
      glasses.parent = this.tatoe.eri;
      glasses.position.y = -0.05;
      this.tatoe.eriEyes.parent = this.tatoe.take;
      this.tatoe.eriEyes.position.y = 0.05;
      this.tatoe.eriEyes.position.z = -0.015;
      this.tatoe.eriEyes.metadata.isSwapped = true;
    } else {
      glasses.parent = this.tatoe.take;
      glasses.position.y = 0;
      this.tatoe.eriEyes.parent = this.tatoe.eri;
      this.tatoe.eriEyes.position = BABYLON.Vector3.Zero();
      this.tatoe.eriEyes.metadata.isSwapped = false;
    }
  }

  zoomOut() {
    const totalFrame = 60;

    if (!this.tatoe.metadata.isZoomOut) {
      this._animate("zoomOut", this.tatoe, "scaling", totalFrame, this.tatoe.scaling, new BABYLON.Vector3(0.02, 0.02, 0.02));
      this.tatoe.shape.getChildMeshes().forEach((mesh) => {
        this._animate("fadeIn", mesh, "visibility", 20, 0, 1);
      });
      this._animate("fadeIn", this.tatoe.skybox, "visibility", 40, this.tatoe.skybox.visibility, 1);
      this.tatoe.metadata.isZoomOut = true;
    } else {
      this._animate("zoomIn", this.tatoe, "scaling", totalFrame, this.tatoe.scaling, BABYLON.Vector3.One());
      this.tatoe.shape.getChildMeshes().forEach((mesh) => {
        this._animate("fadeOut", mesh, "visibility", 20, 1, 0);
      });
      this._animate("fadeIn", this.tatoe.skybox, "visibility", 40, this.tatoe.skybox.visibility, 0);
      this.tatoe.metadata.isZoomOut = false;
    }
  }

  reset() {
    this.tatoe.take.rotation = BABYLON.Vector3.Zero();
    this.tatoe.eri.rotation = BABYLON.Vector3.Zero();

    this.tatoe.takeHead.metadata.isShrinked = false;
    this.tatoe.takeHead.scaling = BABYLON.Vector3.One();
    this.tatoe.eriHead.scaling = BABYLON.Vector3.One();

    this.tatoe.takeGlassL.metadata.isExtended = false;
    this.tatoe.takeGlassL.scaling.z = 1;
    this.tatoe.takeGlassR.scaling.z = 1;

    this.tatoe.eriHat.metadata.isRotated = false;
    this.tatoe.eriHat.position.y = 0;
    this.tatoe.eriHat.scaling = BABYLON.Vector3.One();
    this.tatoe.eriHat.rotation.y = 0;

    this.tatoe.take.metadata.isDissolved = true;
    this.dissolve();

    const shapeMeshes = [
      this.tatoe.shapeTa1,
      this.tatoe.shapeTa2,
      this.tatoe.shapeTa3,
      this.tatoe.shapeTo1,
      this.tatoe.shapeTo2,
      this.tatoe.shapeE1,
      this.tatoe.shapeE2,
      this.tatoe.shapeE3,
    ];
    shapeMeshes.forEach((mesh) => {
      this._animate("resetShape", mesh, "scaling", 10, mesh.scaling, BABYLON.Vector3.One());
      this._animate("resetShape", mesh, "rotation", 10, mesh.rotation, BABYLON.Vector3.Zero());
    });

    this.tatoe.eriEyes.metadata.isSwapped = true;
    this.swapEyes();

    this.tatoe.take.metadata.isNormalMaterial = true;
    this.changeMaterial();
  }

  private _animate(name: string, target: any, targetProperty: string, totalFrame: number, from: any, to: any, easingFunction?: BABYLON.CircleEase) {
    easingFunction = easingFunction ? easingFunction : this.easeOutFunction;
    BABYLON.Animation.CreateAndStartAnimation(name, target, targetProperty, this.fps, totalFrame, from, to, 0, easingFunction);
  }

  private _randomVector3(min: number, max: number) {
    return new BABYLON.Vector3(
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
      Math.random() * (max - min) + min,
    );
  }
}
