import * as BABYLON from '@babylonjs/core'
import Tatoe from './tatoe'

export default class Animation {

  backgroundColorsIndex: number;

  constructor(public tatoe: Tatoe, public scene: BABYLON.Scene) {

    this.backgroundColorsIndex = 0;

    window.addEventListener("keydown", (e) => {
      console.log(e);
      if (e.code === "KeyB") {
        this.changeBackgroundColor();
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
}