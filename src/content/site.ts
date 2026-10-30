export const SITE = {
  name: "Silva & Kurihara Advogados Associados",
  short: "Silva & Kurihara",
  street: "Rua Maria Liporini Meireles, 731",
  district: "Centro",
  city: "Morro Agudo",
  state: "SP",
  zip: "14640-000",
  phone: "(16) 3851-0303",
  phoneHref: "tel:+551638510303",
  instagram: "https://www.instagram.com/grupokuriharaefigueiredo/",
  facebook: "https://www.facebook.com/grupokuriharaefigueiredo/",
};

export const FULL_ADDRESS = `${SITE.street}, ${SITE.district}, ${SITE.city} — ${SITE.state}, CEP ${SITE.zip}`;
const q = encodeURIComponent(`${SITE.street}, ${SITE.city} - ${SITE.state}, ${SITE.zip}`);
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${q}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${q}&output=embed`;
