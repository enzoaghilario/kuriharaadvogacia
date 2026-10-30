import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";

export function ServiceWhatsAppDialog({ service, onClose }: { service: string | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (service) { setName(""); setError(false); }
  }, [service]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) { setError(true); return; }
    window.open(buildServiceWhatsAppUrl(name, service ?? ""), "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <Dialog open={!!service} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-none border-0 border-t-2 border-t-bronze bg-background p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">{service}</p>
        <DialogTitle className="font-serif text-2xl font-normal leading-snug text-foreground">
          Como podemos chamar você?
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
          Vamos abrir o WhatsApp do escritório com uma mensagem pronta. Você revisa e envia quando quiser.
        </DialogDescription>
        <form onSubmit={submit} className="mt-4" noValidate>
          <label htmlFor="svc-name" className="sr-only">Seu nome</label>
          <input
            id="svc-name"
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(false); }}
            placeholder="Seu nome"
            aria-invalid={error}
            className="w-full border-0 border-b border-border bg-transparent pb-2 font-serif text-xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-bronze"
          />
          <p className={`mt-2 h-4 text-xs text-destructive transition-opacity ${error ? "opacity-100" : "opacity-0"}`}>
            Informe seu nome para continuar.
          </p>
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon size={16} />
            Continuar para WhatsApp
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
