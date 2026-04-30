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

  // 3. Intersection Observer for fade-up animations
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

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });

  // 4. Stat Counter Animation
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

  // 5. Typewriter Effect
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

  // 6. Particle Canvas (Hero)
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
// D3 MAP INITIALIZATION FOR COBERTURA.HTML
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("d3-map-container");
  if (!mapContainer || typeof d3 === "undefined") return;

  const width = mapContainer.clientWidth;
  const height = mapContainer.clientHeight;
  const tooltip = d3.select("#map-tooltip");

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
        d3.select(this)
          .attr("fill", () => {
            if (highPriority.includes(d.properties.id)) return "#E8394A";
            if (mediumPriority.includes(d.properties.id)) return "#E89B02";
            return "#00A8CC";
          })
          .attr("stroke", "#010408");
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }).catch(error => console.error("Error loading es.json: ", error));
});


