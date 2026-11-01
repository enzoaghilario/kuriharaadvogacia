import { z } from "zod";

export const PARTNER_AREAS = ["Trabalhista", "Empresarial", "Contratual", "Cível", "Tributário", "Reestruturação Empresarial"] as const;
export const COMPANY_SIZES = ["1 a 9 funcionários", "10 a 49 funcionários", "50 a 99 funcionários", "100 a 499 funcionários", "500 ou mais funcionários"] as const;
export const REVENUE_RANGES = ["Até R$ 360 mil", "De R$ 360 mil a R$ 4,8 milhões", "De R$ 4,8 milhões a R$ 20 milhões", "Acima de R$ 20 milhões"] as const;

function isValidCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{14}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
  const check = (length: number) => {
    let weight = length - 7;
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(digits[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const remainder = sum % 11;
    return (remainder < 2 ? 0 : 11 - remainder) === Number(digits[length]);
  };
  return check(12) && check(13);
}

function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{11}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;
  const check = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(digits[i]) * (length + 1 - i);
    const remainder = (sum * 10) % 11;
    return (remainder === 10 ? 0 : remainder) === Number(digits[length]);
  };
  return check(9) && check(10);
}

const optionalChoice = <T extends readonly [string, ...string[]]>(options: T) => z.union([z.enum(options), z.literal("")]).optional();

export const partnerSchema = z.object({
  company: z.string().trim().min(2, "Informe a razão social ou o nome fantasia.").max(150),
  cnpj: z.string().trim().max(18).regex(/^[\d./-]+$/, "Informe um CNPJ válido.").refine(isValidCnpj, "Informe um CNPJ válido."),
  responsible: z.string().trim().min(2, "Informe o nome do responsável.").max(100),
  email: z.string().trim().email("Informe um e-mail corporativo válido.").max(254),
  phone: z.string().trim().max(30).regex(/^[\d\s()+-]+$/, "Informe um telefone válido.").refine((v) => /^\d{10,13}$/.test(v.replace(/\D/g, "")), "Informe um telefone válido com DDD."),
  area: z.enum(PARTNER_AREAS, { errorMap: () => ({ message: "Escolha a área de interesse principal." }) }),
  privacy: z.literal(true, { errorMap: () => ({ message: "É necessário autorizar o envio para análise." }) }),
  size: optionalChoice(COMPANY_SIZES),
  revenue: optionalChoice(REVENUE_RANGES),
  activeCases: optionalChoice(["Sim", "Não"]),
  urgency: optionalChoice(["Baixa", "Média", "Alta"]),
  observations: z.string().trim().max(2000).optional(),
});