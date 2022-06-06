import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { NormalMaterial } from "@babylonjs/materials/normal"
import { Engine, Scene, Camera, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    var canvas = document.createElement("canvas");
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.id = "main-canvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    var engine = new Engine(canvas, true);
    var scene = new Scene(engine);

    var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    var box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.material = new NormalMaterial("normal", scene);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
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
    });

  }
}
new App();
