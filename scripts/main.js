(function() {
  'use strict';

  var app = initialize($('.earth'));
  var renderer = app.renderer;
  var camera = app.camera;
  var controls = app.controls;
  var scene = app.scene;

  var onRenderFcts= [];

  //////////////////////////////////////////////////////////////////////////////////
  //		added starfield							//
  //////////////////////////////////////////////////////////////////////////////////

  var starSphere	= THREEx.Planets.createStarfield()
  scene.add(starSphere)

  //////////////////////////////////////////////////////////////////////////////////
  //		add an object and make it move					//
  //////////////////////////////////////////////////////////////////////////////////

  // var datGUI	= new dat.GUI()

  var containerEarth	= new THREE.Object3D()
  //containerEarth.rotateZ(-23.4 * Math.PI/180)
  containerEarth.position.z	= 0
  scene.add(containerEarth)

  var earthMesh	= THREEx.Planets.createEarth()
  earthMesh.scale
  earthMesh.receiveShadow	= true
  earthMesh.castShadow	= true
  containerEarth.add(earthMesh)

  // Realign earth
  earthMesh.rotateX(90 * Math.PI/180);


  // onRenderFcts.push(function(delta, now)
  // {
  // 	earthMesh.rotation.y += 1/32 * delta;		
  // })

  var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
  var material	= THREEx.createAtmosphereMaterial()
  material.uniforms.glowColor.value.set(0x00b3ff)
  material.uniforms.coeficient.value	= 0.8
  material.uniforms.power.value		= 2.0
  var mesh	= new THREE.Mesh(geometry, material );
  mesh.scale.multiplyScalar(1.01);
  containerEarth.add( mesh );
  // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

  var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
  var material	= THREEx.createAtmosphereMaterial()
  material.side	= THREE.BackSide
  material.uniforms.glowColor.value.set(0x00b3ff)
  material.uniforms.coeficient.value	= 0.5
  material.uniforms.power.value		= 4.0
  var mesh	= new THREE.Mesh(geometry, material );
  mesh.scale.multiplyScalar(1.15);
  containerEarth.add( mesh );
  // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

  var earthCloud	= THREEx.Planets.createEarthCloud()
  earthCloud.receiveShadow	= true
  earthCloud.castShadow	= true
  containerEarth.add(earthCloud)
  // onRenderFcts.push(function(delta, now){
  // 	earthCloud.rotation.y += 1/8 * delta;		
  // })

  var zlineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var zLineGeometry = new THREE.Geometry();
  zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 2));
  zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

  var zLine = new THREE.Line(zLineGeometry, zlineMaterial);
  //scene.add(zLine);

  var xlineMaterial = new THREE.LineBasicMaterial(
    {
      color: 0xff0000
    });
    var xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(new THREE.Vector3(2, 0, 0));
    xLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    var xLine = new THREE.Line(xLineGeometry, xlineMaterial);
    //scene.add(xLine);

    var coverageConeGeometry = new THREE.CylinderGeometry(0.01, 0.4, 0.5, 15);
    var coverageConeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5
    });
    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////

    //££££££££ Satellites //
    var earthDiameter = 6371 * 2;
    var scaleFactor = earthDiameter;
    var geometry = new THREE.SphereGeometry( 0.01, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    var deg2rad = Math.PI / 180;
    // Set the Observer to London in radians
    var observerGd = {
      longitude: -0.1278 * deg2rad,
      latitude: 51.5074 * deg2rad,
      height: 0.035
    };

    // Dynamic satellite //
    var meshes = [];
    $.ajax({
      url: "assets/cubesat.txt"
    }).done(function(text) {
      var satRecs = getSatelliteRecords(text);

      meshes = Object.keys(satRecs).map(function(name) {
        var rec = satRecs[name];

        // var position = satellite.sgp4(rec, 0).position;
        // var positionEcf = satellite.eciToEcf(position, 0);

        // var lookAngle = satellite.ecfToLookAngles(observerGd, positionEcf);
        // console.log(lookAngle);

        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        var coverageConeCylinder = new THREE.Mesh(coverageConeGeometry, coverageConeMaterial);
        scene.add(coverageConeCylinder);
        return new SatelliteMesh(name, rec, mesh, coverageConeCylinder);
      });
      //meshes = [meshes[0]];
    })


    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
      renderer.render( scene, camera );		
    })
    var now = new Date();

    var nowSeconds = now.getUTCSeconds();
    //////////////////////////////////////////////////////////////////////////////////
    //		loop runner							//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
      // keep looping
      requestAnimationFrame( animate );
      // measure time
      lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
      var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec	= nowMsec
      // call each update function
      onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
      })

      now.setSeconds(now.getSeconds() + 5);

      $('.interface')[0].innerText = now.toUTCString();

      meshes.forEach(function(mesh) {
        mesh.updatePosition(now);
      });

      controls.update();
    })
})();
