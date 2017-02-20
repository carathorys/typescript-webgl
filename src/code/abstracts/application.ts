import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export class Application {

  constructor() {
    this._camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this._camera.position.z = 400;

    this._scene = new Scene();

    this._renderer = new WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    // this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    // this._controls.enableDamping = true;
    // this._controls.dampingFactor = 0.25;
    // this._controls.enableZoom = false;

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

  // private _controls: OrbitControls;

  public onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public animate(timestamp) {
    requestAnimationFrame(this.animate.bind(this));
    // this._controls.update();
    this._renderer.render(this._scene, this._camera);
  }
}