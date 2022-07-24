let camera, scene, renderer, controls;
let shroom_height, stipe_vSegments, stipe_rSegments, stipe_points, stipe_indices, stipe_shape, stipe_shape2;
let circleValues;

const uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
  };

init();

function init() {
  scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );	
  camera.position.x = 7
  camera.position.y = 10
  camera.position.z = 10
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  const axesHelper = new THREE.AxesHelper( 10 ); 
  scene.add( axesHelper );
  group = new THREE.Group();
  scene.add(group);
}
class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1) {

    super();

    this.scale = scale;

  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {

    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}

const path = new CustomSinCurve(10);
const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
let scaleTube = 0.2
mesh.scale.set(scaleTube, scaleTube, scaleTube);

let nnn = new THREE.ImprovedNoise().noise(0.5, 0.5, 0.5)
console.log(nnn)

scene.add(mesh);

animate(0);
function animate(dt) {
  requestAnimationFrame( animate ); 
  dt = dt * 0.001;
	renderer.render( scene, camera );
}
