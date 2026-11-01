# Roadmap

## Verificação geral do site

- [x] Corrigir sobreposição do chat, menu fechado, validação de contato e aviso de privacidade
- [x] Testar correções no celular e no computador

- [x] Conferir estrutura, formulários, navegação e apresentação no navegador
- [x] Rodar testes e apresentar problemas confirmados e limitações

Correções verificadas em 320, 393, 768, 1024, 1280 e 1920px: faixa livre junto ao chat nos botões de contato, menu fechado inerte, erros por campo e foco no primeiro erro, validação compartilhada no servidor e navegador, aviso incluindo contato, parceiro, chat e tema. Sem rolagem horizontal nem erros de execução nesses testes. Envio real do contato não foi exercitado para não armazenar dados fictícios do escritório; confirmação testada com resposta simulada. Zoom real de 400%, teclado virtual e áreas físicas de segurança não foram verificados.

## Seja Parceiro

- [x] Criar página, campos, validação e navegação compatíveis com os dois temas
- [x] Verificar campos e ausência de envio/armazenamento enquanto não configurado
- [ ] Integrar serviço externo e testar entrega/limpeza após sucesso — aguarda destinatário e serviço de envio

## Tema escuro institucional

- [x] Aplicar azul profundo, grafite e dourado com contraste legível
- [x] Preservar logo, fotos, conteúdo, animação e contatos
- [x] Verificar páginas e serviços no computador e no celular

## Correções de acessibilidade e privacidade

- [x] Remover o botão de contato dos serviços fechados e verificar teclado/abertura
- [x] Atualizar o aviso sobre o nome solicitado antes do WhatsApp

## Feed do Instagram na área de Conteúdos

- [x] Banco de dados: tabelas de publicações e de estado da sincronização
- [x] Lógica de sincronização com a API oficial da Meta (sem dados fictícios)
- [x] Testes da lógica de sincronização (18 testes)
- [x] Interface do feed no lugar da área "Em breve" em /conteudos
- [x] Rota de atualização automática e agenda a cada 30 minutos
- [x] Conferir na tela e no build
- [ ] Pedir ao escritório o token e a conta do Instagram (Meta for Developers)

## Jornal jurídico em Conteúdos

- [x] Busca de notícias jurídicas no servidor (Google News RSS, sem chave)
- [x] Seção "Jornal jurídico" com visual do site, botão Atualizar e estado de indisponível
- [x] Testes do parser de RSS (7 testes) e verificação na tela

## Disponibilidade ao atualizar (verificação)

- [x] Publicar de verdade e acompanhar o site no ar durante a troca de versão
- [x] Confirmar que a versão no ar bate com o código atual

- Removida a seção de artigos ("Para ler com calma") da página Conteúdos a pedido do usuário; permanecem Instagram e Jornal jurídico.
