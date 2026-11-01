import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";

const T = "Aviso de privacidade | Kurihara & Figueiredo Advogados Associados";
const D = "Como o site do escritório Kurihara & Figueiredo Advogados Associados trata informações de visitantes.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Privacidade" title="Aviso de privacidade" />
      <section className="section-y">
        <div className="container-site max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>Este site tem caráter institucional e informativo. Ao solicitar contato sobre um serviço, apenas o seu nome é pedido antes do redirecionamento para o WhatsApp, para personalizar a mensagem destinada ao escritório. Você pode revisar a mensagem e decidir se deseja enviá-la.</p>
          <p>No formulário da página Contato, são solicitados nome, telefone ou WhatsApp, área de interesse e mensagem. Ao enviar, essas informações são armazenadas no ambiente do site para que o escritório analise a solicitação e retorne o contato. Evite incluir documentos, senhas ou informações sensíveis na mensagem.</p>
          <p>O formulário Seja Parceiro mantém os dados apenas enquanto você preenche a página, sem gravá-los no banco de dados, em cookies ou no armazenamento do navegador. Seu envio permanece indisponível até que a entrega exclusiva por e-mail esteja configurada. Quando habilitado, os dados serão enviados por e-mail e os campos serão limpos após a confirmação do envio.</p>
          <p>O assistente de conversa é fornecido pelo Typebot. As mensagens que você envia no chat são processadas por esse serviço e pelos serviços conectados ao assistente, conforme suas respectivas políticas de privacidade. Não envie informações sigilosas pelo chat; para tratar do seu caso, utilize os contatos do escritório.</p>
          <p>A preferência de tema claro ou escuro é salva no armazenamento local do navegador para manter sua escolha nas próximas visitas. Esse registro não contém os dados dos formulários.</p>
          <p>O mapa incorporado é fornecido pelo Google, e os links para Instagram e Facebook levam a serviços de terceiros, sujeitos às respectivas políticas de privacidade.</p>
          <p>Para solicitar informações sobre o tratamento dos seus dados, acesso, correção ou exclusão, entre em contato com o escritório pelo telefone (16) 3851-0303 ou pelo WhatsApp (16) 98801-4617. As solicitações serão analisadas conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e as obrigações legais aplicáveis.</p>
        </div>
      </section>
    </>
  ),
});
