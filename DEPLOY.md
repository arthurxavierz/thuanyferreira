# Deploy · Eng. Thuany Ferreira

Protótipo de prospecção: GitHub → **Cloudflare Pages** (grátis, sem crédito de build).
Quando vender: GitHub → **Netlify** → Cloudflare DNS. O `netlify.toml` já está pronto.

Repositório: https://github.com/arthurxavierz/thuanyferreira
Domínio provisório: `thuany.achillesmedia.com.br`

## Cloudflare Pages (agora)
1. Workers & Pages → Create → Pages → Connect to Git → `thuanyferreira`.
2. Framework preset **None**, build command vazio, output **`dist`**.
3. Project name `thuany-ferreira` (fica `thuany-ferreira.pages.dev`).
4. Custom domains → `thuany.achillesmedia.com.br`. A zona já está na Cloudflare, o CNAME é criado sozinho e o proxy laranja pode ficar ligado.

Cada push na `main` publica sozinho.

## Netlify (quando vender)
1. Import from GitHub → `thuanyferreira`. Build e publish vêm do `netlify.toml`.
2. Site name `thuany-ferreira`.
3. Remova o custom domain do Pages e troque o DNS para
   `CNAME thuany → thuany-ferreira.netlify.app` com proxy **cinza (DNS only)**, senão o certificado não sai.

## Domínio definitivo
Troque o domínio de uma vez em `dist/` (canonical, og:url, og:image, robots e sitemap):

    grep -rl "thuany.achillesmedia.com.br" dist/ | xargs sed -i 's|thuany.achillesmedia.com.br|NOVO-DOMINIO|g'
