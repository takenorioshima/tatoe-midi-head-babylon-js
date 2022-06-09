import * as BABYLON from '@babylonjs/core'
import { NormalMaterial } from '@babylonjs/materials'
import Tatoe from './tatoe'

export default class Animation {

  backgroundColorsIndex: number;

  constructor(public tatoe: Tatoe, public scene: BABYLON.Scene, public camera: BABYLON.ArcRotateCamera, public engine: BABYLON.Engine) {

    this.backgroundColorsIndex = 0;

    window.addEventListener("keydown", (e) => {
      console.log(e);
      if (e.code === "Digit8") {
        this.extendGlasses();
      }
      if (e.code === "KeyB") {
        this.changeBackgroundColor();
      }
      if (e.code === "KeyC") {
        this.changeCameraPosition();
      }
      if (e.code === "KeyH") {
        this.rotateHat();
      }
      if (e.code === "KeyM") {
        this.changeMaterial();
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
    const alpha = Math.random() * Math.PI * 2;
    const beta = Math.random() * Math.PI;
    this.camera.alpha = alpha;
    this.camera.beta = beta;

    const zoom = Math.random() * 2 + 3;
    const rect = this.engine.getRenderingCanvasClientRect();
    const aspect = rect.height / rect.width;
    this.camera.orthoLeft = -this.camera.radius / zoom;
    this.camera.orthoRight = this.camera.radius / zoom;
    this.camera.orthoBottom = -this.camera.radius * aspect / zoom;
    this.camera.orthoTop = this.camera.radius * aspect / zoom;
  }

  changeMaterial() {
    if (!this.tatoe.take.metadata.isNormalMaterial) {
      const normalMaterial = new NormalMaterial("normalMaterial", this.scene);
      this.tatoe.take.getChildMeshes().forEach((mesh) => {
        mesh.material = normalMaterial;
      });
      this.tatoe.eri.getChildMeshes().forEach((mesh) => {
        mesh.material = normalMaterial;
      });
      this.tatoe.take.metadata.isNormalMaterial = true;
    } else {
      this.tatoe.take.getChildMeshes().forEach((mesh) => {
        mesh.material = mesh.metadata.initialMaterial;
      });
      this.tatoe.eri.getChildMeshes().forEach((mesh) => {
        mesh.material = mesh.metadata.initialMaterial;
      });
      this.tatoe.take.metadata.isNormalMaterial = false;
    }
  }

  extendGlasses() {
    const frameLength = 7;

    if (!this.tatoe.takeGlassL.animations.length) {
      const s = new BABYLON.Animation("s", "scaling.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
      s.setKeys([
        { frame: 0, value: 1 },
        { frame: frameLength, value: 15 }
      ]);
      this.tatoe.takeGlassL.animations.push(s);
      this.tatoe.takeGlassR.animations.push(s);
    }

    if (!this.tatoe.takeGlassL.metadata.isExtended) {
      this.scene.beginAnimation(this.tatoe.takeGlassL, 0, frameLength);
      this.scene.beginAnimation(this.tatoe.takeGlassR, 0, frameLength);
      this.tatoe.takeGlassL.metadata.isExtended = true;
    } else {
      this.scene.beginAnimation(this.tatoe.takeGlassL, frameLength, 0);
      this.scene.beginAnimation(this.tatoe.takeGlassR, frameLength, 0);
      this.tatoe.takeGlassL.metadata.isExtended = false;
    }
  }

  rotateHat() {
    const frameLength = 7;

    if (!this.tatoe.eriHat.animations.length) {
      const r = new BABYLON.Animation("r", "rotation.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      r.setKeys([
        { frame: 0, value: 0 },
        { frame: frameLength, value: Math.PI * 2 }
      ]);

      const s = new BABYLON.Animation("s", "scaling", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      s.setKeys([
        { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
        { frame: frameLength, value: new BABYLON.Vector3(1.2, 1.2, 1.2) }
      ]);

      const p = new BABYLON.Animation("p", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      p.setKeys([
        { frame: 0, value: 0 },
        { frame: frameLength, value: 0.3 }
      ]);

      this.tatoe.eriHat.animations.push(r);
      this.tatoe.eriHat.animations.push(s);
      this.tatoe.eriHat.animations.push(p);
    }

    if (!this.tatoe.eriHat.metadata.isRotated) {
      this.scene.beginAnimation(this.tatoe.eriHat, 0, frameLength);
      this.tatoe.eriHat.metadata.isRotated = true;
    } else {
      this.scene.beginAnimation(this.tatoe.eriHat, frameLength, 0);
      this.tatoe.eriHat.metadata.isRotated = false;
    }
  }

  reset() {
    this.tatoe.takeGlassL.metadata.isExtended = false;
    this.tatoe.takeGlassL.scaling.z = 1;
    this.tatoe.takeGlassR.scaling.z = 1;

    this.tatoe.eriHat.metadata.isRotated = false;
    this.tatoe.eriHat.position.y = 0;
    this.tatoe.eriHat.scaling = new BABYLON.Vector3(1, 1, 1);
    this.tatoe.eriHat.rotation.y = 0;

    this.tatoe.take.metadata.isNormalMaterial = true;
    this.changeMaterial();
  }
}