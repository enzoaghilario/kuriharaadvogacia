import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(100),
  phone: z.string().trim().regex(/^[\d\s()+-]{8,30}$/, "Informe um telefone válido."),
  area: z.string().trim().min(1, "Escolha uma área.").max(100),
  message: z.string().trim().min(5, "Descreva brevemente o caso.").max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .validator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert(data);
    if (error) throw new Error("Não foi possível enviar agora.");
    return { ok: true };
  });
