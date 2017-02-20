import {
  TextureLoader,
  BoxGeometry,
  SphereGeometry,
  PointLight,
  Mesh,
  MeshPhysicalMaterial,
  MeshBasicMaterial,

  ShaderMaterial,
  DoubleSide,
  ShaderLib,
  CubeTextureLoader,
  RGBFormat
} from 'three';
import { Application } from './abstracts';

export class Main extends Application {

  constructor() {
    super();

    // let urls = [
    //   'textures/skybox/side0.png',
    //   'textures/skybox/side1.png',
    //   'textures/skybox/side2.png',
    //   'textures/skybox/side3.png',
    //   'textures/skybox/side4.png',
    //   'textures/skybox/side5.png'
    // ];

    let full = this.textureLoader.load('textures/skybox/original.jpg');

    // setTimeout(() => {
    // let shader = ShaderLib.cube;
    // shader.uniforms['tCube'].value = full;

    // let skyMaterial = new ShaderMaterial({
    //   fragmentShader: shader.fragmentShader,
    //   vertexShader: shader.vertexShader,
    //   uniforms: shader.uniforms,
    //   depthWrite: false,
    //   side: DoubleSide
    // });

    let skybox = new Mesh(new SphereGeometry(500, 500, 500), new MeshBasicMaterial({ color: 0xffffff, map: full, side: DoubleSide }));
    this.scene.add(skybox);
    // })

    let amb = this.textureLoader.load('textures/stone/AmbientOcclusionMap.png');
    let displ = this.textureLoader.load('textures/stone/DisplacementMap.png');
    let normal = this.textureLoader.load('textures/stone/NormalMap.png');
    let specular = this.textureLoader.load('textures/stone/SpecularMap.png');

    let geometry = new BoxGeometry(200, 200, 200);
    let material = new MeshPhysicalMaterial({
      displacementMap: displ,
      envMap: amb,
      normalMap: normal,
      map: specular
    });

    const light = new PointLight(0xFFFFFF, 1);
    light.position.copy(this.camera.position);
    this.scene.add(light);

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(0, 0, -300);
    this.scene.add(this.mesh);
    this.animate();
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


  private _mesh: Mesh;
  public get mesh(): Mesh {
    return this._mesh;
  }
  public set mesh(v: Mesh) {
    this._mesh = v;
  }



  public static start(): Main {
    return new Main();
  }
}
