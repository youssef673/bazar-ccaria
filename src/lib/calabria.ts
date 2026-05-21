import { CALABRIA_CITIES, CALABRIA_PROVINCES } from "./constants";

export function isCalabriaProvince(province: string): boolean {
  const normalized = province.trim().toLowerCase();
  return CALABRIA_PROVINCES.some(
    (p) =>
      p.toLowerCase() === normalized ||
      `provincia di ${p.toLowerCase()}` === normalized
  );
}

export function isCalabriaCity(city: string, province: string): boolean {
  if (!isCalabriaProvince(province)) return false;
  const cities = CALABRIA_CITIES[province] ?? [];
  const normalized = city.trim().toLowerCase();
  return cities.some((c) => c.toLowerCase() === normalized);
}

export function validateCalabriaDelivery(
  city: string,
  province: string
): { valid: boolean; message?: string } {
  if (!isCalabriaProvince(province)) {
    return {
      valid: false,
      message:
        "Al momento consegniamo solo in Calabria. Contattaci per eccezioni o preventivi speciali.",
    };
  }
  if (!isCalabriaCity(city, province)) {
    return {
      valid: false,
      message: `La città "${city}" non è tra le zone servite. Richiedi un preventivo per verificare la fattibilità.`,
    };
  }
  return { valid: true };
}

export function getServedZones(): typeof CALABRIA_CITIES {
  return CALABRIA_CITIES;
}
