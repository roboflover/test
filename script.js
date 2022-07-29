let camera, scene, renderer, controls, stats
let shroom_height, stipe_vSegments, stipe_rSegments, stipe_points, stipe_indices, stipe_shape, stipe_shape2
let circleValues
const mouse = new THREE.Vector2()
let INTERSECTED
let theta = 0
let meshOk = false
let group2 = new THREE.Object3D()
let cloneGroup
let countMemory

const uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
  }

function init() {
  scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 )	
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 20
  renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )
	document.body.appendChild( renderer.domElement )
  controls = new THREE.OrbitControls( camera, renderer.domElement )
  const axesHelper = new THREE.AxesHelper( 10 )
  stats = new Stats()
	document.body.appendChild( stats.dom )
  document.addEventListener( 'mousemove', onDocumentMouseMove )
  scene.add( axesHelper )
}

init()

function onDocumentMouseMove( event ) {

  event.preventDefault()
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

}

class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t * 2 - 1.5;
    const ty = Math.sin(1 * Math.PI * t)
    const tz = 0;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  }
}

const zPosScale = 1.5;
const Noise = new THREE.ImprovedNoise()
const radialSegments = 32
const tubularSegments = 20
const tubeRadius = 2;
const path = new CustomSinCurve(10)
const geometry = new THREE.TubeBufferGeometry(path, tubularSegments, tubeRadius, radialSegments, false)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
let scaleTube = 0.2
let degree = 40.91
let normal = new THREE.Vector3()
let vertex = new THREE.Vector3()
let ns;
let nScale = 0.25
let normals = []
let vertices = []
let mandalaGroups = []
var v = new THREE.Vector3(0, 1, 0)
var P = new THREE.Vector3()

mesh.scale.set(scaleTube, scaleTube, scaleTube)
mesh.position.applyAxisAngle(v, Math.PI / 2)

for ( i = 0; i <= tubularSegments; i ++ ) {
  var pointAt = i / tubularSegments
  P = path.getPointAt(pointAt, P)
  var N = geometry.normals[ i ]
  var B = geometry.binormals[ i ]
  for ( j = 0; j <= geometry.parameters.radialSegments; j ++ ) {
    var v = j / geometry.parameters.radialSegments * Math.PI * 2
    var sin = Math.sin( v )
    var cos = - Math.cos( v )
    normal.x = ( cos * N.x + sin * B.x )
    normal.y = ( cos * N.y + sin * B.y )
    normal.z = ( cos * N.z + sin * B.z )
    normal.normalize();
    var radius = geometry.parameters.radius;
    radius = radius + ((Math.sin(pointAt * 40 - 1.5)*0.9 ) + Math.sin(pointAt * 3 + 2)) // wave along the path
    ns = Noise.noise(vertex.x * nScale, vertex.y * nScale, j)
    vertex.x = P.x + radius * normal.x
	  vertex.y = P.y + radius * normal.y
	  vertex.z = P.z + radius * normal.z
		vertices.push( vertex.x, vertex.y, vertex.z )
  }
}

mesh.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3))

let lengthX = mesh.geometry.attributes.position.array.length
for(let i = 0; i < lengthX; i++){
  let t = Math.random()*10
  ns = Noise.noise(
    mesh.geometry.attributes.position.array[i + 0] * nScale, 
    mesh.geometry.attributes.position.array[i + 1] * nScale, 
    t);
radialSegments  }
let enemiesCount = 10
let enemies = []

for(let i = 0; i < enemiesCount; i++){
  let structure = new THREE.Group()
  let blade01 = new THREE.Object3D()
  let blade02 = new THREE.Object3D()
  structure.add(blade01)
  structure.add(blade02)
  enemies.push(structure)
}

let iBlade01 = new THREE.InstancedMesh(geometry, material, enemiesCount)
let iBlade02 = new THREE.InstancedMesh(geometry, material, enemiesCount)
let scaleB = -10
let scale = 0.1
iBlade01.position.x = scaleB
iBlade01.position.y = scaleB
iBlade02.position.x = scaleB
iBlade02.position.y = scaleB
scene.add(iBlade01)
scene.add(iBlade02)

enemies.forEach((enemy, enemyIndex)=>{
  let rotX = new THREE.Group()
  enemy.position.set(Math.random()*20, Math.random()*20, 0)
  enemy.scale.set(scale, scale, scale) 
  enemy.children[1].rotation.z = Math.PI / 1
  enemy.updateMatrixWorld(true)
  enemy.children[0].updateMatrix(true)
  enemy.children[1].updateMatrix(true)
  iBlade01.setMatrixAt(enemyIndex, enemy.children[0].matrixWorld)
  iBlade02.setMatrixAt(enemyIndex, enemy.children[1].matrixWorld)
})
iBlade01.instanceMatrix.needsUpdate
iBlade02.instanceMatrix.needsUpdate

animate(0)
function animate(dt) {
  requestAnimationFrame( animate )
  dt = dt * 0.001
  stats.update()
	renderer.render( scene, camera )
}
