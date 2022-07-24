let camera, scene, renderer, controls;
let shroom_height, stipe_vSegments, stipe_rSegments, stipe_points, stipe_indices, stipe_shape, stipe_shape2 ;

const uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v4", value: new THREE.Vector4() },
  };

init();


function init() {
  scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );	camera.position.z = 25
  camera.position.x = 0
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
  stipe_vSegments = 20;
  stipe_rSegments = 20;
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
  console.log('points', points);
  const curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject);

  var dotMaterial = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false } );
  var dot = new THREE.Points( geometry, dotMaterial );
  scene.add( dot );
  //console.log('points', points);
  ///////////
  // t - относительное положение среза на stipe_shape, от 0 до 1
  for (var t = 0; t < 1; t += 1 / stipe_vSegments) {
    // форма среза ножки
    var curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( 0, 0, stipe_radius(0, t)),
      new THREE.Vector3( stipe_radius(Math.PI / 2, t), 0, 0 ),
      new THREE.Vector3( 0, 0, -stipe_radius(Math.PI, t)),
      new THREE.Vector3( -stipe_radius(Math.PI * 1.5, t), 0, 0 ),
    ], closed=true, curveType='catmullrom', tension=0.75);
    // вычисляем точки на срезе ножки
    var local_points = curve.getPoints( stipe_rSegments );
    // добавляем точки к мешу
    for (var i = 0; i < local_points.length; i++) {
      var v = local_points[i];
      stipe_points.push(v.x, v.y, v.z);
      //console.log(v);
    }
    const points2 = curve.getPoints(10);
    }
  })()

// console.log('stipe_points', stipe_points);
// const geometry = new THREE.BufferGeometry().setFromPoints(stipe_points);
// console.log(geometry);

// const points = []
// points.push(new THREE.Vector3(-5, 0, 0))
// points.push(new THREE.Vector3(-10, 0, 0))
// let geometry = new THREE.BufferGeometry().setFromPoints( points )
// let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x888888 }))
// scene.add(line)

class CustomSinCurve extends THREE.Curve {

	constructor( scale = 1 ) {

		super();

		this.scale = scale;

	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

	}

}
const repeat = 8;
function myTaper( u ) {
    return 0.5 + 0.5 * Math.sin( u * repeat * Math.PI * 2 );
}
const taper = myTaper( 1 )
const path = new CustomSinCurve( 1 );
const geometry = new THREE.TubeBufferGeometry( path, 20, .1, 16, false, 0.5/0 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

// // Create vertex data for multiple lines
// var p1 = new THREE.Vector3(-85.35, -35.36)
// var p2 = new THREE.Vector3(-50, 0, 0);
// var p3 = new THREE.Vector3(0, 50, 0);
// var p4 = new THREE.Vector3(50, 0, 0);
// var p5 = new THREE.Vector3(85.35, -35.36);
// // Create line 1: straight line
// let line1 = new THREE.LineCurve3(p1,p2);
// // Reconstruct line 2: 3D spline curve
// var curve = new THREE.CatmullRomCurve3([p2, p3, p4]);
// // Create line 3: straight line
// let line2 = new THREE.LineCurve3(p4,p5);
// var CurvePath = new THREE.CurvePath();// Create CurvePath object
// CurvePath.curves.push(line1, curve, line2);// Insert multiple lines
// // Create a generation pipeline through a multi-segment curve path
// // Create a pipeline through a multi-segment curve path, CCurvePath: pipeline path
// var geometry2 = new THREE.TubeGeometry(CurvePath, 100, .5, 5, false);
// const mesh2 = new THREE.Mesh( geometry2, material );
// scene.add( mesh2 );
// // var dotMaterial = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false } );
// // var dot = new THREE.Points( geometry, dotMaterial );
// // scene.add( dot );

animate(0);
function animate(dt) {
  requestAnimationFrame( animate ); 
  dt = dt * 0.001;

  //console.log(shaderMatPoint)

	renderer.render( scene, camera );

}