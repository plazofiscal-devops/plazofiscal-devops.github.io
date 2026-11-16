import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/600.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as d from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n, dec = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ext = (href, html, cls = '') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${html}</a>`;

const metric = (m) => `
  <div class="metric fade">
    <b>${m.pre || ''}<span data-count="${m.n}">${fmt(m.n)}</span>${m.u ? `<small>${m.u}</small>` : ''}</b>
    <span>${m.l}</span><i>${m.s}</i>
  </div>`;

const notes = (items) => items.map(([h, p], i) => `<li class="fade"><span class="mk">${i + 1}</span><div><b>${h}</b><p>${p}</p></div></li>`).join('');
const notesFrom = (items, start) => items.map(([h, p], i) => `<li class="fade"><span class="mk">${start + i}</span><div><b>${h}</b><p>${p}</p></div></li>`).join('');

function codeBlock(c) {
  const rows = c.lines.map(([t, m, k]) => {
    const cls = m || k === 'h' ? 'hl' : k === 'c' ? 'cm' : '';
    return `<span class="ln${cls ? ' ' + cls : ''}">${m ? `<i class="mk">${m}</i>` : '<i></i>'}<code>${esc(t) || ' '}</code></span>`;
  }).join('');
  return `<div class="code-in fade"><span class="code-file">${c.file}</span><pre>${rows}</pre></div>`;
}

const alt = ([n, p, chosen]) => `<div class="alt${chosen ? ' chosen' : ''}"><b>${n}${chosen ? '<span>chosen</span>' : ''}</b><p>${p}</p></div>`;

function video(k, cls = '') {
  const [f, t, p] = d.videos[k];
  return `<figure class="video fade ${cls}">
    <div class="frame"><video controls preload="none" playsinline poster="videos/${f}.webp"><source src="videos/${f}.mp4" type="video/mp4"></video></div>
    <figcaption><span class="mono">Video ${k}</span><b>${t}</b><p>${p}</p></figcaption>
  </figure>`;
}

/* ---------------------------------------------------------------- render */
function render() {
  $('#navRepo').href = d.links.repo;
  $('#outroRepo').href = d.links.repo;
  $('#outroArch').href = d.links.architecture;

  $('#metrics').innerHTML = d.metrics.map(metric).join('');
  $('#facts').innerHTML = d.facts.map(([b, s]) => `<div class="fact fade"><b>${b}</b><span>${s}</span></div>`).join('');
  $('#objectives').innerHTML = d.objectives.map(([b, s]) => `<div class="obj fade"><b class="mono">${b}</b><span>${s}</span></div>`).join('');
  $('#services').innerHTML = d.services.map(([n, t, r]) => `<div class="svc-row fade"><div><b>${n}</b><span class="mono">${t}</span></div><p>${r}</p></div>`).join('');

  $('#overviewLegend').innerHTML = d.overview.map((t, i) => `<li class="fade"><span class="mk">${i + 1}</span><p>${t}</p></li>`).join('');
  $('#stack').innerHTML = d.stack.map(([c, n, v, r]) => `<div class="tool fade"><span class="tool-c">${c}</span><b>${n}</b><span class="ver mono">${v}</span><p>${r}</p></div>`).join('');
  $('#measures').innerHTML = d.measures.map(([b, p], i) => `<div class="measure"><span class="mk">${i + 1}</span><div><b>${b}</b><p>${p}</p></div></div>`).join('');
  const top = d.memory[0][1];
  $('#memBars').innerHTML = d.memory.map(([l, v]) => `<div class="bar"><span>${l}</span><div class="bar-t"><i data-w="${Math.max(v / top, 0.02)}"></i></div><span class="mono">${v} GiB</span></div>`).join('');

  $('#rollSteps').innerHTML = d.rollSteps.map(([t], i) => `<li><button type="button" data-i="${i}"><span class="mk">${i + 1}</span>${t}</button></li>`).join('');
  $('#strategies').innerHTML = d.strategies.map(alt).join('');
  $('#codeRolling').innerHTML = codeBlock(d.code.rolling);
  $('#rollingNotes').innerHTML = notes(d.rollingNotes);
  $('#rollProof').innerHTML = [
    { n: 9272, l: 'requests during four releases', s: 'accountant traffic at 15 requests per second' },
    { n: 0, l: 'failed requests', s: 'with every service released under load' },
    { n: 16, pre: '13 to ', u: ' ms', l: 'p95 latency during releases', s: 'measured by k6 inside the cluster' }
  ].map(metric).join('');
  $('#runs').innerHTML = d.runs.map(([a, b, c, e]) => `<div class="run"><span>${a}</span><span class="mono">${b}</span><span class="mono ${c === '0' ? 'good' : 'bad'}">${c}</span><span class="mono">${e}</span></div>`).join('');

  $('#paths').innerHTML = d.paths.map(([a, b, c], i) => `<div class="path"><span class="mk">${i + 1}</span><span>${a}</span><span>${b}</span><span class="mono">${c}</span></div>`).join('');
  $('#codePolicy').innerHTML = codeBlock(d.code.policy);
  $('#policyNotes').innerHTML = notes(d.policyNotes);
  $('#policyTest').innerHTML = d.policyTest.map((t) => `<li>${t}</li>`).join('');
  $('#redis').innerHTML = d.redis.map(([b, s]) => `<div class="big fade"><b class="mono">${b}</b><span>${s}</span></div>`).join('');

  $('#scaleRules').innerHTML = d.scaleRules.map(([a, b]) => `<div class="rule"><span>${a}</span><b class="mono">${b}</b></div>`).join('');
  $('#scaleAlts').innerHTML = d.scaleAlternatives.map(alt).join('');
  $('#codeKeda').innerHTML = codeBlock(d.code.keda);
  $('#kedaNotes').innerHTML = notes(d.kedaNotes);
  $('#scaleProof').innerHTML = d.scaleProof.map(metric).join('');

  $('#signals').innerHTML = d.signals.map(([b, p], i) => `<li class="fade"><span class="mk">${i + 1}</span><p><b>${b}.</b> ${p}</p></li>`).join('');
  $('#timeline').innerHTML = d.timeline.map(([t, p], i) => `<div class="tl-i"><span class="mk">${i + 1}</span><b class="mono">${t}</b><p>${p}</p></div>`).join('');
  $('#codeAlert').innerHTML = codeBlock(d.code.alert);
  $('#codeLogstash').innerHTML = codeBlock(d.code.logstash);
  $('#obsNotes').innerHTML = notes(d.obsNotes);
  $('#dashboard').innerHTML = d.dashboard.map((t, i) => `<li class="fade"><span class="mk">${i + 1}</span><p>${t}</p></li>`).join('');
  $('#costAlts').innerHTML = d.costAlternatives.map(alt).join('');

  $('#signinSteps').innerHTML = d.signinSteps.map((t, i) => `<li class="fade"><span class="mk">${i + 1}</span><p>${t}</p></li>`).join('');
  $('#codeSignin').innerHTML = codeBlock(d.code.signin);
  $('#codeRealm').innerHTML = codeBlock(d.code.realm);
  $('#signinNotes').innerHTML = notesFrom(d.signinNotes, 1);
  $('#roles').innerHTML = '<h4>Two roles</h4>' + d.roles.map(([u, g, p]) => `<div class="role"><b class="mono">${u}</b><span>${g}</span><p>${p}</p></div>`).join('')
    + '<p class="roles-n">A user outside the group gets the page Sin acceso, whose button signs out of both sessions.</p>';

  $('#pipeSteps').innerHTML = d.steps.map(([t, p], i) => `<li><span class="node">${i + 1}</span><div><h3>${t}</h3><p>${p}</p></div></li>`).join('');
  $('#cards').innerHTML = d.cards.map(([n, prs, t]) => `<div class="card-row">${ext(`${d.links.repo}/issues/${n}`, `#${n}`, 'mono iss')}<span class="prs">${prs.map((p) => ext(`${d.links.repo}/pull/${p}`, `PR #${p}`, 'mono')).join(' ')}</span><span>${t}</span></div>`).join('');
  $('#checks').innerHTML = d.checks.map(([a, b]) => `<div class="chk"><b>${a}</b><span>${b}</span></div>`).join('');
  $('#commands').innerHTML = d.commands.map(([a, b]) => `<div class="chk"><b class="mono">${a}</b><span>${b}</span></div>`).join('');
  $('#lessons').innerHTML = d.lessons.map(([t, c, s]) => `<article class="lesson fade"><h4>${t}</h4><span class="tag-c">Cause</span><p>${c}</p><span class="tag-d">Decision</span><p>${s}</p></article>`).join('');

  $('#compliance').innerHTML = d.compliance.map(([a, b, c], i) => `<div class="comp-row"><span class="mk">${i + 1}</span><b>${a}</b><span>${b}</span><span class="mono">${c}</span></div>`).join('');
  $('#library').innerHTML = Object.entries(d.videos).sort(([a], [b]) => a.localeCompare(b)).map(([k, [f, t]]) => `<button type="button" class="lib fade" data-play="${k}"><span class="lib-img"><img src="videos/${f}.webp" alt="" loading="lazy"><i class="play" aria-hidden="true"></i></span><span class="mono">Video ${k}</span><b>${t}</b></button>`).join('');
  $('#docs').innerHTML = [
    ['Business case', 'The company, its customers, its calendar and its objectives', d.links.business],
    ['Architecture', 'Components, capacity, decisions and alternatives, with three diagrams', d.links.architecture],
    ['Operations', 'Requirements, daily commands and troubleshooting', d.links.operations],
    ['Evidence', 'Each point of the course with its proof, command and screenshots', d.links.evidence],
    ['Issues', 'The eleven cards of the project', d.links.issues],
    ['Pull requests', 'Thirteen changes, each with its evidence', d.links.pulls]
  ].map(([n, t, h]) => ext(h, `<b>${n}</b><span>${t}</span>`, 'doc fade')).join('');

  $$('.vid[data-video]').forEach((el) => { el.outerHTML = video(el.dataset.video); });
}

/* ---------------------------------------------------------------- hero calendar */
const phaseOf = (day, season) => season ? 'season' : day >= 8 && day <= 24 ? 'window' : 'quiet';

function monthCells(year, month) {
  const first = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  return { first, days };
}

function setupHeroCalendar() {
  const { first, days } = monthCells(2026, 10);
  const grid = $('#calGrid');
  grid.innerHTML = '<i class="pad"></i>'.repeat(first) + Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return `<i class="${phaseOf(day, false)}" data-day="${day}">${day}</i>`;
  }).join('');
  const cells = $$('[data-day]', grid);
  const show = (day) => {
    const p = d.phases[phaseOf(day, false)];
    cells.forEach((c) => c.classList.toggle('now', +c.dataset.day === day));
    $('#calDay').textContent = day;
    $('#calRps').textContent = `${p.rps} req/s`;
    $('#calRep').textContent = p.replicas;
    $('#calBadge').textContent = p.replicas > 2 ? 'Window open' : 'Quiet days';
    $('#calBadge').classList.toggle('on', p.replicas > 2);
    $('#calPods').innerHTML = Array.from({ length: 4 }, (_, i) => `<span class="${i < p.replicas ? 'up' : ''}"></span>`).join('');
  };
  let day = 5;
  show(day);
  if (reduce) return;
  setInterval(() => { day = day % days + 1; show(day); }, 900);
}

/* ---------------------------------------------------------------- season explorer */
function setupSeason() {
  let season = false, day = 12;
  const month = $('#month');
  month.innerHTML = Array.from({ length: 31 }, (_, i) => `<button type="button" data-day="${i + 1}"><span>${i + 1}</span><i></i></button>`).join('');
  const cells = $$('button', month);
  const update = () => {
    const key = phaseOf(day, season), p = d.phases[key];
    cells.forEach((c) => {
      const k = phaseOf(+c.dataset.day, season);
      c.className = k + (+c.dataset.day === day ? ' on' : '');
      c.querySelector('i').style.setProperty('--r', d.phases[k].replicas);
    });
    $('#sBadge').textContent = p.name;
    $('#sBadge').dataset.state = key;
    $('#sRps').textContent = p.rps;
    $('#sRep').textContent = p.replicas;
    $('#sNote').textContent = p.note;
  };
  cells.forEach((c) => c.addEventListener('click', () => { day = +c.dataset.day; update(); }));
  $$('[data-season]').forEach((b) => b.addEventListener('click', () => {
    season = b.dataset.season === '1';
    $$('[data-season]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    update();
  }));
  update();
}

/* ---------------------------------------------------------------- rolling update */
function setupRolling() {
  const stage = $('#rollStage'), btns = $$('#rollSteps button');
  let cur = 0, timer;
  const go = (i) => {
    cur = i;
    btns.forEach((b, k) => b.classList.toggle('on', k === i));
    stage.innerHTML = d.rollSteps[i][1].map((p) => {
      const v = p.replace(/[*x]/, '');
      const st = p.endsWith('*') ? ' starting' : p.endsWith('x') ? ' leaving' : '';
      return `<div class="pod ${v}${st}"><b>${v}</b><span>${st ? (st === ' starting' ? 'not ready' : 'preStop 5 s') : 'serving'}</span></div>`;
    }).join('');
    if (!reduce) gsap.from('#rollStage .pod', { opacity: 0, y: 14, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
  };
  const loop = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go((cur + 1) % btns.length), 2600); };
  btns.forEach((b, i) => b.addEventListener('click', () => { go(i); loop(); }));
  go(0);
  ScrollTrigger.create({ trigger: '.roll', start: 'top 85%', end: 'bottom 15%', onToggle: (s) => s.isActive ? loop() : clearInterval(timer) });
}

/* ---------------------------------------------------------------- scroll and navigation */
let lenis;
function setupScroll() {
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = a.getAttribute('href') === '#top' ? 0 : $(a.getAttribute('href'));
    if (t === null) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: t ? -84 : 0, duration: 1.4 }) : (t ? t.scrollIntoView() : scrollTo(0, 0));
  });

  const nav = $('.nav');
  let last = 0;
  const onScroll = (y) => {
    nav.classList.toggle('scrolled', y > 24);
    nav.classList.toggle('hide', y > 400 && y > last);
    last = y;
  };
  lenis ? lenis.on('scroll', ({ scroll }) => onScroll(scroll)) : addEventListener('scroll', () => onScroll(scrollY));

  $$('.nav-links a').forEach((a) => {
    ScrollTrigger.create({ trigger: $(a.getAttribute('href')), start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('on', s.isActive) });
  });
  $$('section.dark').forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 40px', end: 'bottom 40px', onToggle: (st) => nav.classList.toggle('on-dark', st.isActive) }));
}

/* ---------------------------------------------------------------- reveals */
function count(el, dur = 1.6) {
  const n = +el.dataset.count, o = { v: 0 };
  gsap.to(o, { v: n, duration: dur, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } });
}

function setupReveals() {
  const bars = (sel) => $$(sel).forEach((b, i) => gsap.to(b, { scaleX: +b.dataset.w, duration: 1.4, ease: 'expo.out', delay: reduce ? 0 : 0.1 + i * 0.06 }));
  if (reduce) { bars('#memBars i'); return; }

  $$('.fade, .rise').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.set(el, { opacity: 0, y: 26 });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }) });
  });
  $$('.diagram').forEach((f) => {
    gsap.fromTo(f, { clipPath: 'inset(8% 4% 8% 4% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%', once: true } });
  });
  $$('.proof').forEach((p) => ScrollTrigger.create({ trigger: p, start: 'top 88%', once: true, onEnter: () => $$('[data-count]', p).forEach((el) => count(el, 1.4)) }));
  ScrollTrigger.create({ trigger: '#memBars', start: 'top 85%', once: true, onEnter: () => bars('#memBars i') });
  $$('.code-in').forEach((c) => ScrollTrigger.create({ trigger: c, start: 'top 80%', once: true, onEnter: () => gsap.from($$('.ln', c), { opacity: 0, x: -8, duration: 0.5, stagger: 0.025, ease: 'power2.out' }) }));
}

function setupPipeline() {
  const steps = $$('#pipeSteps li');
  if (reduce) { steps.forEach((s) => s.classList.add('on')); gsap.set('#pipeFill', { scaleX: 1 }); return; }
  ScrollTrigger.create({
    trigger: '#pipe', start: 'top 80%', end: 'top 35%', scrub: true,
    onUpdate: (s) => {
      gsap.set('#pipeFill', { scaleX: s.progress });
      $('#pipeDot').style.left = s.progress * 100 + '%';
      steps.forEach((st, i) => st.classList.toggle('on', i / (steps.length - 1) <= s.progress + 0.01));
    }
  });
}

/* ---------------------------------------------------------------- lightbox and video player */
function setupLightbox() {
  const lb = $('#lightbox'), sc = $('.lb-scroll');
  const close = () => { lb.hidden = true; sc.innerHTML = ''; lenis && lenis.start(); };
  const open = (html, tall) => {
    sc.innerHTML = html;
    sc.classList.remove('zoom'); sc.classList.toggle('tall', !!tall);
    lb.hidden = false; lenis && lenis.stop();
  };
  document.addEventListener('click', (e) => {
    const p = e.target.closest('[data-play]');
    if (p) {
      const [f, t] = d.videos[p.dataset.play];
      open(`<video class="lb-video" controls autoplay playsinline poster="videos/${f}.webp" aria-label="${t}"><source src="videos/${f}.mp4" type="video/mp4"></video>`);
      return;
    }
    const z = e.target.closest('[data-zoom]');
    if (!z) return;
    const i = $('img', z);
    open(`<img src="${i.src}" alt="${i.alt}">`, i.naturalHeight > i.naturalWidth);
  });
  sc.addEventListener('click', (e) => {
    if (e.target === sc) close();
    else if (e.target.tagName === 'IMG') sc.classList.toggle('zoom');
  });
  $('.lb-close').addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
  // One video plays at a time
  document.addEventListener('play', (e) => $$('video').forEach((v) => { if (v !== e.target) v.pause(); }), true);
}

/* ---------------------------------------------------------------- intro */
function intro() {
  const pre = $('#pre'), rises = $$('.hero .rise, .hero .fade');
  if (reduce) { pre.remove(); document.body.classList.remove('is-loading'); return; }
  gsap.set(rises, { opacity: 0, y: 28 });
  gsap.set('.nav', { yPercent: -100 });
  gsap.set('.pre-dots i', { scale: 0 });
  gsap.timeline()
    .to('.pre-dots i', { scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: { each: 0.05, from: 'start' } })
    .to('.pre-dots i.on', { scale: 1.5, duration: 0.35, ease: 'power2.out' }, '+=0.05')
    .to(pre, { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.1, onStart: () => document.body.classList.remove('is-loading') })
    .to(rises, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09 }, '-=0.3')
    .to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, '-=1')
    .add(() => { pre.remove(); $$('#metrics [data-count]').forEach((el) => count(el)); });
}

/* ---------------------------------------------------------------- start */
render();
setupScroll();
setupLightbox();
setupHeroCalendar();
setupSeason();
setupRolling();

document.fonts.ready.then(() => {
  setupReveals();
  intro();
  setupPipeline();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
  // Lazy images change the height of the page, so trigger positions are measured again
  let t;
  document.addEventListener('load', (e) => { if (e.target.tagName === 'IMG') { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200); } }, true);
});
