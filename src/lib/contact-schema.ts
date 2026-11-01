import { z } from "zod";
import { AREAS } from "@/content/areas";

const ddds = new Set("11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99".split(" "));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(100, "Use até 100 caracteres."),
  phone: z.string().trim().max(30).regex(/^[\d\s()+-]+$/, "Informe um telefone com DDD válido.").refine((value) => {
    const digits = value.replace(/\D/g, "");
    return ddds.has(digits.slice(0, 2)) && /^(?:\d{2}[2-5]\d{7}|\d{2}9\d{8})$/.test(digits);
  }, "Informe um telefone com DDD e 10 ou 11 dígitos."),
  area: z.string().trim().refine((value) => value === "Outro assunto" || AREAS.some((area) => area.name === value), "Escolha uma área da lista."),
  message: z.string().trim().min(5, "Descreva brevemente o caso (mínimo de 5 caracteres).").max(2000, "Use até 2.000 caracteres."),
});

export type ContactData = z.infer<typeof contactSchema>;