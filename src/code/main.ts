import {
  TextureLoader,
  BoxGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  Mesh
} from 'three';
import { Application } from './abstracts';

export class Main extends Application {

  constructor() {
    super();
  }
  public start() {
    console.log('<========= Started! =========>');
  }
}
