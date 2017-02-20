import { Color, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export abstract class Application {

  constructor() {
    this._camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    this._scene = new Scene();

    this._renderer = new WebGLRenderer({
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);


    document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
    document.addEventListener('wheel', this.onDocumentMouseWheel.bind(this), false);

    window.addEventListener('resize', this.onWindowResized.bind(this), false);

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


  public onWindowResize(): void {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public animate(timestamp = null): void {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.renderer.render(this.scene, this.camera);
  }

  public onWindowResized(event) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  protected lat: number = 0;
  protected lon: number = 0;

  protected onPointerDownPointerX: number = 0;
  protected onPointerDownPointerY: number = 0;
  protected onPointerDownLon: number = 0;
  protected onPointerDownLat: number = 0;

  protected phi: number = 0;
  protected theta: number = 0;

  public onDocumentMouseDown(event) {

    event.preventDefault();

    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;

    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);

  }

  public onDocumentMouseMove(event) {
    this.lon = (event.clientX - this.onPointerDownPointerX) * 0.1 + this.onPointerDownLon;
    this.lat = (event.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;
  }

  public onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
  }

  public onDocumentMouseWheel(event) {
    this.camera.fov += (event.deltaY * 0.05);
    this.camera.updateProjectionMatrix();
  }


  public abstract render(): void;
}