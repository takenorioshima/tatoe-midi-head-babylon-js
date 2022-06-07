import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import Tatoe from "./tatoe"
import { Engine, Scene, Camera, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "main-canvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 3, Vector3.Zero(), scene);
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;

    const light: HemisphericLight = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    const tatoe = new Tatoe(scene);

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
      const rect = engine.getRenderingCanvasClientRect();
      const aspect = rect.height / rect.width;
      // In this example we'll set the distance based on the camera's radius.
      camera.orthoLeft = -camera.radius;
      camera.orthoRight = camera.radius;
      camera.orthoBottom = -camera.radius * aspect;
      camera.orthoTop = camera.radius * aspect;
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
