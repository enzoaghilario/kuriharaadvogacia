import { SITE } from "@/content/site";

export function buildServiceWhatsAppUrl(name: string, service: string): string {
  const msg = `Olá! Meu nome é ${name.trim()}.\n\nTenho interesse em atendimento na área de ${service} e gostaria de conversar com a equipe do ${SITE.short} sobre minha necessidade.\n\nAguardo o contato. Obrigado!`;
  return `${SITE.whatsappHref}?text=${encodeURIComponent(msg)}`;
}
