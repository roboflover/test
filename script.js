let camera, scene, renderer, controls;
let shroom_height, stipe_vSegments, stipe_rSegments, stipe_points, stipe_indices, stipe_shape, stipe_shape2 ;

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

(function createSpline(){
  //////////////////
  shroom_height = 10;
  stipe_vSegments = 10;
  stipe_rSegments = 10;
  stipe_points = [];
  stipe_indices = [];

  function stipe_radius(a, t) {
    return 1;
  }

  //Create a closed wavey loop
  stipe_shape = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( 0, 0, 1 ),
    new THREE.Vector3( 1, shroom_height * 0.25, 0 ),
    new THREE.Vector3( 2, shroom_height * 0.5, 0),
    new THREE.Vector3( 0, shroom_height * 0.75, 0),
    new THREE.Vector3( 1, shroom_height, 0 ),
  ], closed=false, curveType='catmullrom' );

  const points = stipe_shape.getPoints(50);
  const material = new THREE.LineBasicMaterial({ color : 0xff0000 });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //console.log('points', points);
  const curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject);

  var dotMaterial = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false } );
  var dot = new THREE.Points( geometry, dotMaterial );
  scene.add( dot );

  for (var t = 0; t < 1; t += 1 / stipe_vSegments) {
    // форма среза ножки
    var curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 0, 0, stipe_radius(0, t)),
      new THREE.Vector3( stipe_radius(Math.PI / 2, t), 0, 0 ),
      new THREE.Vector3( 0, 0, -stipe_radius(Math.PI, t)),
      new THREE.Vector3( -stipe_radius(Math.PI * 1.5, t), 0, 0 ),
    ], closed=true, curveType='catmullrom', tension=0.75);
    // вычисляем точки на срезе ножки
    
    }
  })()

const points = []
points.push(new THREE.Vector3(-5, 0, 0))
points.push(new THREE.Vector3(-10, 0, 0))
let geometry = new THREE.BufferGeometry().setFromPoints( points )
let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }))
scene.add(line)

let circleValues = []
let yValues = []
let centerX = 0;
let centerY = 0;
let radius = 5
let steps = 20


for (var i = 0; i < steps; i++) {
  let fff = new THREE.Vector3( 
    (centerX + radius * Math.cos(2 * Math.PI * i / steps)), 
    (centerY + radius * Math.sin(2 * Math.PI * i / steps)), 
    0 )
  circleValues.push(fff)
  // xValues[i] = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
  // yValues[i] = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
}
console.log(circleValues)
let geometry2 = new THREE.BufferGeometry().setFromPoints( circleValues )
let line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial({ color: 0x888888 }))
scene.add(line2)

animate(0);
function animate(dt) {
  requestAnimationFrame( animate ); 
  dt = dt * 0.001;
	renderer.render( scene, camera );
}
