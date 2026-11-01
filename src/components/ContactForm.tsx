import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AREAS } from "@/content/areas";
import { submitContact } from "@/lib/contact.functions";
import { contactSchema, type ContactData } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";

const field = "w-full border-0 border-b border-border bg-transparent pb-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-bronze";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({});
  const send = useServerFn(submitContact);

  function validateField(name: keyof ContactData, value: string) {
    const parsed = contactSchema.shape[name].safeParse(value);
    setErrors((current) => ({ ...current, [name]: parsed.success ? undefined : parsed.error.issues[0]?.message }));
  }

  const inputProps = (name: keyof ContactData) => ({
    required: true,
    disabled: state === "sending",
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => validateField(name, e.currentTarget.value),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { if (errors[name]) validateField(name, e.currentTarget.value); },
    className: `${field} mt-2 text-base ${errors[name] ? "border-destructive" : ""}`,
  });
  const fieldError = (name: keyof ContactData) => errors[name] && <span id={`contact-${name}-error`} role="alert" className="mt-2 block text-sm text-destructive">{errors[name]}</span>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      const next: Partial<Record<keyof ContactData, string>> = {};
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as keyof ContactData;
        if (!next[name]) next[name] = issue.message;
      }
      setErrors(next); setError("");
      const first = form.elements.namedItem(String(parsed.error.issues[0]?.path[0] ?? ""));
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setErrors({}); setError(""); setState("sending");
    try { const result = await send({ data: parsed.data }); if (!result.ok) throw new Error("Envio não confirmado"); form.reset(); setState("done"); }
    catch { setError("Não foi possível enviar agora. Use o WhatsApp ou o telefone."); setState("idle"); }
  }

  if (state === "done")
    return <p className="border-t-2 border-bronze pt-6 font-serif text-2xl">Mensagem recebida. O escritório entrará em contato pelo telefone informado.</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <label className="block"><span className="eyebrow">Nome</span><input name="name" autoComplete="name" maxLength={100} {...inputProps("name")} />{fieldError("name")}</label>
      <label className="block"><span className="eyebrow">Telefone / WhatsApp</span><input name="phone" type="tel" autoComplete="tel-national" maxLength={30} {...inputProps("phone")} />{fieldError("phone")}</label>
      <label className="block sm:col-span-2"><span className="eyebrow">Área de interesse</span>
        <select name="area" defaultValue="" {...inputProps("area")}>
          <option value="" disabled>Selecione</option>
          {AREAS.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}
          <option value="Outro assunto">Outro assunto</option>
        </select>
        {fieldError("area")}
      </label>
      <label className="block sm:col-span-2"><span className="eyebrow">Mensagem</span><textarea name="message" rows={4} maxLength={2000} {...inputProps("message")} />{fieldError("message")}</label>
      <p className="text-sm text-muted-foreground sm:col-span-2">Seus dados são usados apenas para o escritório retornar o contato.</p>
      {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
      <Button type="submit" disabled={state === "sending"} className="h-auto min-h-11 whitespace-normal rounded-none px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] sm:col-span-2 sm:justify-self-start">
        {state === "sending" ? "Enviando…" : "Enviar mensagem"}
      </Button>
    </form>
  );
}
