var container, stats;
var camera, scene, raycaster, renderer;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;

var tweets = [];
var tweetsMax = 200;
      
var languages = {
  "en": "English",
  "am": "Amharic",
  "ar": "Arabic",
  "bg": "Bulgarian",
  "bn": "Bengali",
  "bo": "Tibetan",
  "bs": "Bosnian",
  "ca": "Catalan",
  "ckb": "Sorani Kurdish",
  "cs": "Czech",
  "cy": "Welsh",    
  "da": "Danish",
  "de": "German",
  "dv": "Maldivian",
  "el": "Greek",
  "es": "Spanish",
  "et": "Estonian",
  "eu": "Basque",
  "fa": "Persian",
  "fi": "Finnish",
  "fil": "Filipino",
  "fr": "French",
  "gu": "Gujarati",
  "he": "Hebrew",
  "hi": "Hindi",
  "hi-Latn": "Latinized Hindi",
  "hr": "Croatian",
  "ht": "Haitian Creole",
  "hu": "Hungarian",
  "hy": "Armenian",
  "in": "Indonesian",
  "id": "Indonesian",
  "is": "Icelandic",
  "it": "Italian",
  "ja": "Japanese",
  "ka": "Georgian",
  "km": "Khmer",
  "kn": "Kannada",
  "ko": "Korean",
  "lo": "Lao",
  "lt": "Lithuanian",
  "lv": "Latvian",
  "ml": "Malayalam",
  "mr": "Marathi",
  "ms": "Malay",
  "my": "Burmese",
  "ne": "Nepali",
  "nl": "Dutch",
  "no": "Norwegian",
  "pa": "Panjabi",
  "pl": "Polish",
  "ps": "Pashto",
  "pt": "Portuguese",
  "ro": "Romanian",
  "ru": "Russian",
  "sd": "Sindhi",
  "si": "Sinhala",
  "sk": "Slovak",
  "sl": "Slovenian",
  "sr": "Serbian",
  "sv": "Swedish",
  "ta": "Tamil",
  "te": "Telugu",
  "th": "Thai",
  "tl": "Tagalog",
  "tr": "Turkish",
  "ug": "Uyghur",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "vi": "Vietnamese",
  "zh-cn": "Chinese (Sim.)",
  "zh-tw": "Chinese (Trad.)",
  "und": "Undefined"
};

init();
animate();

socket.on('tweet', function (tweet) {
  if (~tweets.indexOf(tweet.lang)) {
    var object = scene.getObjectByName(tweet.lang);
    object.scale.set(1.5, 1.5, 1.5);
    
    setTimeout(function() {
      object.scale.set(1, 1, 1);
    }, 500);
    
    return;
  }     
  else if (tweets.length >= tweetsMax) {
    return;
  }
  
  var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
  
  var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

  object.position.x = Math.random() * 800 - 400;
  object.position.y = Math.random() * 800 - 400;
  object.position.z = Math.random() * 800 - 400;

  object.rotation.x = Math.random() * 2 * Math.PI;
  object.rotation.y = Math.random() * 2 * Math.PI;
  object.rotation.z = Math.random() * 2 * Math.PI;

  object.scale.x = Math.random() + 0.5;
  object.scale.y = Math.random() + 0.5;
  object.scale.z = Math.random() + 0.5;
  
  object.name = tweet.lang;
  tweets.push(tweet.lang);
          

  scene.add( object );        
});

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 8.0;
  controls.zoomSpeed = 6;
  controls.panSpeed = 4;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  scene = new THREE.Scene();

  var light = new THREE.HemisphereLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  light.intensity = 1.5;
  scene.add( light );
  
  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild( stats.dom );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  window.addEventListener( 'resize', onWindowResize, false );

}



function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  controls.update();

  // find intersections

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );
      
      // print language
      if (languages[INTERSECTED.name]) {
        languageDisplayText.textContent = languages[INTERSECTED.name];
      }
      else {
        languageDisplayText.textContent = "Not found (" + INTERSECTED.name + ")";
      }

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

  renderer.render( scene, camera );

}