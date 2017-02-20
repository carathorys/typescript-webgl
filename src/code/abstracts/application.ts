import '../controls/orbit-controls';

import { Color, PerspectiveCamera, Scene, WebGLRenderer, OrbitControls } from 'three';

export class Application {

  constructor() {
    this._camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    this._camera.position.z = 200;


    this._scene = new Scene();

    this._renderer = new WebGLRenderer({
      antialias: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);


    this._controls = new OrbitControls(this.camera, this._renderer.domElement);

    this._controls.enableZoom = true;

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  public get renderer(): WebGLRenderer {
    return this._renderer;
  }
  private _renderer: WebGLRenderer;

  public get camera(): PerspectiveCamera {
    return this._camera;
  }
  private _camera: PerspectiveCamera;

  public get scene(): Scene {
    return this._scene;
  }
  private _scene: Scene;

  private _controls: OrbitControls;


  public onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public animate(timestamp = null) {
    requestAnimationFrame(this.animate.bind(this));
    this._controls.update();
    this.render();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}