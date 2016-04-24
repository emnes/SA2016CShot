(function() {
  'use strict';

  var app = initialize($('.earth'));
  var renderer = app.renderer;
  var camera = app.camera;
  var controls = app.controls;
  var scene = app.scene;

  //////////////////////////////////////////////////////////////////////////////////
  //    added starfield             //
  //////////////////////////////////////////////////////////////////////////////////

  var starSphere  = THREEx.Planets.createStarfield();
  scene.add(starSphere);

  //////////////////////////////////////////////////////////////////////////////////
  //    add an object and make it move          //
  //////////////////////////////////////////////////////////////////////////////////

  // var datGUI = new dat.GUI()

  var containerEarth = new THREE.Object3D();
  //containerEarth.rotateZ(-23.4 * Math.PI/180)
  containerEarth.position.z = 0;
  scene.add(containerEarth);

  var earthMesh = THREEx.Planets.createEarth();
  earthMesh.receiveShadow = true;
  earthMesh.castShadow  = true;
  containerEarth.add(earthMesh);

  // Realign earth
  earthMesh.rotateX(90 * Math.PI/180);


  var geometry  = new THREE.SphereGeometry(0.5, 32, 32);
  var material  = THREEx.createAtmosphereMaterial();
  material.uniforms.glowColor.value.set(0x00b3ff);
  material.uniforms.coeficient.value = 0.8;
  material.uniforms.power.value = 2.0;
  var mesh  = new THREE.Mesh(geometry, material );
  mesh.scale.multiplyScalar(1.01);
  containerEarth.add( mesh );
  // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

  var geometry  = new THREE.SphereGeometry(0.5, 32, 32);
  var material  = THREEx.createAtmosphereMaterial();
  material.side = THREE.BackSide;
  material.uniforms.glowColor.value.set(0x00b3ff);
  material.uniforms.coeficient.value  = 0.5;
  material.uniforms.power.value   = 4.0;
  var mesh  = new THREE.Mesh(geometry, material );
  mesh.scale.multiplyScalar(1.15);
  containerEarth.add( mesh );
  // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)

  var earthCloud  = THREEx.Planets.createEarthCloud();
  earthCloud.receiveShadow  = true;
  earthCloud.castShadow = true;
  containerEarth.add(earthCloud);

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

    var coverageConeGeometry = new THREE.CylinderGeometry(0.01, 0.4, 0.5, 7);
    var coverageConeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3
    });
    //////////////////////////////////////////////////////////////////////////////////
    //    Camera Controls             //
    //////////////////////////////////////////////////////////////////////////////////

    //££££££££ Satellites //
    var earthDiameter = 6371 * 2;
    var scaleFactor = earthDiameter;
    var geometry = new THREE.SphereGeometry(0.01, 10, 10);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    var deg2rad = Math.PI / 180;

    // Dynamic satellite //
    var meshes = [];
    $.ajax({
      url: "assets/cubesat.txt"
    }).done(function(text) {
      var satRecs = getSatelliteRecords(text);

      meshes = Object.keys(satRecs).map(function(name) {
        var rec = satRecs[name];
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        var coverageConeCylinder = new THREE.Mesh(coverageConeGeometry, coverageConeMaterial);
        scene.add(coverageConeCylinder);
        return new SatelliteMesh(name, rec, mesh, coverageConeCylinder);
      });
      //meshes = [meshes[0]];
    })


    var time = new Date();
    var dateRef = new Date();
    var simulationOffset = 0;

    var $referenceDate = $('#date-picker').pickadate();
    var $simulationTime = $('#simulation-time');
    var picker = $referenceDate.pickadate('picker');
    var $cameraPositionx = $('#camera-positionx');
    var $cameraPositiony = $('#camera-positiony');
    var $cameraPositionz = $('#camera-positionz');

    var simDate = new Date();
    simDate.setUTCFullYear(dateRef.getUTCFullYear() + 1); // artificial offset
    simDate.setUTCMonth(dateRef.getUTCMonth());
    simDate.setUTCDate(dateRef.getUTCDate());
    function updateReferenceTime() {
      if (simDate.getUTCDate() !== dateRef.getUTCDate() ||
          simDate.getUTCMonth() !== dateRef.getUTCMonth() ||
          simDate.getUTCFullYear() !== dateRef.getUTCFullYear()) {
        picker.set('select', dateRef);
        simDate.setTime(dateRef.getTime());
      }
    }

    function updateSimulationTime() {
      time.setTime(dateRef.getTime() + simulationOffset);
      $simulationTime.text(time.toUTCString());
    }

    $referenceDate.on('change', function () {
      dateRef.setTime(Date.parse($(this).val()));
      dateRef.setHours(dateRef.getHours() + 2); // correction for UTC
    });

    $('#detailed-time').on('input', function () {
      simulationOffset = parseInt($(this).val()) * 60 * 1000;
      updateSimulationTime();
    });

    updateSimulationTime();
    updateReferenceTime();

    $("#search-button").click(function(){

      // United kingdom camera
      camera.position.x = 0.4685943882663952;
      camera.position.y = 0;
      camera.position.z = 0.6452746603353687;

    });


    //////////////////////////////////////////////////////////////////////////////////
    //    loop runner             //
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
      // keep looping
      requestAnimationFrame( animate );
      // measure time
      lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;
      // call each update function
      renderer.render( scene, camera );

      dateRef.setUTCSeconds(dateRef.getUTCSeconds() + 5);
      // updateReferenceTime();
      updateSimulationTime();

      meshes.forEach(function (satMesh) {
        satMesh.updatePosition(time);
      });
      controls.update();
    })
})();
