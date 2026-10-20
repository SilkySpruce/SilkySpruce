const SHOP_LOCATION = {
  lat: -1.28578,
  lng: 36.82189,
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

export function calculateShippingFee(customerLat: number, customerLng: number) {
  if (!customerLat || !customerLng) return 300; // Default fallback fee if location is missing

  const distanceKm = calculateDistance(SHOP_LOCATION.lat, SHOP_LOCATION.lng, customerLat, customerLng);

  // Dynamic Tiered Pricing Structure (Adjust rates as needed)
  const baseFee = 200; // Base delivery fee for the first 3 km
  const ratePerKm = 50; // KSh 50 for every kilometer beyond 3 km

  if (distanceKm <= 3) {
    return baseFee;
  }

  const extraKm = distanceKm - 3;
  const totalFee = baseFee + Math.ceil(extraKm * ratePerKm);

  // Maximum cap or standard local delivery limits if necessary
  return Math.min(totalFee, 1500); 
}