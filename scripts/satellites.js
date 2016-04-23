

var earthDiameter = 6371 * 2;
var scaleFactor = earthDiameter;

function SatelliteMesh(name, satrecord, mesh)
{
	this.name = name;
	this.satrec = satrecord;
	this.mesh = mesh;
}

SatelliteMesh.prototype.updatePosition = function(time)
{
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

		var positionGd = satellite.eciToGeodetic(positionEci, gmst);

		var longitudeStr = satellite.degreesLong(positionGd.longitude),
        latitudeStr  = satellite.degreesLat(positionGd.latitude);

		this.mesh.position.set(satelliteX, satelliteY, satelliteZ);
}