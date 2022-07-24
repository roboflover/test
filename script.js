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
    const ty = 1.0//Math.sin(2 * Math.PI * t);
    const tz = 0;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}
const radialSegments = 8;
const tubularSegments = 20;
const radius = 2;
const path = new CustomSinCurve(10);
const geometry = new THREE.TubeBufferGeometry(path, tubularSegments, radius, radialSegments, false);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
let scaleTube = 0.2;
mesh.scale.set(scaleTube, scaleTube, scaleTube);
scene.add(mesh);

var normal = new THREE.Vector3();
var vertex = new THREE.Vector3();
var P = new THREE.Vector3();
var normals = [];
var vertices = [];

for ( i = 0; i <= tubularSegments; i ++ ) {
  var pointAt = i / tubularSegments;
  P = path.getPointAt(pointAt, P);
  //console.log(P);
  for ( j = 0; j <= radialSegments; j ++ ) {
    
  }
}


let ns;
let nScale = 0.25
const Noise = new THREE.ImprovedNoise();
let lengthX = mesh.geometry.attributes.position.array.length
for(let i = 0; i < lengthX; i++){
  let t = Math.random()*10
  ns = Noise.noise(
    mesh.geometry.attributes.position.array[i + 0] * nScale, 
    mesh.geometry.attributes.position.array[i + 1] * nScale, 
    t);
radialSegments  }
  //mesh.geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  //console.log(mesh)
animate(0);
function animate(dt) {
  requestAnimationFrame( animate ); 
  dt = dt * 0.001;
	renderer.render( scene, camera );
}
