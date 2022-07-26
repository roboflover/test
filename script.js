let camera, scene, renderer, controls, stats;
let shroom_height, stipe_vSegments, stipe_rSegments, stipe_points, stipe_indices, stipe_shape, stipe_shape2;
let circleValues;
const mouse = new THREE.Vector2();
let INTERSECTED;
//let theta = 0;
let meshOk = false;
let group2 = new THREE.Object3D();
let cloneGroup;
let countMemory;

const uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
  };
  const effectController = {

    count: 5,
    speed: .03,
    // jsDepthCalculation: true,
    // shaderFocus: false,
    //
    fstop: 2.8,
    // maxblur: 1.0,
    //
    delete: false,
    focalDepth: 3,
    manualdof: false,
    vignetting: false,
    // depthblur: false,
    //
    // threshold: 0.5,
    // gain: 2.0,
    // bias: 0.5,
    // fringe: 0.7,
    //
    // focalLength: 35,
    // noise: true,
    // pentagon: false,
    //
    // dithering: 0.0001

  };

function init() {
  scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );	
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 20
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  const axesHelper = new THREE.AxesHelper( 10 ); 
  stats = new Stats();
	document.body.appendChild( stats.dom );
  document.addEventListener( 'mousemove', onDocumentMouseMove );
  scene.add( axesHelper );
  // const gui = new g();
  // gui.add( effectController, 'count', 1, 135, 1 );
  // gui.add( effectController, 'fstop', 1.8, 22, 0.01 );
  // gui.add( effectController, 'focalDepth', 0.1, 100, 0.001 );
  // gui.add( effectController, 'delete', true );
  raycaster = new THREE.Raycaster();
}

init();

function onDocumentMouseMove( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t * 2 - 1.5;
    const ty = Math.sin(1 * Math.PI * t);
    const tz = 0;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}

const radialSegments = 32;
const tubularSegments = 20;
const tubeRadius = 2;
const path = new CustomSinCurve(10);
const geometry = new THREE.TubeBufferGeometry(path, tubularSegments, tubeRadius, radialSegments, false);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
let scaleTube = 0.2;
mesh.scale.set(scaleTube, scaleTube, scaleTube);
let point = new THREE.Vector3(0.0, 0.0, 0.0);
let axis = new THREE.Vector3(0.0, 0.0, 1.0);
let theta = Math.PI / 0.5
mesh.position.sub(point); // remove the offset
mesh.position.applyAxisAngle(axis, theta); // rotate the POSITION
mesh.position.add(point); // re-add the offset
//mesh.getCenter(1.0,1.0,1.0)
mesh.position.x = - 0.8
mesh.position.y = - 0.5
mesh.rotation.z = 0.0//Math.PI / 0.2

var normal = new THREE.Vector3();
var vertex = new THREE.Vector3();
var P = new THREE.Vector3();
var normals = [];
var vertices = [];

let ns;
let nScale = 0.25
const zPosScale = 1.5;
const Noise = new THREE.ImprovedNoise();

for ( i = 0; i <= tubularSegments; i ++ ) {
  var pointAt = i / tubularSegments;
  P = path.getPointAt(pointAt, P);
  //P = geometry.attributes.position[ i ]
  
  var N = geometry.normals[ i ];
  var B = geometry.binormals[ i ];

  for ( j = 0; j <= geometry.parameters.radialSegments; j ++ ) {
    var v = j / geometry.parameters.radialSegments * Math.PI * 2; 
    var sin = Math.sin( v );
    var cos = - Math.cos( v );
    normal.x = ( cos * N.x + sin * B.x );
    normal.y = ( cos * N.y + sin * B.y );
    normal.z = ( cos * N.z + sin * B.z )
    // normal.x = ( N.x + B.x);
    // normal.y = ( N.y + B.y);
    // normal.z = ( N.z + B.z)
    normal.normalize(); 
    var radius = geometry.parameters.radius;
    //radius += Math.abs(Math.sin(v * 2.5)); // radial half-waves
    //radius += Math.sin(pointAt * Math.PI * 4 - 1.2); // wave along the path

    radius = radius + ((Math.sin(pointAt * 40 - 1.5)*0.9 ) + Math.sin(pointAt * 3 + 2)); // wave along the path

    ns = Noise.noise(vertex.x * nScale, vertex.y * nScale, j);
    
    vertex.x = P.x + radius * normal.x;
	  vertex.y = P.y + radius * normal.y;
	  vertex.z = P.z + radius * normal.z;  
    //console.log(vertex)
		vertices.push( vertex.x, vertex.y, vertex.z );
  }
  //normal.applyAxisAngle(geometry.tangents[ i ], pointAt * Math.PI * 2); // twisting
}
//console.log(vertices)
//console.log(geometry.tangents);

geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
scene.add(mesh)

// function rotateMesh(angleNumber, mesh){
//   if(!meshOk){
//     meshOk = true;
//     let xPosOffset = 3.0
//     for(let i = 0; i < angleNumber; i++){
//       let group = new THREE.Object3D();
//       var newMesh = mesh.clone();
//       newMesh.position.x = xPosOffset
//       group.add(newMesh)
//       let angleZ = Math.PI / (angleNumber);
//       console.log(angleZ)
//       group.rotation.z = (angleZ * i)*2;
//       group2.add(group)
//       countMemory = angleNumber
//     }
//     scene.add(group2)
//   }
// }
//rotateMesh(effectController.count, mesh)
// cloneGroup = group2.clone()
// cloneGroup.rotation.x = Math.PI
// scene.add(cloneGroup)
// var newQueen = mesh.clone();
// newQueen.position.x = xPosOffset;
// mesh.position.x = xPosOffset;
// scene.add(group)
// group.add(newQueen)
// group.rotation.z = 1.5;
//group.add(mesh);

let lengthX = mesh.geometry.attributes.position.array.length
for(let i = 0; i < lengthX; i++){
  let t = Math.random()*10
  ns = Noise.noise(
    mesh.geometry.attributes.position.array[i + 0] * nScale, 
    mesh.geometry.attributes.position.array[i + 1] * nScale, 
    t);
radialSegments  }

animate(0);
function animate(dt) {
  requestAnimationFrame( animate ); 
  dt = dt * 0.001;

// find intersections

raycaster.setFromCamera( mouse, camera );

const intersects = raycaster.intersectObjects( scene.children, false );
group2.rotation.z +=  effectController.speed 
//cloneGroup.rotation.z +=  effectController.speed
//rotateMesh(effectController.count, mesh)




//

// if ( camera.postprocessing.enabled ) {

//   camera.renderCinematic( scene, renderer );

// } else {

//   scene.overrideMaterial = null;

//   renderer.clear();
//   renderer.render( scene, camera );

// }


  stats.update();
	renderer.render( scene, camera );
}
