let camera, scene, renderer, controls;
let stats;
let gui;
let particlesCount = 200;
let geoPoint, geoLine, linesMesh, pointCloud;
let count = 10;
let position = new Float32Array(count * count * 3);
let shaderMatPoint, geoLine1


init();
animate(0);

function init() {

  scene = new THREE.Scene();
  
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 25
  camera.position.x = 0
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  
  const uniforms = {

    time: { type: "f", value: 0 },
    resolution:  { type: "v4", value: new THREE.Vector4() },

  };
  
  shaderMatPoint = new THREE.ShaderMaterial( {
    uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    transparent: true,
  
  } );

  geoPoint = new THREE.BufferGeometry();

  for( let i = 0; i < count; i ++ ) {
    for( let j = 0; j < count; j ++ ) {      
      position.set([
        (i/count - 0.5)*20,
        (j/count - 0.5)*20,
        0
        ], 3*(count * i + j));        
    }
  }
  
  geoPoint.setAttribute( 'position', new THREE.BufferAttribute(position, 3));
  pointCloud = new THREE.Points( geoPoint, shaderMatPoint );
  scene.add(pointCloud)


  // create lines

  let shaderMatLine = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('vertexShaderLine').textContent,
    fragmentShader: document.getElementById('fragmentShaderLine').textContent,
    transparent: true,
  });
  let position2 = [];
  let geoLine1 = new THREE.BufferGeometry(); 
  for(let i = 0; i < 30; i++) {
    position2.unshift(position[i]);
  }
  geoLine1.setAttribute( 'position', new THREE.Float32BufferAttribute( position2, 3 ));
  let linesCloud = new THREE.Line( geoLine1, shaderMatLine );
  scene.add( linesCloud );


}



function animate(dt) {

  requestAnimationFrame( animate ); 
  
  dt = dt * 0.001;

  pointCloud.geometry.attributes.position.needsUpdate = true;
  shaderMatPoint.uniforms.time.value += 0.01;

	renderer.render( scene, camera );

}
