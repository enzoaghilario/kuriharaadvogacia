import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_SIZES, PARTNER_AREAS, REVENUE_RANGES, partnerSchema } from "@/lib/partner-schema";

const field = "mt-2 w-full rounded-sm border border-input bg-background px-3 py-3 text-base text-foreground outline-none focus:border-bronze focus:ring-1 focus:ring-ring";

function SelectField({ name, label, options, required = false }: { name: string; label: string; options: readonly string[]; required?: boolean }) {
  return <label className="block text-sm font-medium">{label}{required && " *"}
    <select name={name} required={required} defaultValue="" className={field}>
      <option value="">{required ? "Selecione" : "Não informado"}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

export function PartnerForm() {
  const [error, setError] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = partnerSchema.safeParse({ ...data, privacy: data.privacy === "on" });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }
    // No recipient or external email service is configured. Never send or
    // simulate success, and never persist the form's personal information.
    setError("O envio ainda não está disponível. Nenhuma informação foi transmitida.");
  }

  return <form onSubmit={onSubmit} autoComplete="off" className="space-y-10">
    <fieldset className="grid min-w-0 gap-6 sm:grid-cols-2">
      <legend className="mb-6 font-serif text-2xl">Dados da empresa e do responsável</legend>
      <label className="block text-sm font-medium">Razão Social/Nome Fantasia *<input name="company" required maxLength={150} className={field} /></label>
      <label className="block text-sm font-medium">CNPJ *<input name="cnpj" required maxLength={18} inputMode="numeric" placeholder="00.000.000/0000-00" className={field} /></label>
      <label className="block text-sm font-medium">Nome do Responsável *<input name="responsible" required maxLength={100} className={field} /></label>
      <label className="block text-sm font-medium">E-mail Corporativo *<input name="email" type="email" required maxLength={254} className={field} /></label>
      <label className="block text-sm font-medium">Telefone/WhatsApp *<input name="phone" type="tel" required maxLength={30} className={field} /></label>
      <SelectField name="area" label="Área de Interesse Principal" options={PARTNER_AREAS} required />
    </fieldset>
    <fieldset className="grid min-w-0 gap-6 border-t pt-8 sm:grid-cols-2">
      <legend className="pr-4 font-serif text-2xl">Informações complementares</legend>
      <SelectField name="size" label="Porte da Empresa" options={COMPANY_SIZES} />
      <SelectField name="revenue" label="Estimativa de Faturamento Anual" options={REVENUE_RANGES} />
      <SelectField name="activeCases" label="Possui Processos Ativos?" options={["Sim", "Não"]} />
      <SelectField name="urgency" label="Urgência da Demanda" options={["Baixa", "Média", "Alta"]} />
      <label className="block text-sm font-medium sm:col-span-2">Descrição/Observações Gerais<textarea name="observations" rows={5} maxLength={2000} className={`${field} resize-y`} /></label>
    </fieldset>
    <div className="space-y-6 border-t pt-8">
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input name="privacy" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-primary" />
        <span>Declaro que autorizo o envio das informações para análise e estou ciente de que os dados serão enviados exclusivamente por e-mail e NÃO serão armazenados no site *</span>
      </label>
      <p role="status" className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-bronze" />O envio está temporariamente indisponível. Nenhuma informação será transmitida ou armazenada no site.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled className="h-12 px-6"><Send />Enviar para análise</Button>
        <Button type="button" variant="ghost" asChild><Link to="/"><ArrowLeft />Voltar ao Início</Link></Button>
      </div>
    </div>
  </form>;
}