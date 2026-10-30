# Site institucional — Silva & Kurihara Advogados Associados

## Direção visual
- Paleta da fachada: grafite #292B2D, cinza #35383B, branco suave #F7F6F3, bege #E9E3D9, azul-marinho #17243A, bronze #A88B60 só em detalhes (filetes, numeração, hover), tom madeira em texturas sutis.
- Tipografia: Playfair Display (títulos) + Manrope (texto/interface).
- Estilo editorial sóbrio: muito respiro, filetes finos, grid assimétrico, animações discretas de entrada. Sem balanças, martelos ou gradientes chamativos.
- Assinatura tipográfica provisória "Silva & Kurihara / Advogados Associados" (sem logotipo inventado).

## Páginas (rotas próprias, boas para SEO)
- `/` Início: hero com foto da fachada em tela ampla + texto do briefing, botões "Conheça o escritório" e "Entre em contato"; prévia do escritório, prévia de conteúdos (só se houver publicações) e bloco de contato.
- `/escritorio`: texto institucional fornecido + composição com as duas fotos. Nenhum dado inventado.
- `/atuacao`: estrutura de cards pronta, alimentada por uma lista de áreas. Enquanto vazia, a página mostra um aviso discreto e o link fica fora do menu (seção oculta, conforme briefing).
- `/conteudos` e `/conteudos/$slug`: lista com título, categoria, data e resumo, e página individual de leitura. Começa vazia com estado "Em breve".
- `/contato`: endereço clicável (Google Maps), botão de ligação tel:+551638510303, Instagram, Facebook e mapa incorporado. Sem formulário (evita envio simulado; pode ser adicionado depois com integração real).
- `/privacidade`: aviso de privacidade simples.

## Elementos globais
- Cabeçalho fixo: transparente sobre o hero, sólido ao rolar; menu mobile animado que fecha ao escolher um link.
- Rodapé com nome, endereço, telefone, redes, navegação rápida, aviso de privacidade e direitos reservados (sem OAB até ser informado).

## Responsividade, SEO e acessibilidade
- Mobile-first, tipografia fluida com clamp(), composições próprias por tamanho de tela, sem rolagem horizontal, áreas de toque confortáveis.
- Título/descrição/Open Graph por página, termos locais naturais (advocacia em Morro Agudo), dados estruturados LegalService com endereço e telefone, robots.txt; sitemap quando houver endereço publicado.
- HTML semântico, foco visível por teclado, textos alternativos, contraste adequado, imagens com dimensões e lazy loading.

## Observações
- As fotos enviadas são pequenas (cerca de 350px). Vou usá-las com tratamento escuro/desfocado no hero; para qualidade premium, recomendo enviar versões em alta resolução depois.
- Áreas de atuação e artigos ficam como listas no próprio site, fáceis de preencher depois. Se quiserem um painel para publicar sozinhos, isso pode ser uma etapa futura com login.

## Detalhes técnicos
- Fotos via lovable-assets; tokens de cor em oklch em src/styles.css; fontes via link no __root.
- Dados em `src/content/areas.ts` e `src/content/posts.ts` (arrays vazios tipados); componentes Header, Footer, SectionHeading, PracticeCard, PostCard.
- Mapa: iframe Google Maps com consulta do endereço, carregamento lazy.
