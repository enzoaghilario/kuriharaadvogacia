import { useState } from "react";
import { AREAS } from "@/content/areas";
import { contactSchema, submitContact } from "@/lib/contact.functions";

const field = "w-full border-0 border-b border-border bg-transparent pb-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-bronze";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Verifique os campos."); return; }
    setError(""); setState("sending");
    try { await submitContact({ data: parsed.data }); form.reset(); setState("done"); }
    catch { setError("Não foi possível enviar agora. Use o WhatsApp ou o telefone."); setState("idle"); }
  }

  if (state === "done")
    return <p className="border-t-2 border-bronze pt-6 font-serif text-2xl">Mensagem recebida. O escritório entrará em contato pelo telefone informado.</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <label className="block"><span className="eyebrow">Nome</span><input name="name" maxLength={100} className={`${field} mt-2`} /></label>
      <label className="block"><span className="eyebrow">Telefone / WhatsApp</span><input name="phone" type="tel" maxLength={30} className={`${field} mt-2`} /></label>
      <label className="block sm:col-span-2"><span className="eyebrow">Área de interesse</span>
        <select name="area" defaultValue="" className={`${field} mt-2`}>
          <option value="" disabled>Selecione</option>
          {AREAS.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}
          <option value="Outro assunto">Outro assunto</option>
        </select>
      </label>
      <label className="block sm:col-span-2"><span className="eyebrow">Mensagem</span><textarea name="message" rows={4} maxLength={2000} className={`${field} mt-2 resize-none`} /></label>
      <p className="text-sm text-muted-foreground sm:col-span-2">Seus dados são usados apenas para o escritório retornar o contato.</p>
      {error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}
      <button disabled={state === "sending"} className="bg-primary px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-graphite disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {state === "sending" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
