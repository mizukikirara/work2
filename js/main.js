/* ============================================================
 * main.js —— 交互、动效、粒子背景与图表懒加载
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 粒子网络背景 ---------- */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('home');
    let w, h, particles = [], mouse = { x: -9999, y: -9999 };
    const COLORS_P = ['#22d3ee', '#3b82f6', '#a855f7'];
    const COUNT = Math.min(90, Math.floor(window.innerWidth / 14));

    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function spawn() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1,
          c: COLORS_P[Math.floor(Math.random() * COLORS_P.length)],
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();

        // 与其他粒子连线
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(99,102,241,' + (0.14 * (1 - d / linkDist)) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        // 与鼠标连线
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 170) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(34,211,238,' + (0.25 * (1 - dm / 170)) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }

    resize(); spawn(); draw();
    window.addEventListener('resize', () => { resize(); spawn(); });
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
  }

  /* ---------- 导航栏滚动效果 / 滚动进度 / 回到顶部 ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (backTop) backTop.classList.toggle('show', y > 600);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? (y / docH) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = p + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 移动端菜单 ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- 滚动监听：高亮当前导航 ---------- */
  function initScrollSpy() {
    const sections = document.querySelectorAll('main section, header.hero');
    const links = document.querySelectorAll('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- 入场动画（reveal） ---------- */
  let revealObserver = null;
  function initReveal() {
    // 给网格内子元素自动添加错峰延迟
    const staggerGroups = ['.hero-stats', '.concept-grid', '.conclusion-grid', '.industry-cards', '.concept-flow'];
    staggerGroups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((group) => {
        const children = group.querySelectorAll(':scope > *');
        children.forEach((child, i) => {
          if (!child.hasAttribute('data-delay')) child.setAttribute('data-delay', String(i + 1));
        });
      });
    });
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('in-view');
      revealObserver.observe(el);
    });
  }

  /* ---------- 数字滚动动画 ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const val = target * eased;
      el.textContent = val.toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }

  let counterObserver = null;
  function initCounters() {
    if (counterObserver) counterObserver.disconnect();
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach((c) => counterObserver.observe(c));
  }

  /* ---------- 图表懒加载 ---------- */
  const CHART_MAP = {
    chartMarket: initChartMarket,
    chartGartner: initChartGartner,
    chartEconomy: initChartEconomy,
    chartEconomyPie: initChartEconomyPie,
    chartChina: initChartChina,
    chartChinaPie: initChartChinaPie,
    chartSankey: initChartSankey,
    chartProductivity: initChartProductivity,
    chartFunnel: initChartFunnel,
    chartPatentGlobal: initChartPatentGlobal,
    chartPatentShare: initChartPatentShare,
    chartPatentCountry: initChartPatentCountry,
    chartAdoption: initChartAdoption,
    chartTreemap: initChartTreemap,
  };

  const chartObserved = new Set();
  let chartObserver = null;

  // 初始化单个图表（幂等：同一 DOM 只初始化一次）
  function initChartById(id) {
    if (chartObserved.has(id)) return;
    const fn = CHART_MAP[id];
    if (typeof fn !== 'function') return;
    chartObserved.add(id);
    fn();
  }

  function initChartsLazy() {
    if (typeof echarts === 'undefined') {
      document.querySelectorAll('.chart').forEach((el) => {
        el.innerHTML = '<div style="padding:40px;text-align:center;color:#9aa7bd">图表库加载失败，请检查网络后刷新页面。</div>';
      });
      return;
    }
    if (chartObserver) chartObserver.disconnect();
    chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) initChartById(entry.target.id);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    Object.keys(CHART_MAP).forEach((id) => {
      const el = document.getElementById(id);
      if (el && !chartObserved.has(id)) chartObserver.observe(el);
    });
  }

  /* ---------- 首页按钮：全屏演示 ---------- */
  function initHeroActions() {
    const btnFullscreen = document.getElementById('btnFullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        const root = document.documentElement;
        if (!document.fullscreenElement) {
          if (root.requestFullscreen) root.requestFullscreen().catch(() => {});
          else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      });
      document.addEventListener('fullscreenchange', () => {
        const on = !!document.fullscreenElement;
        btnFullscreen.innerHTML = '<span class="btn-ico">' + (on ? '⤢' : '⛶') + '</span> ' + (on ? '退出全屏' : '全屏演示');
        // 全屏切换后图表区域尺寸变化，强制自适应
        setTimeout(() => { if (typeof resizeAllCharts === 'function') resizeAllCharts(); }, 250);
      });
    }
  }

  /* ---------- 窗口 resize 自适应 ---------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof resizeAllCharts === 'function') resizeAllCharts();
    }, 200);
  });

  /* ---------- 启动 ---------- */
  function boot() {
    initParticles();
    initReveal();
    initCounters();
    initScrollSpy();
    initChartsLazy();
    initHeroActions();
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
