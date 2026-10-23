# Eng. Thuany Ferreira · site

Site estático de prospecção para a engenheira civil Thuany Ferreira (Patrocínio, MG).
Sem build: tudo que vai ao ar está em `dist/`.

Instagram: https://www.instagram.com/eng.thuanyferreira/
Domínio provisório: https://thuany.achillesmedia.com.br

## Estrutura
- `dist/index.html` página única: hero com vídeo, sobre, serviços, etapas (casa que sobe com a rolagem), obras, checklist e contato.
- `dist/styles.css` e `dist/app.js` versionados com `?v=N` no HTML. **A cada deploy que mexe em CSS ou JS, suba o N.**
- `dist/assets/img/` fotos reais do Instagram dela, já otimizadas.
- `dist/assets/video/` takes do Pexels (licença livre, sem atribuição obrigatória), comprimidos com ffmpeg:
  - `hero.mp4` (1600 px) e `hero-mobile.mp4` (vertical 540x960) do vídeo 36228755.
  - `casa.mp4` do vídeo 27086044.
- `_instagram/` originais baixados (fora do git).

## Destaques
- Abertura: a planta da casa se desenha e a cota sobe até 8,00 m, uma vez por sessão.
- Hero no padrão das imobiliárias: vídeo de fundo, véu, texto centralizado e parallax ligado à rolagem (`--rolagem`).
- Seção Etapas: 5 fases (projeto, fundação, estrutura, alvenaria, acabamento) desenhadas em SVG e controladas pela rolagem. As fiadas de tijolo são geradas no `app.js`.
- Formulário monta a mensagem e abre o WhatsApp.
- Respeita `prefers-reduced-motion` e economia de dados (sem vídeo).

## Pendências antes de vender
- [ ] **WhatsApp:** preencher `SITE.whatsapp` no topo do `dist/app.js` (só dígitos, com 55 e DDD). Enquanto vazio, todos os botões abrem o Direct do Instagram e o formulário copia a mensagem.
- [ ] CREA dela no rodapé.
- [ ] Validar a lista de serviços com ela (hoje inferida dos posts: acompanhamento, orçamento, projeto aprovado, reforma).
- [ ] Trocar o vídeo do hero por um take de obra dela, se tiver (drone ou time-lapse).
