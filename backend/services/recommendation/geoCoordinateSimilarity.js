// location similarity based on haversine distance between two property coordinates

function haversineDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLng/2)**2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getLocationScore(p1, p2) {
  if (!p1.coordinates?.coordinates || !p2.coordinates?.coordinates) return 0;

  const distance = haversineDistance(
    p1.coordinates.coordinates,
    p2.coordinates.coordinates
  );

  return 1 / (1 + distance); // closer = higher
}

module.exports = getLocationScore;