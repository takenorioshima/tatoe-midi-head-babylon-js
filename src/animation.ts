import * as BABYLON from '@babylonjs/core'
import Tatoe from './tatoe'

export default class Animation {

  backgroundColorsIndex: number;

  constructor(public tatoe: Tatoe, public scene: BABYLON.Scene, public camera: BABYLON.ArcRotateCamera, public engine: BABYLON.Engine) {

    this.backgroundColorsIndex = 0;

    window.addEventListener("keydown", (e) => {
      console.log(e);
      if (e.code === "KeyB") {
        this.changeBackgroundColor();
      }
      if (e.code === "KeyC") {
        this.changeCameraPosition();
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
}