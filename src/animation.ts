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
      if (e.code === "Digit5") {
        this.rotateTatoe();
      }
      if (e.code === "Digit8") {
        this.extendGlasses();
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
      if (e.code === "KeyK") {
        this.bounce();
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

    const randomAnimationA = setInterval(() => {
      const number = Math.floor(Math.random() * 6);
      switch (number) {
        case 0:
          this.extendGlasses();
          this.rotateTatoe();
          this.showWireframes();
        case 1:
          this.rotateLips();
          this.shrinkHeads();
        case 2:
          this.extendGlasses();
          this.rotateLips();
          this.showWireframes();
          this.shrinkHeads();
        case 3:
          this.changeMaterial();
          this.dissolve();
          this.rotateLips();
        case 4:
          this.rotateTatoe();
          this.showWireframes();
        default:
          break;
      }
      this.dissolve();
    }, 2000);

    const randomAnimationB = setInterval(() => {
      const number = Math.floor(Math.random() * 5);
      switch (number) {
        case 0:
          this.changeCameraPosition();
        case 1:
          this.changeBackgroundColor();
        case 2:
          this.changeBackgroundColor();
          this.changeCameraPosition();
        default:
          break;
      }
      this.dissolve();
    }, 1500);

  }

  bounce() {
    const totalFrame = 20;
    const tatoe = [this.tatoe.take];

    tatoe.forEach((target) => {
      this._animate("bounce", target, "scaling", totalFrame, new BABYLON.Vector3(1.3, 1.3, 1.3), target.metadata.initialScale, this.easeOutFunction);
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
    const childMeshes = this.tatoe.take.getChildMeshes();

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
    const childMeshes = this.tatoe.take.getChildMeshes();

    if (!this.tatoe.take.metadata.isDissolved) {
      childMeshes.forEach((mesh) => {
        const initialPosition = mesh.metadata.initialPosition ? mesh.metadata.initialPosition : BABYLON.Vector3.Zero();
        this._animate("dissolvePosition", mesh, "position", totalFrame, initialPosition, this._randomVector3(-0.5, 0.5));
        this._animate("dissolveRotation", mesh, "rotation", totalFrame, BABYLON.Vector3.Zero(), this._randomVector3(0, Math.PI * 2));
        this._animate("dissolveScaling", mesh, "scaling", totalFrame, mesh.metadata.initialScale, this._randomVector3(0.2, 2));
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

    this._animate("rotateTake", take, "rotation", totalFrame, take.rotation, this._randomVector3(0, Math.PI * 2));
  }

  showWireframes() {
    const childMeshes = this.tatoe.take.getChildMeshes();

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

    if (!this.tatoe.takeHead.metadata.isShrinked) {
      this._animate("shrinkTakeHead", takeHead, "scaling", totalFrame, this.tatoe.takeHead.scaling, BABYLON.Vector3.Zero());
      this.tatoe.takeHead.metadata.isShrinked = true;
    } else {
      this._animate("unshrinkTakeHead", takeHead, "scaling", totalFrame, this.tatoe.takeHead.scaling, BABYLON.Vector3.One());
      this.tatoe.takeHead.metadata.isShrinked = false;
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

    this.tatoe.takeHead.metadata.isShrinked = false;
    this.tatoe.takeHead.scaling = BABYLON.Vector3.One();

    this.tatoe.takeGlassL.metadata.isExtended = false;
    this.tatoe.takeGlassL.scaling.z = 1;
    this.tatoe.takeGlassR.scaling.z = 1;

    this.tatoe.take.metadata.isDissolved = true;
    this.dissolve();

    this.tatoe.take.metadata.isWireframed = true;
    this.showWireframes();

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
