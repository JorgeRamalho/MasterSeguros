/* ============================================================
   MASTER SEGUROS — script.js
   Efeitos dinâmicos, navegação, contadores, countdown,
   máscaras e validação completa do formulário de cadastro.
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setYear();
    initScrollEffects();
    initNav();
    initReveal();
    initCounters();
    initCountdown();
    initFaqSingleOpen();
    initHeroQuickpick();
    initTilt();
    initCarousel();
    initForm();
  }

  /* ---------- Carrossel (efeitos de slide, autoplay, swipe) ---------- */
  function initCarousel() {
    const track = $('#carouselTrack');
    if (!track) return;
    const slides = $$('.cslide', track);
    const dotsWrap = $('#carouselDots');
    const prev = $('#carouselPrev');
    const next = $('#carouselNext');
    const progress = $('#carouselProgress');
    const carousel = $('#carrossel');
    const DELAY = 5000;
    if (!slides.length) return;

    let index = 0;
    let timer = null;
    let paused = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Ir para imagem ' + (i + 1));
      b.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(b);
    });
    const dots = $$('button', dotsWrap);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      restartProgress();
    }

    function restartProgress() {
      if (!progress || reduce) return;
      progress.style.setProperty('--car-delay', DELAY + 'ms');
      progress.classList.remove('run');
      void progress.offsetWidth; // reflow
      if (!paused) progress.classList.add('run');
    }

    function go(i, user) {
      index = (i + slides.length) % slides.length;
      render();
      if (user) restartTimer();
    }
    const nextSlide = () => go(index + 1);
    const prevSlide = () => go(index - 1);

    function startTimer() {
      if (reduce) return;
      stopTimer();
      timer = setInterval(() => { if (!paused) nextSlide(); }, DELAY);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
    function restartTimer() { startTimer(); }

    if (next) next.addEventListener('click', () => { nextSlide(); restartTimer(); });
    if (prev) prev.addEventListener('click', () => { prevSlide(); restartTimer(); });

    // Pausa ao passar o mouse
    if (carousel) {
      carousel.addEventListener('mouseenter', () => { paused = true; if (progress) progress.classList.remove('run'); });
      carousel.addEventListener('mouseleave', () => { paused = false; restartProgress(); });
    }

    // Pausa quando a aba não está visível
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
      if (document.hidden) { if (progress) progress.classList.remove('run'); }
      else restartProgress();
    });

    // Teclado
    if (carousel) {
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { nextSlide(); restartTimer(); }
        if (e.key === 'ArrowLeft') { prevSlide(); restartTimer(); }
      });
    }

    // Swipe / arraste (touch e mouse)
    let startX = 0, deltaX = 0, dragging = false;
    const onStart = (x) => { dragging = true; startX = x; deltaX = 0; track.style.transition = 'none'; };
    const onMove = (x) => {
      if (!dragging) return;
      deltaX = x - startX;
      track.style.transform = `translateX(calc(-${index * 100}% + ${deltaX}px))`;
    };
    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = '';
      const threshold = track.clientWidth * 0.18;
      if (deltaX < -threshold) nextSlide();
      else if (deltaX > threshold) prevSlide();
      else render();
      restartTimer();
    };

    track.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', onEnd);

    track.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX); });
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    render();
    startTimer();
  }

  /* ---------- Seletor rápido do Hero (estilo app) ---------- */
  function initHeroQuickpick() {
    const chips = $$('.chip');
    const coverName = $('#coverName');
    const coverIcon = $('#coverIcon');
    const appCover = $('#appCover');
    if (!chips.length) return;

    const icons = {
      car: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14M6 17l1.5-5h9L18 17"/><circle cx="7.5" cy="17.5" r="1.3"/><circle cx="16.5" cy="17.5" r="1.3"/></svg>',
      heart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5C2 10.7 3.5 12.5 5 14l7 7z"/></svg>',
      home: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 9.5V21h14V9.5"/></svg>',
      biz: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/></svg>',
      health: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => { c.classList.remove('is-active'); c.setAttribute('aria-selected', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-selected', 'true');

        const cover = chip.dataset.cover || 'Seguro';
        const iconKey = chip.dataset.icon || 'car';

        if (coverName) coverName.textContent = cover;
        if (coverIcon && icons[iconKey]) coverIcon.innerHTML = icons[iconKey];

        // Re-dispara a animação de entrada do cartão de cobertura
        if (appCover) {
          appCover.style.animation = 'none';
          void appCover.offsetWidth; // reflow
          appCover.style.animation = '';
        }

        // Guarda o interesse para o formulário (pré-seleção)
        try { sessionStorage.setItem('ms_interesse', cover); } catch (_) {}
      });
    });
  }

  /* ---------- Tilt 3D suave no painel do app (desktop) ---------- */
  function initTilt() {
    const card = $('#appcard');
    const visual = $('.hero__visual');
    if (!card || !visual) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    visual.addEventListener('mousemove', (e) => {
      const r = visual.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(1400px) rotateY(${px * 8 - 2}deg) rotateX(${ -py * 8 + 1}deg)`;
    });
    visual.addEventListener('mouseleave', () => { card.style.transform = ''; });
  }

  /* ---------- Ano no rodapé ---------- */
  function setYear() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Header scrolled + barra de progresso ---------- */
  function initScrollEffects() {
    const header = $('#header');
    const progress = $('#scrollProgress');

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('scrolled', scrollTop > 12);
      if (progress) progress.style.width = docH > 0 ? (scrollTop / docH) * 100 + '%' : '0%';
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Navegação mobile + scroll suave ---------- */
  function initNav() {
    const nav = $('#nav');
    const toggle = $('#navToggle');
    const close = $('#navClose');

    // Cria o fundo escurecido (backdrop) atrás do menu
    let backdrop = $('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const openMenu = () => {
      nav.classList.add('open');
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    const closeMenu = () => {
      nav.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    };

    if (toggle) toggle.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    $$('#nav a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    // Scroll suave com compensação do header sticky
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerH = $('#header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH + 2;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  function initReveal() {
    const items = $$('.reveal');
    const panels = $$('.diff__panel');
    const all = items.concat(panels);
    if (!('IntersectionObserver' in window)) { all.forEach((el) => el.classList.add('in-view')); return; }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // pequeno stagger para itens próximos
          setTimeout(() => entry.target.classList.add('in-view'), (i % 4) * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    all.forEach((el) => io.observe(el));
  }

  /* ---------- Contadores animados ---------- */
  function initCounters() {
    const nums = $$('.stat__num');
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const val = Math.floor(eased * target);
        el.textContent = val.toLocaleString('pt-BR') + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('pt-BR') + suffix;
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(animate); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- Countdown de inauguração (15 dias a partir de agora) ---------- */
  function initCountdown() {
    const elD = $('#cd-days'), elH = $('#cd-hours'), elM = $('#cd-min'), elS = $('#cd-sec');
    if (!elD) return;

    // Mantém a data fixa entre recarregamentos da sessão
    let deadline = sessionStorage.getItem('ms_deadline');
    if (!deadline) {
      deadline = Date.now() + 15 * 24 * 60 * 60 * 1000;
      sessionStorage.setItem('ms_deadline', deadline);
    }
    deadline = Number(deadline);

    const pad = (n) => String(n).padStart(2, '0');

    const update = () => {
      let diff = deadline - Date.now();
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      elD.textContent = pad(d);
      elH.textContent = pad(h);
      elM.textContent = pad(m);
      elS.textContent = pad(s);
    };

    update();
    setInterval(update, 1000);
  }

  /* ---------- FAQ: abrir um por vez ---------- */
  function initFaqSingleOpen() {
    const items = $$('.faq__item');
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) items.forEach((o) => { if (o !== item) o.open = false; });
      });
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(msg, type = 'success') {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = 'toast show toast--' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3800);
  }

  /* ---------- Máscara de telefone BR ---------- */
  function maskPhone(value) {
    let v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
        [a && `(${a}`, a.length === 2 ? ') ' : '', b, c && `-${c}`].join('').trim());
    } else {
      v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    }
    return v;
  }

  /* ---------- Validadores ---------- */
  const validators = {
    nome(v) {
      if (!v.trim()) return 'Informe seu nome completo.';
      if (v.trim().length < 3) return 'Nome muito curto.';
      if (!/\s/.test(v.trim())) return 'Informe nome e sobrenome.';
      return '';
    },
    nascimento(v) {
      if (!v) return 'Informe sua data de nascimento.';
      const date = new Date(v);
      const today = new Date();
      if (date > today) return 'Data inválida.';
      const age = (today - date) / (365.25 * 24 * 3600 * 1000);
      if (age < 18) return 'É necessário ter 18 anos ou mais.';
      if (age > 120) return 'Data inválida.';
      return '';
    },
    cidade(v) {
      if (!v.trim()) return 'Informe sua cidade.';
      if (v.trim().length < 2) return 'Cidade inválida.';
      return '';
    },
    telefone(v) {
      const digits = v.replace(/\D/g, '');
      if (!digits) return 'Informe seu telefone.';
      if (digits.length < 10) return 'Telefone incompleto (com DDD).';
      return '';
    },
    email(v) {
      if (!v.trim()) return 'Informe seu e-mail.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'E-mail inválido.';
      return '';
    },
    endereco(v) {
      if (!v.trim()) return 'Informe seu endereço completo.';
      if (v.trim().length < 6) return 'Endereço muito curto.';
      return '';
    },
    consent(checked) {
      if (!checked) return 'É necessário aceitar para continuar.';
      return '';
    },
  };

  /* ---------- Formulário ---------- */
  function initForm() {
    const form = $('#signupForm');
    if (!form) return;

    const fields = ['nome', 'nascimento', 'cidade', 'telefone', 'email', 'endereco'];
    const phone = $('#telefone');
    const consent = $('#consent');

    // Limite máximo da data de nascimento = hoje
    const nasc = $('#nascimento');
    if (nasc) nasc.max = new Date().toISOString().split('T')[0];

    // Máscara de telefone em tempo real
    if (phone) phone.addEventListener('input', (e) => { e.target.value = maskPhone(e.target.value); });

    const setError = (name, msg) => {
      const input = $('#' + name);
      const errEl = $(`[data-error-for="${name}"]`);
      const fieldWrap = input ? input.closest('.field') : null;
      if (errEl) errEl.textContent = msg;
      if (fieldWrap) {
        fieldWrap.classList.toggle('is-invalid', !!msg);
        fieldWrap.classList.toggle('is-valid', !msg && (input.value || '').trim() !== '');
      }
    };

    const validateField = (name) => {
      const input = $('#' + name);
      if (!input) return true;
      const val = name === 'consent' ? input.checked : input.value;
      const msg = validators[name] ? validators[name](val) : '';
      setError(name, msg);
      return !msg;
    };

    // Validação on blur / input
    fields.forEach((name) => {
      const input = $('#' + name);
      if (!input) return;
      input.addEventListener('blur', () => validateField(name));
      input.addEventListener('input', () => {
        const errEl = $(`[data-error-for="${name}"]`);
        if (errEl && errEl.textContent) validateField(name);
      });
    });
    if (consent) consent.addEventListener('change', () => {
      const errEl = $('[data-error-for="consent"]');
      const msg = validators.consent(consent.checked);
      if (errEl) errEl.textContent = msg;
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let firstInvalid = null;
      let ok = true;

      fields.forEach((name) => {
        const valid = validateField(name);
        if (!valid && !firstInvalid) firstInvalid = $('#' + name);
        ok = ok && valid;
      });

      const consentMsg = validators.consent(consent.checked);
      const consentErr = $('[data-error-for="consent"]');
      if (consentErr) consentErr.textContent = consentMsg;
      if (consentMsg) { ok = false; if (!firstInvalid) firstInvalid = consent; }

      if (!ok) {
        showToast('Confira os campos destacados.', 'error');
        if (firstInvalid) firstInvalid.focus({ preventScroll: false });
        return;
      }

      submitForm(form);
    });

    function submitForm(formEl) {
      const btn = $('#submitBtn');
      btn.classList.add('is-loading');
      btn.disabled = true;

      // Coleta dos dados (pronto para integrar a um backend/API)
      const data = {
        nome: $('#nome').value.trim(),
        nascimento: $('#nascimento').value,
        cidade: $('#cidade').value.trim(),
        telefone: $('#telefone').value.trim(),
        email: $('#email').value.trim(),
        endereco: $('#endereco').value.trim(),
        interesse: (function () { try { return sessionStorage.getItem('ms_interesse') || 'Não informado'; } catch (_) { return 'Não informado'; } })(),
        cupom: 'MASTER40',
        criadoEm: new Date().toISOString(),
      };

      // Simula envio assíncrono (substituir por fetch para o servidor real)
      setTimeout(() => {
        try {
          const saved = JSON.parse(localStorage.getItem('ms_leads') || '[]');
          saved.push(data);
          localStorage.setItem('ms_leads', JSON.stringify(saved));
        } catch (_) { /* storage indisponível */ }

        console.log('[Master Seguros] Novo cadastro:', data);

        btn.classList.remove('is-loading');
        btn.disabled = false;

        // Mostra estado de sucesso
        const success = $('#formSuccess');
        const firstName = data.nome.split(' ')[0];
        $('#successName').textContent = firstName;

        formEl.hidden = true;
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Cadastro realizado com sucesso!', 'success');
      }, 1400);
    }

    // Copiar cupom
    const copyBtn = $('#copyCoupon');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const code = $('#couponCode').textContent.trim();
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.textContent = 'Copiado!';
          showToast('Cupom ' + code + ' copiado!', 'success');
          setTimeout(() => (copyBtn.textContent = 'Copiar código'), 2200);
        } catch (_) {
          showToast('Não foi possível copiar. Código: ' + code, 'error');
        }
      });
    }

    // Novo cadastro
    const newBtn = $('#newRegister');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        form.reset();
        $$('.field').forEach((f) => f.classList.remove('is-invalid', 'is-valid'));
        $$('.field__error').forEach((er) => (er.textContent = ''));
        $('#formSuccess').hidden = true;
        form.hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }
})();
