import { Application } from './abstracts';
import {
  BoxGeometry,
  BoxBufferGeometry,
  CubeCamera,
  IcosahedronGeometry,
  LinearMipMapLinearFilter,
  Math as ThreeMath,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Material,
  SphereBufferGeometry,
  Texture,
  PointLight,
  TextureLoader,
  TorusKnotBufferGeometry,
  UVMapping
} from 'three';

export class Main extends Application {


  private _count: number;
  public get count(): number {
    return this._count;
  }
  public set count(v: number) {
    this._count = v;
  }

  private sphere: Mesh;
  private torus: Mesh;
  private cube: Mesh;
  private cube2: Mesh;

  private _cubeCamera1: CubeCamera;
  public get cubeCamera1(): CubeCamera {
    return this._cubeCamera1;
  }
  public set cubeCamera1(v: CubeCamera) {
    this._cubeCamera1 = v;
  }

  private _cubeCamera2: CubeCamera;
  public get cubeCamera2(): CubeCamera {
    return this._cubeCamera2;
  }
  public set cubeCamera2(v: CubeCamera) {
    this._cubeCamera2 = v;
  }


  private _material: Material;
  public get material(): Material {
    return this._material;
  }
  public set material(v: Material) {
    this._material = v;
  }

  private _material2: Material;
  public get material2(): Material {
    return this._material2;
  }
  public set material2(v: Material) {
    this._material2 = v;
  }

  constructor() {
    super();

    let full = this.textureLoader.load('textures/skybox/o2.jpg', texture => {
      texture.mapping = UVMapping;
      this.finishInitialization(texture)
      this.animate();
    });
  }

  public finishInitialization(texture: Texture) {

    let skybox = new Mesh(new SphereBufferGeometry(500, 32, 16), new MeshBasicMaterial({ map: texture }));
    skybox.scale.x = -1;
    this.scene.add(skybox);

    let light = new PointLight(0xaaaa00, 3, 1000);
    light.position.set(400, 100, 50);
    this.scene.add(light);

    this.cubeCamera1 = new CubeCamera(1, 1000, 256);
    this.cubeCamera1.renderTarget.texture.minFilter = LinearMipMapLinearFilter;
    this.scene.add(this.cubeCamera1);

    this.cubeCamera2 = new CubeCamera(1, 1000, 256);
    this.cubeCamera2.renderTarget.texture.minFilter = LinearMipMapLinearFilter;
    this.scene.add(this.cubeCamera2);

    this.material = new MeshBasicMaterial({
      color: 0xffffff,
      envMap: this.cubeCamera1.renderTarget.texture
    });
    this.material2 = new MeshPhongMaterial({
      color: 0xffffff,
    });

    this.sphere = new Mesh(new IcosahedronGeometry(20, 3), this.material);
    this.scene.add(this.sphere);

    this.cube = new Mesh(new BoxBufferGeometry(20, 20, 20), this.material);
    this.scene.add(this.cube);

    this.cube2 = new Mesh(new BoxGeometry(500, 20, 500), this.material2);

    this.cube2.position.setY(-70);
    this.scene.add(this.cube2);

    this.torus = new Mesh(new TorusKnotBufferGeometry(10, 5, 100, 25), this.material);
    this.scene.add(this.torus);
    this.count = 0;
  }


  public render() {
    let time = Date.now();

    this.lon += .15;

    this.lat = Math.max(- 85, Math.min(85, this.lat));
    this.phi = ThreeMath.degToRad(90 - this.lat);
    this.theta = ThreeMath.degToRad(this.lon);

    this.cube.position.x = Math.cos(time * 0.001) * 30;
    this.cube.position.y = Math.sin(time * 0.001) * 30;
    this.cube.position.z = Math.sin(time * 0.001) * 30;

    this.cube.rotation.x += 0.02;
    this.cube.rotation.y += 0.03;

    this.torus.position.x = Math.cos(time * 0.001 + 10) * 30;
    this.torus.position.y = Math.sin(time * 0.001 + 10) * 30;
    this.torus.position.z = Math.sin(time * 0.001 + 10) * 30;

    this.torus.rotation.x += 0.02;
    this.torus.rotation.y += 0.03;

    this.camera.lookAt(this.scene.position);
    this.camera.position.x = 100 * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.position.y = 100 * Math.cos(this.phi);
    this.camera.position.z = 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this.sphere.visible = false;

    if (this.count % 2 === 0) {
      (<MeshPhongMaterial>this.material).envMap = this.cubeCamera1.renderTarget.texture;
      this.cubeCamera2.updateCubeMap(this.renderer, this.scene);
    } else {
      (<MeshPhongMaterial>this.material).envMap = this.cubeCamera2.renderTarget.texture;
      this.cubeCamera1.updateCubeMap(this.renderer, this.scene);
    }
    this.sphere.visible = true;
    this.count++;
  }

  private _textureLoader: TextureLoader;
  public get textureLoader(): TextureLoader {
    if (!this._textureLoader)
      this._textureLoader = new TextureLoader();

    return this._textureLoader;
  }
  public set textureLoader(v: TextureLoader) {
    this._textureLoader = v;
  }

  public static start(): Main {
    return new Main();
  }
}
