window.SatelliteMesh = (function() {
  var earthDiameter = 6371 * 2;
  var scaleFactor = earthDiameter;

  function SatelliteMesh(name, satrecord, mesh, coverageCone)
  {
    this.name = name;
    this.satrec = satrecord;
    this.mesh = mesh;
    this.coverageCone = coverageCone;
  }

  SatelliteMesh.prototype.updatePosition = function (now) {
    var positionAndVelocity = satellite.propagate(
      this.satrec,
      now.getUTCFullYear(),
      now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );

    var gmst = satellite.gstimeFromDate(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );

    var positionEci = positionAndVelocity.position;
    // Propagate satellite using time since epoch (in minutes).

    var positionEcf = satellite.eciToEcf(positionEci, gmst);

    var satelliteX = (positionEcf.x) / scaleFactor;
    var satelliteY = (positionEcf.y) / scaleFactor;
    var satelliteZ = (positionEcf.z) / scaleFactor;

    this.mesh.position.set(satelliteX, satelliteY, satelliteZ);

    var length = this.mesh.position.length();
    var offsetLength = length - 0.25;
    var scale = offsetLength / length;
    this.coverageCone.position.set((scale * satelliteX), (scale * satelliteY), (scale * satelliteZ));
    var facingAxis = this.mesh.position.clone().normalize();
    this.coverageCone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), facingAxis);

    var deg2rad = Math.PI / 180;
    // Set the Observer to London in radians
    var observerGd = {
      longitude: -0.1278 * deg2rad,
      latitude: 51.5074 * deg2rad,
      height: 0.035
    };

    // field of view of the satellite
    // var lookAngle = satellite.ecfToLookAngles(observerGd, positionEcf);
    // var fieldOfView = lookAngle.rangeSat / scaleFactor;
    
    // this.coverageCone.geometry = new THREE.CylinderGeometry(0.01, fieldOfView, 0.5, 7);
    // this.coverageCone.geometry.verticesNeedUpdate = true;
  };

  return SatelliteMesh;
})();
