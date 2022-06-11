import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import Tatoe from "./tatoe"
import Animation from "./animation"
import * as BABYLON from "@babylonjs/core";

class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "main-canvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color4.FromHexString("#B7BC9B");
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 3, BABYLON.Vector3.Zero(), scene);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, -1), scene);

    const tatoe = new Tatoe(scene);
    const animation = new Animation(tatoe, scene, camera, engine);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    const onResize = () => {
      const zoom = 4;
      const rect = engine.getRenderingCanvasClientRect();
      const aspect = rect.height / rect.width;
      camera.orthoLeft = -camera.radius / zoom;
      camera.orthoRight = camera.radius / zoom;
      camera.orthoBottom = -camera.radius * aspect / zoom;
      camera.orthoTop = camera.radius * aspect / zoom;
    }
    onResize();
    window.addEventListener('resize', onResize);

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
      camera.alpha += 0.005;
    });

  }
}
new App();
