export const SITE = {
  name: "Kurihara & Figueiredo Advogados Associados",
  short: "Kurihara & Figueiredo",
  street: "Rua Maria Liporini Meireles, 731",
  district: "Centro",
  city: "Morro Agudo",
  state: "SP",
  zip: "14640-000",
  phone: "(16) 3851-0303",
  phoneHref: "tel:+551638510303",
  whatsapp: "(16) 98801-4617",
  whatsappHref: "https://wa.me/5516988014617",
  instagram: "https://www.instagram.com/grupokuriharaefigueiredo/",
  facebook: "https://www.facebook.com/grupokuriharaefigueiredo/",
  hours: {
    days: "Segunda a sexta",
    opens: "07:00",
    closes: "18:00",
    label: "Segunda a sexta, das 7h às 18h",
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
  },
};

export const FULL_ADDRESS = `${SITE.street}, ${SITE.district}, ${SITE.city} — ${SITE.state}, CEP ${SITE.zip}`;
const q = encodeURIComponent(`${SITE.street}, ${SITE.city} - ${SITE.state}, ${SITE.zip}`);
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${q}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${q}&output=embed`;
