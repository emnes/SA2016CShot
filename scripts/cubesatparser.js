function getSatelliteRecords(rawSatTLEs)
{
	var lines = rawSatTLEs.split("\r");
	var satRecs = {};

	for (var i = 0; i < (lines.length-1); i+=3)
	{
		var tle1 = lines[i+1].trim(); 
		var tle2 = lines[i+2].trim();

		satRecs[lines[i].trim()] = satellite.twoline2satrec(tle1, tle2);
	}

	return satRecs;
}

