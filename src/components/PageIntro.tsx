import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b bg-secondary pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="container-site animate-rise">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-h2 mt-4 max-w-3xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-h2 mt-4">{title}</h2>
      <div className="rule-bronze mt-6" />
    </div>
  );
}
