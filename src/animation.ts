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
      if (e.code === "KeyM") {
        this.changeMaterial();
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
      const animation = new BABYLON.Animation("scaleZ", "scaling.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
      const keyFrames = [];
      keyFrames.push({
        frame: 0,
        value: 1
      });
      keyFrames.push({
        frame: frameLength,
        value: 15,
      });
      animation.setKeys(keyFrames);
      this.tatoe.takeGlassL.animations.push(animation);
      this.tatoe.takeGlassR.animations.push(animation);
    }

    if (!this.tatoe.take.metadata.isGlassExtended) {
      this.scene.beginAnimation(this.tatoe.takeGlassL, 0, frameLength);
      this.scene.beginAnimation(this.tatoe.takeGlassR, 0, frameLength);
      this.tatoe.take.metadata.isGlassExtended = true;
    } else {
      this.scene.beginAnimation(this.tatoe.takeGlassL, frameLength, 0);
      this.scene.beginAnimation(this.tatoe.takeGlassR, frameLength, 0);
      this.tatoe.take.metadata.isGlassExtended = false;
    }
  }
}