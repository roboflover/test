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
const geometry = new THREE.TubeBufferGeometry(path, 20, 2, 8, false);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
let scaleTube = 0.2;
mesh.scale.set(scaleTube, scaleTube, scaleTube);

let x;
let y;
let z = 0;
let positions  = [];
let nnn = new THREE.ImprovedNoise().noise(0.5, 0.5, 0.5);
let ns;
let nScale = 0.25
const Noise = new THREE.ImprovedNoise();
console.log('mesh', mesh)
let vertices;
let lengthX = mesh.geometry.attributes.position.array.length
for(let i = 0; i < lengthX; i++){
  let t = Math.random()*10
  ns = Noise.noise(
    mesh.geometry.attributes.position.array[i + 0] * nScale, 
    mesh.geometry.attributes.position.array[i + 1]  * nScale, 
    t);
  // x = mesh.geometry.attributes.position.array[i + 0]
  // y = mesh.geometry.attributes.position.array[i + 1]
  // z = mesh.geometry.attributes.position.array[i + 2]
  //let {x, y, z} = mesh.geometry.attributes.position.array[i];
  //positions .push(x, y, z);
  
  //mesh.geometry.computeBoundingSphere();
  //mesh.geometry.attributes.position.array
  
  }
  //mesh.geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  // console.log(vertices)
  scene.add(mesh);


  (function () {
 

 
    // GEOMETRY - starting with a cube
    var geometry = new THREE.BoxGeometry(1, 1, 1);
 
    // check out the position attribute of a cube
    var position = geometry.getAttribute('position');
    console.log( position.count ); // 24
    console.log( position.array.length ); // 72
    console.log( position.count * 3 === position.array.length); // true
    var index = geometry.getIndex();
    console.log( index.count );      // 36
    console.log( 2 * 6 );            // 12 ( number of triangles )
    console.log( index.count / 3);   /* 12 (index.count / 3 === number of triangles ) */
 
    // mutating a position
    var vertIndex = index.array[0] * 3;
    position.array[vertIndex] = 1;
    position.needsUpdate = true;
 
    
    // use the geometry with a mesh
    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
    }));
    scene.add(mesh);

 
 
}
    ());

animate(0);
function animate(dt) {
  requestAnimationFrame( animate ); 
  dt = dt * 0.001;
	renderer.render( scene, camera );
}