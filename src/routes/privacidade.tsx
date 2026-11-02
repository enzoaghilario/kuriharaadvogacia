import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";
import { CLARITY_PROJECT_ID, GA_MEASUREMENT_ID } from "@/content/analytics";

const T = "Aviso de privacidade | Kurihara & Figueiredo Advogados Associados";
const D = "Como o site do escritório Kurihara & Figueiredo Advogados Associados trata informações de visitantes.";

export const Route = createFileRoute("/privacidade")({
  head: ({ match }) => pageHead({ origin: match.context.origin, path: "/privacidade", title: T, description: D }),
  component: () => (
    <>
      <PageIntro eyebrow="Privacidade" title="Aviso de privacidade" />
      <section className="section-y">
        <div className="container-site max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>Este site tem caráter institucional e informativo. Ao solicitar contato sobre um serviço, apenas o seu nome é pedido antes do redirecionamento para o WhatsApp, para personalizar a mensagem destinada ao escritório. Você pode revisar a mensagem e decidir se deseja enviá-la.</p>
          <p>A página Contato oferece apenas o WhatsApp, o telefone e o endereço do escritório. Ela não possui formulário e não coleta nem armazena dados no site.</p>
          <p>O formulário Seja Parceiro mantém os dados apenas enquanto você preenche a página, sem gravá-los no banco de dados, em cookies ou no armazenamento do navegador. Seu envio permanece indisponível até que a entrega exclusiva por e-mail esteja configurada. Quando habilitado, os dados serão enviados por e-mail e os campos serão limpos após a confirmação do envio.</p>
          <p>O assistente de conversa é fornecido pelo Typebot. As mensagens que você envia no chat são processadas por esse serviço e pelos serviços conectados ao assistente, conforme suas respectivas políticas de privacidade. Não envie informações sigilosas pelo chat; para tratar do seu caso, utilize os contatos do escritório.</p>
          <p>A preferência de tema claro ou escuro é salva no armazenamento local do navegador para manter sua escolha nas próximas visitas. Esse registro não contém os dados dos formulários.</p>
          {(GA_MEASUREMENT_ID || CLARITY_PROJECT_ID) && (
            <p>Com sua permissão, o site usa ferramentas de análise ({[GA_MEASUREMENT_ID && "Google Analytics", CLARITY_PROJECT_ID && "Microsoft Clarity"].filter(Boolean).join(" e ")}) para entender, de forma agregada, como as páginas são usadas. Elas só são carregadas se você clicar em "Aceitar" no aviso de cookies; se recusar, nada é carregado. Sua escolha fica salva no armazenamento local do navegador e pode ser revista apagando os dados do site no navegador.</p>
          )}
          <p>O mapa incorporado é fornecido pelo Google, e os links para Instagram e Facebook levam a serviços de terceiros, sujeitos às respectivas políticas de privacidade.</p>
          <p>Para solicitar informações sobre o tratamento dos seus dados, acesso, correção ou exclusão, entre em contato com o escritório pelo telefone (16) 3851-0303 ou pelo WhatsApp (16) 98801-4617. As solicitações serão analisadas conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e as obrigações legais aplicáveis.</p>
        </div>
      </section>
    </>
  ),
});
