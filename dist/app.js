/* Eng. Thuany Ferreira · comportamento do site
   Sem dependências. Tudo que mexe com rolagem roda dentro de
   requestAnimationFrame e no máximo uma vez por quadro. */

const SITE = {
  // Número com DDI e DDD, só dígitos (ex.: '5534999999999').
  // Enquanto estiver vazio, os botões abrem o Direct do Instagram.
  whatsapp: '',
  instagram: 'eng.thuanyferreira',
};

const raiz = document.documentElement;
const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const economia = navigator.connection && navigator.connection.saveData;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const limita = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- WhatsApp ou Instagram ---------- */
const linkContato = (texto) =>
  SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`
    : `https://ig.me/m/${SITE.instagram}`;

$$('[data-wa]').forEach((a) => { a.href = linkContato(a.dataset.wa); });
if (!SITE.whatsapp) $$('[data-wa-label]').forEach((s) => { s.textContent = 'Direct do Instagram'; });

/* ---------- Abertura ---------- */
const intro = $('.intro');
const pronto = () => raiz.classList.add('is-pronto');
let jaViu = false;
try { jaViu = sessionStorage.getItem('tf-intro') === '1'; } catch (e) {}

if (!intro || semMovimento || jaViu) {
  intro && intro.classList.add('is-off');
  pronto();
} else {
  const num = $('.intro-num');
  const ini = performance.now();
  const dur = 1500;
  const conta = (t) => {
    const k = Math.min(1, (t - ini) / dur);
    num.textContent = (k * 8).toFixed(2).replace('.', ',');
    if (k < 1) requestAnimationFrame(conta);
  };
  requestAnimationFrame(conta);
  setTimeout(() => {
    intro.classList.add('is-fora');
    pronto();
    try { sessionStorage.setItem('tf-intro', '1'); } catch (e) {}
    setTimeout(() => intro.classList.add('is-off'), 950);
  }, dur + 250);
}

/* ---------- Vídeos ---------- */
const heroVideo = $('.hero-video');
if (heroVideo && !semMovimento && !economia) {
  const retrato = matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
  heroVideo.src = retrato ? heroVideo.dataset.srcMobile : heroVideo.dataset.src;
  heroVideo.play().catch(() => {});
}

const citacaoVideo = $('.citacao-video');
if (citacaoVideo && !semMovimento && !economia) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!citacaoVideo.src) citacaoVideo.src = citacaoVideo.dataset.src;
      citacaoVideo.play().catch(() => {});
    } else {
      citacaoVideo.pause();
    }
  }, { rootMargin: '200px 0px' }).observe(citacaoVideo);
}

// o vídeo do hero não precisa rodar quando ninguém está vendo
if (heroVideo && heroVideo.src) {
  new IntersectionObserver(([e]) => {
    e.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause();
  }).observe($('.hero'));
}

/* ---------- Alvenaria: fiadas geradas uma vez ---------- */
const alvenaria = $('.g-alvenaria');
const vaos = [
  [160, 290, 240, 350],
  [400, 290, 480, 350],
  [290, 340, 350, 406],
];
const fiadas = [];
if (alvenaria) {
  const ns = 'http://www.w3.org/2000/svg';
  const x0 = 134, x1 = 506, base = 406, alt = 12, larg = 28, junta = 2;
  for (let r = 0; r < 12; r++) {
    const y = base - (r + 1) * alt;
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'fiada');
    g.style.transitionDelay = '0s';
    for (let x = x0 - (r % 2 ? 15 : 0); x < x1; x += larg + junta) {
      const a = Math.max(x, x0), b = Math.min(x + larg, x1);
      if (b - a < 4) continue;
      const corta = vaos.some(([vx0, vy0, vx1, vy1]) => a < vx1 && b > vx0 && y < vy1 && y + alt - junta > vy0);
      if (corta) continue;
      const t = document.createElementNS(ns, 'rect');
      t.setAttribute('x', a); t.setAttribute('y', y);
      t.setAttribute('width', b - a); t.setAttribute('height', alt - junta);
      g.appendChild(t);
    }
    alvenaria.appendChild(g);
    fiadas.push(g);
  }
}

/* ---------- Rolagem: hero, barra, cabeçalho, etapas ---------- */
const hero = $('.hero');
const topo = $('.topo');
const barra = $('.progress');
const wa = $('.wa-flutuante');
const etapas = $('#etapas');
const grupos = etapas ? ['.g-projeto', '.g-fundacao', '.g-estrutura', '.g-alvenaria', '.g-acabamento'].map((s) => $(s, etapas)) : [];
const passos = $$('.etapa');
const etapaAtual = $('.etapa-atual');
const foto = $('.etapas-foto img');
const fotos = foto ? JSON.parse(foto.dataset.fotos) : [];
let passoAtivo = -1;
let ultimoY = 0;
let quadro = 0;

function trocaFoto(i) {
  if (!foto || foto.getAttribute('src') === fotos[i]) return;
  foto.classList.add('troca');
  setTimeout(() => {
    foto.src = fotos[i];
    foto.onload = () => foto.classList.remove('troca');
  }, 200);
}

function rolagemEtapas() {
  if (!etapas) return;
  const caixa = etapas.getBoundingClientRect();
  const curso = etapas.offsetHeight - innerHeight;
  // 5 etapas e um respiro no final para a casa pronta ficar na tela
  const P = limita(-caixa.top / curso, 0, 1) * 5.6;
  etapas.style.setProperty('--p', limita(P / 5, 0, 1).toFixed(3));
  grupos.forEach((g, i) => {
    if (!g) return;
    const k = limita(P - i, 0, 1);
    g.style.setProperty('--k', k.toFixed(3));
    if (i === 3) fiadas.forEach((f, n) => f.classList.toggle('on', k > n / fiadas.length));
    if (i === 4) {
      g.classList.toggle('f1', k > 0.12);
      g.classList.toggle('f2', k > 0.45);
      g.classList.toggle('f3', k > 0.75);
      grupos[0] && grupos[0].style.setProperty('--k5', k.toFixed(3));
    }
  });
  const ativo = Math.min(4, Math.floor(P));
  if (ativo !== passoAtivo) {
    passoAtivo = ativo;
    passos.forEach((p, i) => {
      p.classList.toggle('is-ativa', i === ativo);
      p.classList.toggle('is-feita', i < ativo);
    });
    if (etapaAtual) etapaAtual.textContent = String(ativo + 1).padStart(2, '0');
    trocaFoto(ativo);
  }
}

function corDoTopo() {
  // o cabeçalho fica escuro quando passa por cima de uma seção escura
  const y = topo.offsetHeight / 2;
  const el = document.elementsFromPoint(innerWidth / 2, y).find((n) => !topo.contains(n) && n.closest('section, footer, .faixa'));
  const secao = el && el.closest('section, footer, .faixa');
  const escuro = !!secao && (secao.matches('.escuro, .etapas, .citacao, .hero, footer'));
  topo.dataset.escuro = escuro;
}

function medir() {
  quadro = 0;
  const y = scrollY;
  const alturaHero = hero ? hero.offsetHeight : innerHeight;
  if (hero && !semMovimento) hero.style.setProperty('--rolagem', (Math.round(limita(y / alturaHero, 0, 1) * 100) / 100).toString());
  const total = document.documentElement.scrollHeight - innerHeight;
  barra.style.setProperty('--p', total > 0 ? (y / total).toFixed(4) : 0);
  topo.dataset.solid = y > 40;
  const menuAberto = document.body.classList.contains('menu-aberto');
  topo.classList.toggle('is-escondido', !menuAberto && y > alturaHero && y > ultimoY + 4);
  if (y < ultimoY - 4 || y < alturaHero) topo.classList.remove('is-escondido');
  ultimoY = y;
  wa && wa.classList.toggle('is-visivel', y > alturaHero * 0.7);
  corDoTopo();
  rolagemEtapas();
}
const agendar = () => { if (!quadro) quadro = requestAnimationFrame(medir); };
addEventListener('scroll', agendar, { passive: true });
addEventListener('resize', agendar, { passive: true });
medir();

/* ---------- Revelação ao entrar na tela ---------- */
['.serv-lista', '.galeria', '.check-lista', '.pilares'].forEach((s) => {
  $$(`${s} > .reveal`).forEach((el, i) => el.style.setProperty('--d', `${(i % 3) * 0.09}s`));
});
const io = new IntersectionObserver((itens) => {
  itens.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
$$('.reveal').forEach((el) => io.observe(el));

/* ---------- Menu ---------- */
const menuBtn = $('.menu-btn');
const menu = $('#menu');
function abreMenu(abrir) {
  menuBtn.setAttribute('aria-expanded', abrir);
  menuBtn.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-aberto', abrir);
  topo.dataset.escuro = abrir ? 'true' : topo.dataset.escuro;
  if (abrir) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-aberto'));
    topo.style.color = '#fff';
  } else {
    menu.classList.remove('is-aberto');
    topo.style.color = '';
    setTimeout(() => { if (!menu.classList.contains('is-aberto')) menu.hidden = true; }, 700);
  }
}
menuBtn && menuBtn.addEventListener('click', () => abreMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('#menu a').forEach((a) => a.addEventListener('click', () => abreMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-aberto')) abreMenu(false); });

/* ---------- Link ativo na navegação ---------- */
const links = $$('.nav a');
const navIO = new IntersectionObserver((itens) => {
  itens.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('is-ativo', a.hash === `#${e.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['sobre', 'servicos', 'etapas', 'obras', 'contato'].forEach((id) => { const s = document.getElementById(id); s && navIO.observe(s); });

/* ---------- Galeria ampliada ---------- */
const lb = $('.lightbox');
$$('.peca').forEach((p) => p.addEventListener('click', () => {
  const img = $('img', p);
  $('img', lb).src = img.src;
  $('img', lb).alt = img.alt;
  $('p', lb).textContent = p.dataset.legenda;
  lb.showModal();
}));
$('.lb-fechar').addEventListener('click', () => lb.close());
lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });

/* ---------- Checklist ---------- */
const checks = $$('.check-lista input');
const placar = $('.check-n');
const barraCheck = $('.check-barra');
checks.forEach((c) => c.addEventListener('change', () => {
  const n = checks.filter((x) => x.checked).length;
  placar.textContent = n;
  barraCheck.style.setProperty('--c', n / checks.length);
}));

/* ---------- Formulário: vira mensagem pronta ---------- */
const form = $('.form');
const aviso = $('.form-aviso');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = new FormData(form);
  const nome = (dados.get('nome') || '').trim();
  const campoNome = $('#f-nome');
  if (!nome) {
    campoNome.setAttribute('aria-invalid', 'true');
    aviso.textContent = 'Me diga seu nome para eu saber com quem estou falando.';
    campoNome.focus();
    return;
  }
  campoNome.removeAttribute('aria-invalid');
  const linhas = [
    `Olá, Thuany! Meu nome é ${nome}.`,
    `Preciso de: ${dados.get('tipo')}.`,
    dados.get('cidade') ? `Cidade da obra: ${dados.get('cidade').trim()}.` : '',
    dados.get('mensagem') ? `\n${dados.get('mensagem').trim()}` : '',
    '\n(Mensagem enviada pelo site)',
  ].filter(Boolean);
  const texto = linhas.join('\n');
  if (SITE.whatsapp) {
    window.open(linkContato(texto), '_blank', 'noopener');
    aviso.textContent = 'Abrindo o WhatsApp com a sua mensagem pronta.';
  } else {
    try { await navigator.clipboard.writeText(texto); } catch (err) {}
    window.open(linkContato(texto), '_blank', 'noopener');
    aviso.textContent = 'Mensagem copiada. É só colar na conversa do Instagram.';
  }
});

/* ---------- Ano no rodapé ---------- */
$$('.ano').forEach((s) => { s.textContent = new Date().getFullYear(); });
