const SHOP_LOCATION = {
  lat: -1.28578,
  lng: 36.82189,
};

/* -------------------------------------------------------------------------- */
/*  Fargo Courier – Nairobi Easy Saving Tariff (reviewed 1st June 2026)       */
/*  Values are the TOTAL column (charge + 16% VAT) for the first 5kg per item */
/*  and delivery up to 5km from the town of destination.                      */
/* -------------------------------------------------------------------------- */

const TARIFF_TOTALS: Record<string, number> = {
  // Rift Valley routes
  "Baraton": 805, "Bungoma": 690, "Burnt forest": 745, "Chwele": 690,
  "Eldama Ravine": 540, "Eldoret": 520, "Engineer": 460, "Gilgil": 400,
  "Iten": 520, "Kabarnet": 665, "Kapenguria": 895, "Kapsabet": 715,
  "Kijabe": 400, "Kimilili": 690, "Kitale": 600, "Limuru": 400,
  "Lodwar": 2360, "Lokichogio": 3275, "Lugari": 690, "Mai Mahiu": 485,
  "Malaba": 690, "Maralal": 1265, "Moi's Bridge": 610, "Molo": 550,
  "Mumias": 690, "Nairetoi": 1095, "Naivasha": 400, "Nakuru": 415,
  "Nandi Hills": 715, "Narok": 485, "Njoro": 550, "Nyahururu": 550,
  "Nzoia": 815, "Olkalau": 550, "Rumuruti": 575, "Talek": 780,
  "Turbo": 745, "Webuye": 690,

  // Mt Kenya routes
  "Chogoria": 550, "Chuka": 485, "Embu": 485, "Garissa": 860, "Isiolo": 745,
  "Juja": 400, "Kagio": 460, "Kangari": 400, "Kangema": 485, "Karatina": 460,
  "Kenol": 400, "Kerugoya": 460, "Kiganjo": 470, "Kutus": 460,
  "Makutano": 530, "Makuyu": 415, "Marsabit": 1095, "Matuu": 485,
  "Maua": 745, "Meru": 550, "Minjila": 1150, "Moyale": 3505,
  "Mukurweini": 470, "Murang'a": 415, "Murarandia": 485, "Mwea": 470,
  "Mwingi": 635, "Nanyuki": 600, "Naromoru": 600, "Nkubu": 530,
  "Nyeri": 485, "Othaya": 485, "Ruiru": 415, "Runyenjes": 485,
  "Sabasaba": 415, "Sagana": 550, "Thika": 400, "Timau": 600,

  // Lake routes
  "Ahero": 735, "Awendo": 690, "Bomet": 575, "Bondo": 735, "Busia": 760,
  "Homabay": 805, "Isebania": 850, "Kakamega": 665, "Kehancha": 850,
  "Kendubay": 860, "Kericho": 550, "Keroka": 690, "Kilgoris": 690,
  "Kisii": 575, "Kisumu": 575, "Litein": 575, "Londiani": 575,
  "Luanda": 760, "Maseno": 575, "Mbale": 550, "Mbita": 830, "Migori": 690,
  "Muhoroni": 760, "Nambale": 770, "Nyamira": 575, "Ogembo": 690,
  "Oyugis": 690, "Rachuonyo": 860, "Rongo": 690, "Sabatia": 550,
  "Siaya": 745, "Sotik": 575, "Ugunja": 745,

  // Beach routes
  "Diani": 885, "Garsen": 1610, "Kilifi": 920, "Lamu": 2360, "Malindi": 965,
  "Mariakani": 735, "Mombasa": 735, "Mpeketoni": 2360, "Mtwapa": 735,
  "Mwatate": 920, "Taveta": 975, "Voi": 690, "Watamu": 975, "Wundanyi": 965,

  // Outer Nairobi routes
  "Athi River": 415, "Emali": 665, "Isinya": 485, "Kajiado": 485,
  "Kangundo": 460, "Kibwezi": 665, "Kitengela": 415, "Kitui": 520,
  "Machakos": 485, "Makindu": 665, "Masii": 575, "Mtito Andei": 690,
  "Mutomo": 690, "Mwala": 690, "Namanga": 770, "Oloitoktok": 770,
  "Sultan hamud": 665, "Tala": 485, "Wote": 520,

  // Nairobi routes
  "Gatundu": 400, "Githunguri": 400, "Kiambu": 400, "Kikuyu": 400,
  "Nairobi": 345, "Ngong": 400, "Ongata rongai": 400,
};

/* Build a normalised lookup so "  NAIVASHA ", "Moi’s Bridge", "Lodwar*" all match. */
function normalizeTown(name: string): string {
  return name
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const TARIFF_LOOKUP = new Map<string, string>(
  Object.keys(TARIFF_TOTALS).map((town) => [normalizeTown(town), town])
);

/** Returns the canonical tariff town name, or null if the town isn't on the tariff. */
export function findTariffTown(town?: string | null): string | null {
  if (!town) return null;
  return TARIFF_LOOKUP.get(normalizeTown(town)) ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Distance-based fallback (original logic)                                  */
/* -------------------------------------------------------------------------- */

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

function calculateDistanceBasedFee(customerLat?: number, customerLng?: number) {
  // if (!customerLat || !customerLng) return 300; // Default fallback fee if location is missing
if (!customerLat || !customerLng) return 0; // Default fallback fee if location is missing
  const distanceKm = calculateDistance(SHOP_LOCATION.lat, SHOP_LOCATION.lng, customerLat, customerLng);

  // // Dynamic Tiered Pricing Structure (Adjust rates as needed)
  // const baseFee = 200; // Base delivery fee for the first 3 km
  // const ratePerKm = 50; // KSh 50 for every kilometer beyond 3 km

  // if (distanceKm <= 3) {
  //   return baseFee;
  // }

  // const extraKm = distanceKm - 3;
  // const totalFee = baseFee + Math.ceil(extraKm * ratePerKm);

  // Maximum cap or standard local delivery limits if necessary
  return 0;
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export interface ShippingOptions {
  /** Destination town/branch name (e.g. from the customer's address). */
  town?: string | null;
}

export interface ShippingQuote {
  totalFee: number;
  source: "tariff" | "distance";
  town?: string;
}

export function getShippingQuote(
  customerLat?: number,
  customerLng?: number,
  options: ShippingOptions = {}
): ShippingQuote {
  const tariffTown = findTariffTown(options.town);

  if (tariffTown) {
    const totalFee = TARIFF_TOTALS[tariffTown];
    return { totalFee, source: "tariff", town: tariffTown };
  }

  // const totalFee = calculateDistanceBasedFee(customerLat, customerLng);
  const totalFee = 0
  return { totalFee, source: "distance" };
}

/** Drop-in replacement: tariff price if the town is listed, otherwise distance-based. */
export function calculateShippingFee(
  customerLat?: number,
  customerLng?: number,
  options: ShippingOptions = {}
) {
  return getShippingQuote(customerLat, customerLng, options).totalFee;
}