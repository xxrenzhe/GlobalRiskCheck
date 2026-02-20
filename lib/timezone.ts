const regionMap: Record<string, string[]> = {
  Asia: ["CN", "HK", "TW", "JP", "KR", "SG", "MY", "TH", "VN", "IN", "PH", "ID"],
  Europe: ["GB", "DE", "FR", "ES", "IT", "NL", "SE", "PL", "RU", "UA"],
  America: ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE"],
  Africa: ["ZA", "NG", "KE", "EG", "MA"],
  Oceania: ["AU", "NZ"],
  Pacific: ["NZ", "AU"],
  Atlantic: ["GB", "PT", "IS"],
  Indian: ["IN", "LK"],
  Antarctic: []
};

export const isTimezoneMismatch = (language: string, timezone: string) => {
  const region = timezone.split("/")[0];
  const country = language.split("-")[1];
  if (!region || !country) {
    return false;
  }
  const allowed = regionMap[region];
  if (!allowed) {
    return false;
  }
  return !allowed.includes(country.toUpperCase());
};
