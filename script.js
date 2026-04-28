// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.dataset.counter) startCounter(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach(el => observer.observe(el));

// ===== ANIMATED COUNTERS =====
function startCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = 'true';
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimal = el.dataset.decimal === 'true';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = prefix + (decimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    container.appendChild(p);
  }
}
createParticles();

// ===== MAP TOOLTIPS =====
const mapRegions = document.querySelectorAll('.map-zone');
const mapTooltip = document.querySelector('.map-tooltip');
mapRegions.forEach(region => {
  region.addEventListener('mouseenter', (e) => {
    if (mapTooltip) {
      mapTooltip.innerHTML = `<strong>${region.dataset.name}</strong><br>${region.dataset.info}`;
      mapTooltip.style.opacity = '1';
    }
  });
  region.addEventListener('mousemove', (e) => {
    if (mapTooltip) {
      const rect = document.querySelector('.map-container').getBoundingClientRect();
      mapTooltip.style.left = (e.clientX - rect.left + 15) + 'px';
      mapTooltip.style.top = (e.clientY - rect.top - 10) + 'px';
    }
  });
  region.addEventListener('mouseleave', () => {
    if (mapTooltip) mapTooltip.style.opacity = '0';
  });
});

// ===== DASHBOARD LIVE DATA =====
function updateDashboard() {
  const els = {
    consumo: document.getElementById('dash-consumo'),
    fugas: document.getElementById('dash-fugas'),
    ahorro: document.getElementById('dash-ahorro'),
    alertas: document.getElementById('dash-alertas')
  };

  if (els.consumo) {
    const base = 1247;
    els.consumo.textContent = (base + Math.floor(Math.random() * 50 - 25)).toLocaleString() + ' m³/h';
  }
  if (els.fugas) {
    els.fugas.textContent = Math.floor(Math.random() * 3 + 12);
  }
  if (els.ahorro) {
    els.ahorro.textContent = (27 + Math.random() * 4).toFixed(1) + '%';
  }
  if (els.alertas) {
    els.alertas.textContent = Math.floor(Math.random() * 4 + 3);
  }
}
setInterval(updateDashboard, 3000);
updateDashboard();

// ===== CHARTS (Chart.js) =====
function initCharts() {
  // Consumption chart
  const ctx1 = document.getElementById('consumoChart');
  if (ctx1 && typeof Chart !== 'undefined') {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          label: 'Consumo (hm³)',
          data: [320, 290, 340, 380, 450, 520, 610, 590, 420, 350, 300, 310],
          borderColor: '#1DA1F2',
          backgroundColor: 'rgba(29,161,242,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#1DA1F2',
          pointRadius: 4
        }, {
          label: 'Con Volt-Stream (hm³)',
          data: [280, 255, 295, 330, 385, 440, 510, 495, 360, 305, 265, 275],
          borderColor: '#00C853',
          backgroundColor: 'rgba(0,200,83,0.05)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00C853',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // Region chart
  const ctx2 = document.getElementById('regionChart');
  if (ctx2 && typeof Chart !== 'undefined') {
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Andalucía', 'Murcia', 'Valencia', 'Cataluña', 'Interior'],
        datasets: [{
          data: [35, 20, 18, 15, 12],
          backgroundColor: ['#FF1744', '#FF9100', '#FFD600', '#1DA1F2', '#00C853'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.7)', font: { size: 11 }, padding: 12 } } }
      }
    });
  }
}

window.addEventListener('load', initCharts);

// ===== CHATBOT =====
const chatToggle = document.getElementById('chatbot-toggle');
const chatWindow = document.getElementById('chatbot-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle) chatToggle.addEventListener('click', () => chatWindow.classList.add('open'));
if (chatClose) chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

const botResponses = {
  'hola': '¡Hola! 👋 Soy VoltBot, tu asistente de Volt-Stream. ¿En qué puedo ayudarte?',
  'fugas': 'Nuestro sistema de IA detecta fugas en tiempo real analizando patrones de presión y flujo. Podemos identificar fugas tan pequeñas como 0.5 L/min en redes de distribución.',
  'precio': 'Nuestras soluciones se adaptan a cada municipio. El coste medio es de 2-5€ por habitante/año, con un ROI medio del 300% en 2 años gracias al ahorro de agua.',
  'sequía': 'Usamos modelos predictivos basados en datos climáticos, históricos y satelitales para anticipar sequías con hasta 6 meses de antelación.',
  'demo': '¡Excelente! Puedes solicitar una demo gratuita en nuestra sección de contacto. Te mostraremos el dashboard en vivo con datos de tu municipio.',
  'agricultura': 'Optimizamos el riego agrícola con sensores de humedad del suelo, datos meteorológicos y algoritmos de IA. Ahorramos hasta un 40% de agua en cultivos.',
  'sensores': 'Utilizamos sensores IoT de última generación: caudalímetros ultrasónicos, sensores de presión, humedad del suelo y calidad del agua, todos conectados en tiempo real.',
  'ahorro': 'En promedio, nuestros clientes ahorran un 30% en pérdidas de agua y un 25% en consumo energético. El retorno de inversión se logra en menos de 18 meses.',
  'contacto': 'Puedes contactarnos en info@volt-stream.es o llamar al +34 910 123 456. También puedes usar el formulario de contacto en esta misma web.',
  'municipio': 'Trabajamos con municipios de todos los tamaños, desde pequeños pueblos rurales hasta grandes ciudades. Tenemos soluciones escalables para cada necesidad.',
};

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, value] of Object.entries(botResponses)) {
    if (lower.includes(key)) return value;
  }
  return 'Gracias por tu pregunta. Nuestro equipo puede darte información más detallada. ¿Te gustaría agendar una llamada? Escribe "contacto" para más info, o pregúntame sobre: fugas, sequía, agricultura, sensores, ahorro, precio o demo.';
}

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + type;
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage(getBotResponse(text), 'bot'), 600);
}

if (chatSend) chatSend.addEventListener('click', handleChat);
if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChat(); });

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navLinks) navLinks.classList.remove('active');
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Enviado correctamente';
    btn.style.background = '#00C853';
    setTimeout(() => {
      btn.textContent = 'Solicitar implementación';
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ===== ESTADÍSTICAS CHARTS =====
function initEstadisticasCharts() {
  // Chart 1: Historical loss evolution
  const ctxPerdida = document.getElementById('perdidaChart');
  if (ctxPerdida && typeof Chart !== 'undefined') {
    new Chart(ctxPerdida, {
      type: 'line',
      data: {
        labels: ['2014','2016','2018','2020','2022','2024'],
        datasets: [
          {
            label: 'Agua No Registrada (hm³)',
            data: [1383,1295,1105,946,866,631],
            borderColor: '#FF1744',
            backgroundColor: 'rgba(255,23,68,0.1)',
            fill: true, tension: 0.4,
            pointBackgroundColor: '#FF1744', pointRadius: 5
          },
          {
            label: 'Fugas Reales (hm³)',
            data: [778,710,632,548,520,361],
            borderColor: '#FF9100',
            backgroundColor: 'rgba(255,145,0,0.08)',
            fill: true, tension: 0.4,
            pointBackgroundColor: '#FF9100', pointRadius: 5
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)', font: { size: 11 } } } },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.05)' },
               title: { display: true, text: 'hm³', color: 'rgba(255,255,255,0.4)' } }
        }
      }
    });
  }

  // Chart 2: CCAA efficiency
  const ctxCCAA = document.getElementById('ccaaChart');
  if (ctxCCAA && typeof Chart !== 'undefined') {
    new Chart(ctxCCAA, {
      type: 'bar',
      data: {
        labels: ['Galicia','País Vasco','Madrid','Cataluña','Canarias','Baleares','Murcia','C. Valenciana','Aragón','C. y León','Andalucía','C.-La Mancha'],
        datasets: [{
          label: 'Eficiencia sistema (%)',
          data: [88,86,85,82,83,81,80,78,77,74,75,72],
          backgroundColor: [
            '#00C853','#00C853','#FFD600','#FF9100','#FF9100','#FFD600',
            '#FF9100','#FF5722','#FFD600','#FFD600','#FF1744','#FF1744'
          ],
          borderWidth: 0, borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            min: 60, max: 95,
            ticks: { color: 'rgba(255,255,255,0.5)', callback: v => v + '%' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: { ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 11 } }, grid: { display: false } }
        }
      }
    });
  }

  // Chart 3: Water price comparison
  const ctxPrecio = document.getElementById('precioChart');
  if (ctxPrecio && typeof Chart !== 'undefined') {
    new Chart(ctxPrecio, {
      type: 'bar',
      data: {
        labels: ['Grecia','Castilla y León','España','Cataluña','Alemania','Francia','Media UE','Dinamarca'],
        datasets: [{
          label: '€/m³',
          data: [1.15, 1.24, 1.92, 2.98, 4.00, 4.20, 4.50, 9.32],
          backgroundColor: [
            '#FF1744','#FF1744','#FF9100','#FFD600',
            '#1DA1F2','#1DA1F2','#00C853','#00C853'
          ],
          borderWidth: 0, borderRadius: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          annotation: {}
        },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.65)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: 'rgba(255,255,255,0.5)', callback: v => v + ' €' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

window.addEventListener('load', initEstadisticasCharts);

// ===== VIDEO PLAYER =====
(function initVideoPlayer() {
  const video = document.getElementById('main-video');
  const overlay = document.getElementById('video-overlay');
  const playBtn = document.getElementById('video-play-btn');

  if (!video || !overlay) return;

  function playVideo() {
    overlay.classList.add('hidden');
    video.controls = true;
    video.play().catch(() => {
      // autoplay blocked — show controls anyway
      video.controls = true;
    });
  }

  overlay.addEventListener('click', playVideo);

  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
    video.controls = false;
    video.currentTime = 0;
  });

  video.addEventListener('pause', () => {
    if (video.ended) return;
    // optional: could re-show overlay on pause
  });
})();
