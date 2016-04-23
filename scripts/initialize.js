window.initialize = (function(window) {
  'use strict';

  function initialize($elem) {
    THREEx.Planets.baseURL = 'assets/';
    var renderer	= new THREE.WebGLRenderer({
      antialias	: true
    });
    $elem[0].appendChild(renderer.domElement);
    renderer.setSize($elem.width(), $elem.height());
    renderer.shadowMapEnabled	= true;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, $elem.width() / $elem.height(), 0.01, 100 );
    camera.position.y = 1.8;
    camera.up.set(0, 0, 1);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    $(window).on('resize', function () {
      renderer.setSize($elem.width(), $elem.height());
      camera.aspect = $elem.width() / $elem.height();
      camera.updateProjectionMatrix();
    });

    var light = new THREE.AmbientLight(0x222222);
    scene.add(light);

    var light	= new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(5,5,5);
    scene.add( light );
    light.castShadow	= true;
    light.shadowCameraNear	= 0.01;
    light.shadowCameraFar	= 15;
    light.shadowCameraFov	= 45;

    light.shadowCameraLeft	= -1;
    light.shadowCameraRight	=  1;
    light.shadowCameraTop	=  1;
    light.shadowCameraBottom= -1;
    // light.shadowCameraVisible	= true

    light.shadowBias	= 0.001;
    light.shadowDarkness	= 0.2;

    light.shadowMapWidth	= 1024;
    light.shadowMapHeight	= 1024;

    var light	= new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    var light	= new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(-5,-5,-5);
    scene.add( light );
    light.castShadow	= true;
    light.shadowCameraNear	= 0.01;
    light.shadowCameraFar	= 15;
    light.shadowCameraFov	= 45;

    light.shadowCameraLeft = -1;
    light.shadowCameraRight	= 1;
    light.shadowCameraTop	= 1;
    light.shadowCameraBottom= -1;
    // light.shadowCameraVisible	= true

    light.shadowBias	= 0.001;
    light.shadowDarkness	= 0.2;

    light.shadowMapWidth	= 1024;
    light.shadowMapHeight	= 1024;

    return {
      renderer: renderer,
      controls: controls,
      camera: camera,
      scene: scene
    };
  }

  return initialize;
}).call(this, window);
