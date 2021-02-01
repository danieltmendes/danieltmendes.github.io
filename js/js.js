//*******************************************
//************* Navigation ******************
//*******************************************

function gotoSection(section, offset)
{
  if(offset == undefined) offset = 0;
  $("html, body").stop().animate({scrollTop:$("." + section).offset().top-offset}, '500');
}

//*******************************************
//*********** PUBLICATIONS ******************
//*******************************************

function showAllPublications()
{
  $(".filter.all").hide();
  $(".filter.selected").show();
  $(".year.all").stop().slideDown();
  $(".publication.all").stop().slideDown();
}

function showSelectedPublications()
{
  $(".filter.all").show();
  $(".filter.selected").hide();
  $(".year.all").stop().slideUp();
  $(".publication.all").stop().slideUp();
}

var lastshown = "";

function showPublications(type)
{
  $(".publication").stop().slideUp();
  if(lastshown != type)
  {
    $(".publication" + "." + type).stop().slideDown(function() { gotoSection("y" + type, 60); });
    lastshown = type;
  }
  else
  {
    lastshown = "";
  }
}

//*******************************************
//*************** 3D Model ******************
//*******************************************

var container, controls, clock;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
 
var canvasWidth = 200;
var canvasHeight = 200;
var cameraHeight = 0.05;

init();
animate();

container.addEventListener('mousedown', function() { controls.autoRotateSpeed *= -1; });

/*** Initialize ***/
function init() {
  // This <div> will host the canvas for our scene.
  container = $("#face").get(0);
 
  // You can adjust the cameras distance and set the FOV to something
  // different than 45°. The last two values set the clippling plane.
  camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 0.1, 100 );
  camera.position.z = 0.75;
  camera.position.y = cameraHeight;
 
  // These variables set the camera behaviour and sensitivity.
  controls = new THREE.OrbitControls( camera, container );
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 4.0;
  controls.enableKeys = false;
 
  scene = new THREE.Scene();
  var ambient = new THREE.AmbientLight( 0xffffff );
  scene.add( ambient );
 
  /*** Texture Loading ***/
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
  };
  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader( manager );
 
  // You can set the texture properties in this function. 
  // The string has to be the path to your texture file.
  loader.load( './obj3d/model_texture_low.jpg', function ( image ) {
    texture.image = image;
    texture.needsUpdate = true;
  } );
 
  /*** OBJ Loading ***/
  var loader = new THREE.OBJLoader( manager );
 
  // As soon as the OBJ has been loaded this function looks for a mesh
  // inside the data and applies the texture to it.
  loader.load( './obj3d/small/model_mesh.obj', function ( event ) {
    var object = event;
    object.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.material.map = texture;
      }
    } );
 
    // My initial model was too small, so I scaled it upwards.
    //object.scale = new THREE.Vector3( 25, 25, 25 );
 
    // You can change the position of the object, so that it is not
    // centered in the view and leaves some space for overlay text.
    //object.position.y -= 0.1;
    scene.add( object );
  });
 
  // We set the renderer to the size of the window and
  // append a canvas to our HTML page.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( canvasWidth, canvasHeight );
  renderer.setClearColor( 0xffffff );
  container.appendChild( renderer.domElement );
  
  // the clock
  clock = new THREE.Clock();
}
 
/*** The Loop ***/
function animate() {
  // This function calls itself on every frame. You can for example change
  // the objects rotation on every call to create a turntable animation.
  requestAnimationFrame( animate );
 
  // On every frame we need to calculate the new camera position
  // and have it look exactly at the center of our scene.
  controls.update();
  
  renderer.render(scene, camera);
}