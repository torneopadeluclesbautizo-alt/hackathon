  document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect & Progress Bar
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + "%";
    }
  });

  // 2. Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // 3. Custom Cursor Initialization
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.classList.add('custom-cursor-follower');
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .glass-card, .nav-logo');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    // 3D Tilt Effect for Glass Cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update CSS variables for radial gradient glow
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      });
    });
  }

  // 4. Intersection Observer for fade-up animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger stat counters if it's a stat item
        if (entry.target.classList.contains('stat-item') && !entry.target.dataset.counted) {
          const valueEl = entry.target.querySelector('.stat-value');
          if (valueEl) {
            animateValue(valueEl);
            entry.target.dataset.counted = "true";
          }
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in, .flip-up').forEach(el => {
    observer.observe(el);
  });

  // 5. Stat Counter Animation
  function animateValue(obj) {
    const target = parseFloat(obj.getAttribute('data-target'));
    const prefix = obj.getAttribute('data-prefix') || '';
    const suffix = obj.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = 0;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (target - start) * easeProgress;
      
      // Format number
      let formatted = current % 1 !== 0 ? current.toFixed(1) : Math.floor(current);
      obj.innerHTML = prefix + formatted + suffix;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // 6. Typewriter Effect
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const words = ['futuro', 'consumo', 'rendimiento'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before next word
      }

      setTimeout(type, typeSpeed);
    }
    
    // Start typing effect after 1s
    setTimeout(type, 1000);
  }

  // 7. Scroll Sequence Animation
  const scrollSeq = document.getElementById('scroll-sequence');
  const seqImg = document.getElementById('sequence-img');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');

  if (scrollSeq && seqImg) {
    window.addEventListener('scroll', () => {
      const rect = scrollSeq.getBoundingClientRect();
      const seqTop = rect.top;
      const seqHeight = rect.height - window.innerHeight;
      
      // Calculate progress from 0 to 1
      let progress = -seqTop / seqHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Image Animations
      let imgScale = 1;
      let imgRotate = 0;
      let imgOpacity = 1;
      let imgY = 0;

      if (progress < 0.25) {
        // 0 to 25% - Scale up and move up
        const p = progress / 0.25;
        imgScale = 0.6 + (0.4 * p); // 0.6 to 1.0
        imgY = 100 - (100 * p); // from 100px down to 0
      } else if (progress < 0.5) {
        // 25% to 50% - Rotate
        const p = (progress - 0.25) / 0.25;
        imgScale = 1;
        imgRotate = -10 * p;
      } else if (progress < 0.75) {
        // 50% to 75% - Zoom in slightly and rotate back
        const p = (progress - 0.5) / 0.25;
        imgScale = 1 + (0.5 * p);
        imgRotate = -10 + (20 * p); // Rotate from -10 to +10
      } else {
        // 75% to 100% - Massive zoom and fade out
        const p = (progress - 0.75) / 0.25;
        imgScale = 1.5 + (4 * p); 
        imgRotate = 10 + (5 * p);
        imgOpacity = 1 - p; 
      }

      seqImg.style.transform = `translateY(${imgY}px) scale(${imgScale}) rotate(${imgRotate}deg)`;
      seqImg.style.opacity = imgOpacity;

      // Text Animations
      function animateText(el, startP, endP) {
        if (progress >= startP && progress < endP) {
          const range = endP - startP;
          const p = (progress - startP) / range;
          
          let opacity = 0;
          let y = 30;
          
          if (p < 0.2) {
            opacity = p / 0.2;
            y = 30 * (1 - (p / 0.2));
          } else if (p < 0.8) {
            opacity = 1;
            y = 0;
          } else {
            opacity = 1 - ((p - 0.8) / 0.2);
            y = -30 * ((p - 0.8) / 0.2);
          }
          
          el.style.opacity = opacity;
          el.style.transform = `translateY(${y}px)`;
          el.style.display = 'block';
        } else {
          el.style.opacity = 0;
          el.style.display = 'none';
        }
      }

      animateText(step1, 0.0, 0.33);
      animateText(step2, 0.33, 0.66);
      animateText(step3, 0.66, 1.0);
    });
    
    // Trigger scroll event once to set initial state
    window.dispatchEvent(new Event('scroll'));
  }

  // 8. Particle Canvas (Hero)
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 15000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#00A8CC';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          if (distance < (canvas.width / 10) * (canvas.height / 10)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = 'rgba(0, 168, 204,' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    window.addEventListener('resize', () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      init();
    });

    init();
    animate();
  }

  // 9. 3D Parallax Scroll Effect
  const parallaxSection = document.getElementById('parallax-3d');
  if (parallaxSection) {
    const layers = parallaxSection.querySelectorAll('.parallax-layer[data-speed]');
    const holoContainer = parallaxSection.querySelector('.holo-container');
    const contentBlock = parallaxSection.querySelector('.parallax-text-block');

    let ticking = false;

    function updateParallax() {
      const rect = parallaxSection.getBoundingClientRect();
      const sectionHeight = parallaxSection.offsetHeight;   // 180vh
      const viewportH = window.innerHeight;                 // 100vh
      // scrollTravel = how many px we scroll while the sticky viewport is pinned
      const scrollTravel = sectionHeight - viewportH;      // ~80vh

      // progress 0 → 1 as we scroll through the section
      const rawProgress = -rect.top / scrollTravel;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Each layer moves at its own speed relative to scroll travel
      // speed=0 → stays put; speed=1 → moves full scroll travel distance upwards
      layers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
        const yOffset = progress * scrollTravel * speed;
        layer.style.transform = `translate3d(0, ${-yOffset}px, 0)`;
      });

      // Hologram: start at full size, gentle 3D rotation on scroll
      if (holoContainer) {
        const rotateY = Math.sin(progress * Math.PI * 2) * 10;
        const rotateX = Math.cos(progress * Math.PI * 1.5) * 6;
        holoContainer.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }

      // Content: always visible, gentle upward parallax as you scroll
      if (contentBlock) {
        // Starts slightly below, rises to its natural position
        const contentY = 40 * (1 - Math.min(1, progress / 0.5));
        contentBlock.style.transform = `translateY(${contentY}px)`;
        contentBlock.style.opacity = Math.min(1, progress / 0.3 + 0.3);
      }

      ticking = false;
    }

    function scheduleUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    // Run immediately so first view is correct
    updateParallax();

    // Mouse-reactive glow on holo
    parallaxSection.addEventListener('mousemove', (e) => {
      const x = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const y = (((e.clientY - parallaxSection.getBoundingClientRect().top) / parallaxSection.offsetHeight) * 100).toFixed(1);
      parallaxSection.style.setProperty('--mouse-px', x + '%');
      parallaxSection.style.setProperty('--mouse-py', y + '%');

      if (holoContainer) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const tiltX = ((e.clientY - cy) / cy) * -6;
        const tiltY = ((e.clientX - cx) / cx) * 6;
        holoContainer.style.setProperty('--mouse-tilt-x', tiltX + 'deg');
        holoContainer.style.setProperty('--mouse-tilt-y', tiltY + 'deg');
      }
    });
  }
});

// CHART.JS INITIALIZATION FOR ESTADISTICAS.HTML
document.addEventListener("DOMContentLoaded", () => {
  if(typeof Chart === "undefined") return;
  Chart.defaults.color = "#5A7090";
  Chart.defaults.font.family = "Inter, sans-serif";
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#E8EEF8" } } },
    scales: { 
      x: { grid: { color: "rgba(0, 168, 204, 0.1)" }, ticks: { color: "#5A7090" } },
      y: { grid: { color: "rgba(0, 168, 204, 0.1)" }, ticks: { color: "#5A7090" } }
    }
  };

  if(document.getElementById("consumoChart")) {
    new Chart(document.getElementById("consumoChart"), {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [{ label: "Sin Volt-Stream", data: [400, 390, 410, 420, 450, 480], borderColor: "#E8394A", tension: 0.4 },
                   { label: "Con Volt-Stream", data: [400, 350, 320, 310, 290, 280], borderColor: "#00E5A0", tension: 0.4 }]
      },
      options: chartOptions
    });
  }
  
  if(document.getElementById("regionChart")) {
    new Chart(document.getElementById("regionChart"), {
      type: "bar",
      data: {
        labels: ["Sur", "Levante", "Centro", "Norte"],
        datasets: [{ label: "Nivel de Estr�s", data: [90, 85, 60, 30], backgroundColor: ["#E8394A", "#E89B02", "#00A8CC", "#00E5A0"] }]
      },
      options: chartOptions
    });
  }

  if(document.getElementById("perdidaChart")) {
    new Chart(document.getElementById("perdidaChart"), {
      type: "bar",
      data: {
        labels: ["2014", "2016", "2018", "2020", "2022", "2024"],
        datasets: [{ label: "% P�rdidas", data: [32.0, 31.0, 28.0, 25.0, 24.1, 21.3], backgroundColor: "#00A8CC" }]
      },
      options: chartOptions
    });
  }

  if(document.getElementById("ccaaChart")) {
    new Chart(document.getElementById("ccaaChart"), {
      type: "bar",
      indexAxis: "y",
      data: {
        labels: ["Andaluc�a", "C. Valenciana", "Murcia", "Catalu�a", "Madrid"],
        datasets: [{ label: "Eficiencia (%)", data: [75, 78, 80, 82, 85], backgroundColor: "#6B3FE0" }]
      },
      options: chartOptions
    });
  }

  if(document.getElementById("precioChart")) {
    new Chart(document.getElementById("precioChart"), {
      type: "bar",
      data: {
        labels: ["Espa�a", "Grecia", "Alemania", "Francia", "Media UE", "Dinamarca"],
        datasets: [{ label: "Precio (�/m�)", data: [1.92, 1.15, 4.00, 4.20, 4.50, 9.32], backgroundColor: ["#E8394A", "#E8394A", "#00E5A0", "#00E5A0", "#00A8CC", "#00E5A0"] }]
      },
      options: chartOptions
    });
  }
});


// D3 MAP INITIALIZATION FOR COBERTURA.HTML
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("d3-map-container");
  if (!mapContainer || typeof d3 === "undefined") return;

  const width = mapContainer.clientWidth;
  const height = mapContainer.clientHeight;
  const tooltip = d3.select("#map-tooltip");

  const detailsPanel = document.getElementById("details-panel");
  const detailsContent = document.getElementById("details-content");

  // Mock data for regions
  const regionData = {
    "ESAN": { name: "Andalucía", problem: "Sequía extrema y sobreexplotación de acuíferos.", impact: "Afecta a la agricultura (olivar, invernaderos) y suministro urbano en verano.", actions: "Instalación de 5,000 sensores de humedad. Monitoreo de pozos ilegales.", priority: "Alta", color: "var(--danger)" },
    "ESMC": { name: "Murcia", problem: "Déficit hídrico crónico y alta demanda agrícola.", impact: "Riesgo de desertificación y conflictos por el agua (Trasvase Tajo-Segura).", actions: "Control de caudal en canales de riego, optimización de desaladoras.", priority: "Alta", color: "var(--danger)" },
    "ESVC": { name: "Comunidad Valenciana", problem: "Intrusión salina y episodios de sequía prolongada.", impact: "Contaminación de acuíferos costeros, afectando cítricos y turismo.", actions: "Red de sensores de salinidad en pozos costeros, detección de fugas en red urbana.", priority: "Alta", color: "var(--warning)" },
    "ESCT": { name: "Cataluña", problem: "Bajas reservas en embalses y alta densidad poblacional.", impact: "Restricciones severas en Barcelona y área metropolitana. Impacto en industria.", actions: "Monitoreo en tiempo real de la cuenca del Ter-Llobregat, gestión de presión en tuberías.", priority: "Alta", color: "var(--warning)" },
    "ESAR": { name: "Aragón", problem: "Variabilidad extrema en caudales fluviales.", impact: "Impacto en agricultura de secano y regadío del Valle del Ebro.", actions: "Predicción de caudales con IA, sensores en acequias principales.", priority: "Media", color: "var(--warning)" },
    "ESIB": { name: "Islas Baleares", problem: "Sobreexplotación turística en verano y acuíferos limitados.", impact: "Descenso crítico del nivel freático y salinización.", actions: "Sensores de nivel en acuíferos, control de consumo en grandes complejos.", priority: "Media", color: "var(--warning)" },
    "ESMD": { name: "Comunidad de Madrid", problem: "Alta concentración de demanda en área metropolitana.", impact: "Presión sobre la red de distribución del Canal de Isabel II.", actions: "Micro-sectorización de la red, detección acústica de fugas subterráneas.", priority: "Media", color: "var(--warning)" },
    "ESCL": { name: "Castilla y León", problem: "Infraestructura rural envejecida y grandes distancias.", impact: "Alto porcentaje de pérdidas de agua no registrada (ANR) en pequeños municipios.", actions: "Renovación digital de contadores (IoT), detección de roturas en tuberías antiguas.", priority: "Media", color: "var(--warning)" },
    "default": { name: "Zona en expansión", problem: "Evaluación hidrológica en proceso.", impact: "Variable según municipio y cuenca.", actions: "Planificación de despliegue de sensores fase 2 en los próximos meses.", priority: "Normal", color: "var(--primary)" }
  };

  // Mock data for priority cards
  const priorityData = {
    "andalucia-murcia": {
      title: "Detalle: Andalucía & Murcia",
      color: "var(--danger)",
      description: "Esta macrorregión presenta el mayor nivel de estrés hídrico de toda la Península Ibérica. La combinación de bajas precipitaciones históricas y una enorme demanda del sector agroalimentario crea una situación crítica que requiere actuación inmediata.",
      cities: "Sevilla, Málaga, Almería, Murcia, Cartagena, Córdoba",
      problems: [
        "Sobreexplotación del acuífero de Doñana y Mar Menor, amenazando ecosistemas.",
        "Pérdidas de hasta un 25% en redes de distribución secundarias no monitorizadas.",
        "Dependencia crítica de trasvases intercuencas y plantas de desalación de alto consumo energético."
      ],
      solutions: "Despliegue masivo de sensores de flujo ultrasónicos en tuberías primarias y control de humedad del suelo en tiempo real para optimizar el riego por goteo."
    },
    "valencia-cataluna": {
      title: "Detalle: Comunidad Valenciana & Cataluña",
      color: "var(--warning)",
      description: "Regiones con una orografía compleja y cuencas internas muy tensionadas. La presión demográfica y el turismo masivo estival multiplican exponencialmente la demanda de agua justo cuando los embalses están en su nivel más bajo.",
      cities: "Barcelona, Girona, Valencia, Alicante, Castellón, Tarragona",
      problems: [
        "Embalses clave (ej. Sau, Susqueda) en mínimos históricos repetidamente durante los últimos años.",
        "Intrusión salina galopante en acuíferos costeros y del Delta del Ebro.",
        "Obsolescencia de las canalizaciones subterráneas en cascos históricos de difícil acceso."
      ],
      solutions: "Implementación de gemelos digitales para la red de distribución urbana de Barcelona y Valencia. Despliegue de sensores de conductividad (salinidad) en tiempo real a lo largo de toda la costa."
    },
    "interior": {
      title: "Detalle: Interior y Expansión",
      color: "var(--primary)",
      description: "La 'España Vaciada' sufre de redes de distribución extremadamente antiguas, en muchos casos construidas con materiales obsoletos como el fibrocemento, con mantenimientos muy deficientes por falta de presupuesto e inversión municipal sostenida.",
      cities: "Zaragoza, Valladolid, Toledo, Cáceres, Badajoz, León",
      problems: [
        "Fugas indetectables que duran meses o incluso años antes de aflorar a la superficie.",
        "Contadores mecánicos obsoletos que subestiman el consumo real de los usuarios.",
        "Dificultad logística de acceso y grave falta de personal técnico cualificado en zonas rurales."
      ],
      solutions: "Sustitución masiva por contadores inteligentes con conectividad NB-IoT y baterías de 10 años. Software basado en IA con alertas automatizadas de fugas invisibles que no requieren intervención humana para su detección inicial."
    }
  };

  // Function to show region info
  function showRegionInfo(regionId, regionName) {
    const data = regionData[regionId] || { ...regionData["default"], name: regionName || regionId };
    
    detailsContent.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
        <div style="width: 15px; height: 15px; border-radius: 50%; background: ${data.color}; margin-right: 1rem; box-shadow: 0 0 10px ${data.color};"></div>
        <h3 style="margin: 0; font-size: 1.8rem;">Comunidad: ${data.name}</h3>
      </div>
      <div class="grid-2" style="gap: 2rem;">
        <div>
          <h4 style="color: var(--primary); margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Problema Principal</h4>
          <p style="color: var(--text-muted);">${data.problem}</p>
          <h4 style="color: var(--warning); margin-bottom: 0.5rem; margin-top: 1.5rem;"><i class="fas fa-water"></i> Impacto</h4>
          <p style="color: var(--text-muted);">${data.impact}</p>
        </div>
        <div>
          <h4 style="color: var(--success); margin-bottom: 0.5rem;"><i class="fas fa-tools"></i> Acciones Volt-Stream</h4>
          <p style="color: var(--text-muted);">${data.actions}</p>
          <div style="margin-top: 1.5rem; padding: 1rem; background: var(--surface-2); border-radius: var(--radius-sm); display: inline-block;">
            <span style="font-weight: 600;">Nivel de Prioridad:</span> 
            <span style="color: ${data.color}; font-weight: bold; margin-left: 0.5rem;">${data.priority}</span>
          </div>
        </div>
      </div>
    `;
    
    detailsPanel.style.display = "block";
    detailsPanel.style.borderColor = data.color;
    // Scroll smoothly to the details panel
    detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Function to show priority card info
  function showPriorityInfo(priorityId) {
    const data = priorityData[priorityId];
    if (!data) return;

    let problemsHtml = data.problems.map(p => `<li style="margin-bottom: 0.5rem;">${p}</li>`).join("");

    detailsContent.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
        <div style="width: 15px; height: 15px; border-radius: 50%; background: ${data.color}; margin-right: 1rem; box-shadow: 0 0 10px ${data.color};"></div>
        <h3 style="margin: 0; font-size: 1.8rem;">${data.title}</h3>
      </div>
      <p style="font-size: 1.1rem; color: var(--text); margin-bottom: 1.5rem; line-height: 1.6;">${data.description}</p>
      
      <div class="grid-2" style="gap: 2rem;">
        <div style="background: var(--surface-2); padding: 1.5rem; border-radius: var(--radius-sm); border-left: 4px solid var(--danger);">
          <h4 style="color: var(--danger); margin-bottom: 1rem;">Problemas Detallados</h4>
          <ul style="color: var(--text-muted); padding-left: 1.2rem; margin: 0;">
            ${problemsHtml}
          </ul>
        </div>
        <div>
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: var(--primary); margin-bottom: 0.5rem;">Ciudades Afectadas</h4>
            <p style="color: var(--text-muted);">${data.cities}</p>
          </div>
          <div>
            <h4 style="color: var(--success); margin-bottom: 0.5rem;">Solución Tecnológica</h4>
            <p style="color: var(--text-muted);">${data.solutions}</p>
          </div>
        </div>
      </div>
    `;

    detailsPanel.style.display = "block";
    detailsPanel.style.borderColor = data.color;
    // Scroll smoothly to the details panel
    detailsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Add click listeners to priority cards
  document.querySelectorAll(".priority-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      showPriorityInfo(id);
      
      // Deselect map region if selected
      if (selectedRegion) {
        g.selectAll("path").filter(p => p.properties.id === selectedRegion)
           .attr("fill", p => {
              if (highPriority.includes(p.properties.id)) return "#E8394A";
              if (mediumPriority.includes(p.properties.id)) return "#E89B02";
              return "#00A8CC";
           })
           .attr("stroke", "#010408")
           .attr("stroke-width", 1.5);
        selectedRegion = null;
      }
    });
  });

  // We add an extra wrapper for clipping
  d3.select("#d3-map-container").style("overflow", "hidden");

  const svg = d3.select("#d3-map-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("filter", "drop-shadow(0 0 20px rgba(0, 168, 204, 0.15))");

  const g = svg.append("g");

  // Define zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 8]) // 1x to 8x zoom
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  // Apply zoom to svg
  svg.call(zoom);

  const projection = d3.geoMercator();
  const path = d3.geoPath().projection(projection);
  
  const highPriority = ["ESAN", "ESMC", "ESVC", "ESCT"];
  const mediumPriority = ["ESAR", "ESIB", "ESMD", "ESCL"];

  let selectedRegion = null; // Track currently selected region

  d3.json("es.json").then(geoData => {
    // Automatically calculate bounding box and scale to fit container width/height perfectly
    projection.fitSize([width, height], geoData);

    g.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => {
        if (highPriority.includes(d.properties.id)) return "#E8394A";
        if (mediumPriority.includes(d.properties.id)) return "#E89B02";
        return "#00A8CC";
      })
      .attr("stroke", "#010408")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .style("transition", "fill 0.3s ease")
      .on("mouseover", function(event, d) {
        if (selectedRegion === d.properties.id) return; // Don't change hover if selected
        
        d3.select(this)
          .attr("fill", "#E8EEF8")
          .attr("stroke", "#00A8CC");
          
        let priorityText = "Zona en expansión";
        if (highPriority.includes(d.properties.id)) priorityText = "Alta prioridad - Estrés Hídrico";
        if (mediumPriority.includes(d.properties.id)) priorityText = "Media prioridad - Sequía";

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`
          <strong style="color:var(--primary); font-size:1.1rem; display:block; margin-bottom:4px;">${d.properties.name}</strong>
          <span style="color:var(--text-muted); font-size:0.85rem">${priorityText}</span>
        `)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 40) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 20) + "px")
               .style("top", (event.pageY - 40) + "px");
      })
      .on("mouseout", function(event, d) {
        if (selectedRegion === d.properties.id) return; // Don't reset if selected
        
        d3.select(this)
          .attr("fill", () => {
            if (highPriority.includes(d.properties.id)) return "#E8394A";
            if (mediumPriority.includes(d.properties.id)) return "#E89B02";
            return "#00A8CC";
          })
          .attr("stroke", "#010408");
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Reset previous selected
        if (selectedRegion && selectedRegion !== d.properties.id) {
          g.selectAll("path").filter(p => p.properties.id === selectedRegion)
           .attr("fill", p => {
              if (highPriority.includes(p.properties.id)) return "#E8394A";
              if (mediumPriority.includes(p.properties.id)) return "#E89B02";
              return "#00A8CC";
           })
           .attr("stroke", "#010408")
           .attr("stroke-width", 1.5);
        }
        
        selectedRegion = d.properties.id;
        
        // Highlight current
        d3.select(this)
          .attr("fill", "#E8EEF8")
          .attr("stroke", "#00E5A0")
          .attr("stroke-width", 2);
          
        showRegionInfo(d.properties.id, d.properties.name);
      });
  }).catch(error => console.error("Error loading es.json: ", error));
});


