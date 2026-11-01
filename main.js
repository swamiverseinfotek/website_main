/**
 * SWAMIVERSE INFOTEK · CORE ENGINE & INTERACTION ARCHITECTURE
 * 
 * Systems:
 * 1. Background Interactive Constellation & Stardust Particle Canvas
 * 2. Generative Ambient Harmonic Soundscape (Web Audio API)
 * 3. Interactive Magnetic Celestial Fluid Cursor
 * 4. Executive Quality Telemetry & Animated Counters
 * 5. Live System Telemetry Cybernetic Console Simulator
 * 6. Dynamic Card Cursor Spotlight Glow
 * 7. Services Bento Grid Architecture & Interactive Inspection
 * 8. Interactive Process Step Track & Dynamic Scroll Filling
 * 9. Featured Projects: Dynamic Filters, Topology Blueprints & Tabbed Modals
 * 10. Interactive Project Scope & Architecture Estimator Engine
 * 11. Interactive Executive FAQ Accordion
 * 12. 3D Card Perspective Tilt Physics
 * 13. Scroll Progress & Sticky Blur Header
 * 14. Mobile Navigation Drawer
 * 15. Contact Form Dispatcher & Blueprint Transfer
 */

(function () {
  'use strict';

  // =========================================================================
  // GOOGLE SHEETS & EMAIL DISPATCH ENDPOINT CONFIGURATION
  // Target Email: Swamiverseinfotek@gmail.com
  // Set your Web App URL in config.js (recommended) or main.js
  // See GOOGLE_SHEETS_SETUP_GUIDE.md for 2-minute deployment instructions
  // =========================================================================
  function getGoogleSheetsUrl() {
    return (window.SWAMIVERSE_CONFIG && window.SWAMIVERSE_CONFIG.GOOGLE_SHEETS_SCRIPT_URL) ||
      window.SWAMIVERSE_SHEETS_URL ||
      localStorage.getItem('swamiverse_sheets_url') ||
      "https://script.google.com/macros/s/AKfycbzzcsTu1Lw6CGgTUJ-XdQmX0LqB2OjKbMCxOPD1g6B2mzrXYeWgaT-ZDnyxqYAoK_A8/exec";
  }
  const GOOGLE_SHEETS_SCRIPT_URL = getGoogleSheetsUrl();

  // =========================================================================
  // 1. BACKGROUND PARTICLE CONSTELLATION CANVAS
  // =========================================================================
  const canvas = document.getElementById('bg-constellation-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let isTabActive = true;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140
    };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 1.8 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.colorType = Math.random() > 0.4 ? 'gold' : 'platinum';
        this.alpha = Math.random() * 0.55 + 0.25;
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulseVal = Math.random() * Math.PI;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.pulseVal += this.pulseSpeed;
        this.currentAlpha = this.alpha + Math.sin(this.pulseVal) * 0.2;
        if (this.currentAlpha < 0.1) this.currentAlpha = 0.1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          this.x -= forceDirectionX * force * 1.8;
          this.y -= forceDirectionY * force * 1.8;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.colorType === 'gold') {
          ctx.fillStyle = `rgba(212, 175, 110, ${this.currentAlpha})`;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${this.currentAlpha})`;
        }
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const densityDivider = window.innerWidth < 768 ? 16000 : 10000;
      const count = Math.floor((width * height) / densityDivider);
      const safeCount = Math.min(Math.max(count, 35), 110);

      for (let i = 0; i < safeCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = window.innerWidth < 768 ? 95 : 125;
      const pLen = particles.length;

      for (let a = 0; a < pLen; a++) {
        for (let b = a + 1; b < pLen; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(212, 175, 110, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        const mdx = particles[a].x - mouse.x;
        const mdy = particles[a].y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          const mAlpha = (1 - mDist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(240, 220, 179, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function animate() {
      if (!isTabActive) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabActive = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isTabActive = true;
        animate();
      }
    });

    resizeCanvas();
    animate();
  }

  // =========================================================================
  // 1B. 3D INTERACTIVE FLOATING METALLIC LOGO BACKGROUND (THREE.JS)
  // =========================================================================
  const logo3dCanvas = document.getElementById('bg-logo-3d-canvas');
  if (logo3dCanvas && typeof THREE !== 'undefined') {
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas: logo3dCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 7;

      // Calm, Elegant Deep-Space Ambient Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      scene.add(ambientLight);

      const subtleVioletLight = new THREE.DirectionalLight(0xD4AF6E, 1.8);
      subtleVioletLight.position.set(3, 4, 3);
      scene.add(subtleVioletLight);

      const subtleGoldLight = new THREE.DirectionalLight(0xC8D4E3, 1.5);
      subtleGoldLight.position.set(-3, -2, 3);
      scene.add(subtleGoldLight);

      // Root Anchor Group - Deep in background space
      const logoGroup = new THREE.Group();
      logoGroup.position.set(0, 0.4, -2.5); // Placed further back in z-depth to never interfere with text
      scene.add(logoGroup);

      // Subtle, Slow-Rotating Constellation Beacon Rings (Clean & Minimalist)
      const ringGeo1 = new THREE.RingGeometry(2.35, 2.37, 80);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0xD4AF6E, transparent: true, opacity: 0.22,
        side: THREE.DoubleSide
      });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      logoGroup.add(ring1);

      const ringGeo2 = new THREE.RingGeometry(2.9, 2.915, 80);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0xC8D4E3, transparent: true, opacity: 0.15,
        side: THREE.DoubleSide
      });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      logoGroup.add(ring2);

      // Load Transparent Metallic Logo Texture - Elegant, Smooth & Ambient
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('logo.png', (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearFilter;

        // Clean, High-Contrast Translucent Emblem
        const logoGeo = new THREE.PlaneGeometry(3.8, 2.1);
        const logoMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          opacity: 0.22, // Soft, non-distracting watermark intensity
          roughness: 0.4,
          metalness: 0.6,
          side: THREE.DoubleSide,
          alphaTest: 0.02
        });

        const logoMesh = new THREE.Mesh(logoGeo, logoMat);
        logoGroup.add(logoMesh);
      }, undefined, (err) => {
        console.warn('Error loading logo texture:', err);
      });

      // Smooth Mouse Parallax (Gentle easing)
      let mouseX = 0;
      let mouseY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      // Scroll Fade (Fades softly as user navigates down)
      function updatePositionOnScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const fadeThreshold = window.innerHeight * 0.75;
        const opacity = Math.max(0, 0.65 - (scrollY / fadeThreshold) * 0.65);
        logo3dCanvas.style.opacity = opacity;
      }
      window.addEventListener('scroll', updatePositionOnScroll, { passive: true });

      function onResize3D() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener('resize', onResize3D);

      // Animation Loop: Very slow, peaceful celestial breathing
      let clock = new THREE.Clock();
      let animId3d = null;

      function animate3D() {
        animId3d = requestAnimationFrame(animate3D);

        const t = clock.getElapsedTime();

        // Slow, harmonic breathing motion (1 cycle every 7 seconds)
        const breathe = Math.sin(t * 0.9) * 0.05;
        logoGroup.scale.set(1 + breathe, 1 + breathe, 1);

        // Smooth subtle tilt with mouse (extremely gentle, max 0.08 rad)
        const targetRotY = mouseX * 0.12;
        const targetRotX = -mouseY * 0.08;

        logoGroup.rotation.y += (targetRotY - logoGroup.rotation.y) * 0.025;
        logoGroup.rotation.x += (targetRotX - logoGroup.rotation.x) * 0.025;

        // Slow counter-rotation of subtle rings
        ring1.rotation.z = t * 0.05;
        ring2.rotation.z = -t * 0.035;

        renderer.render(scene, camera);
      }

      animate3D();
    } catch (err) {
      console.warn('Three.js 3D logo background initialization notice:', err);
    }
  }





  // =========================================================================
  // 3. INTERACTIVE MAGNETIC CELESTIAL FLUID CURSOR
  // =========================================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mousePos = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;

      cursorDot.style.left = `${mousePos.x}px`;
      cursorDot.style.top = `${mousePos.y}px`;
    });

    function renderCursor() {
      // Smooth lerp following
      ringPos.x += (mousePos.x - ringPos.x) * 0.18;
      ringPos.y += (mousePos.y - ringPos.y) * 0.18;

      cursorRing.style.left = `${ringPos.x}px`;
      cursorRing.style.top = `${ringPos.y}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover triggers on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, .bento-card, .project-card, .estimator-chip, .work-filter-btn, .faq-question-btn'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
  }


  // =========================================================================
  // 4. EXECUTIVE QUALITY TELEMETRY & ANIMATED COUNTERS
  // =========================================================================
  const telemetryValues = document.querySelectorAll('.telemetry-val[data-target]');
  if (telemetryValues.length > 0) {
    let hasAnimatedCounters = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedCounters) {
          hasAnimatedCounters = true;

          telemetryValues.forEach(el => {
            const rawTarget = el.getAttribute('data-target');
            const isFloat = rawTarget.includes('.');
            const target = parseFloat(rawTarget);
            const duration = 1800;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = target * easeOut;

              if (isFloat) {
                el.textContent = currentVal.toFixed(2);
              } else {
                el.textContent = Math.floor(currentVal);
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = rawTarget;
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.25 });

    const telemetryGrid = document.querySelector('.hero-telemetry-grid');
    if (telemetryGrid) {
      counterObserver.observe(telemetryGrid);
    }
  }


  // Mini Sparklines inside KPI Cards (slow and soothing speed)
    const sparkCanvases = document.querySelectorAll('.kpi-sparkline-canvas');
    const sparklineColors = ['#10B981', '#06B6D4', '#D4AF6E', '#E2E8F0'];
    let sparkPhase = 0;

    function renderSparklines() {
      sparkPhase += 0.012; // Slow, calm sparkline motion
      sparkCanvases.forEach((c, idx) => {
        const ctx = c.getContext('2d');
        const parent = c.parentElement;
        const w = parent ? parent.clientWidth : 200;
        const h = parent ? parent.clientHeight : 32;
        if (c.width !== w) c.width = w;
        if (c.height !== h) c.height = h;

        ctx.clearRect(0, 0, w, h);
        const col = sparklineColors[idx] || '#10B981';

        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = col;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        const pts = 24;
        const step = w / (pts - 1);
        for (let i = 0; i < pts; i++) {
          const p = sparkPhase + i * 0.35 + idx;
          let y = h / 2;
          if (idx === 0) y += Math.sin(p * 0.8) * 4;
          else if (idx === 1) y += Math.sin(p * 2) * 8 * Math.cos(p * 0.5);
          else if (idx === 2) y += (Math.sin(p * 1.2) + Math.cos(p * 0.7)) * 5;
          else y += (Math.sin(p * 1.5) > 0 ? 5 : -5) * 0.8;
          if (i === 0) ctx.moveTo(0, y);
          else ctx.lineTo(i * step, y);
        }
        ctx.stroke();
      });
      requestAnimationFrame(renderSparklines);
    }
    if (sparkCanvases.length > 0) {
      requestAnimationFrame(renderSparklines);
    }

      // =========================================================================
  // 6. DYNAMIC CARD SPOTLIGHT GLOW
  // =========================================================================
  const spotlightCards = document.querySelectorAll(
    '.has-spotlight, .bento-card, .project-card, .telemetry-card, .process-step-card, .pillar-card, .estimator-blueprint-card, .estimator-config-card, .faq-item, .telemetry-console-wrapper'
  );

  spotlightCards.forEach(card => {
    card.classList.add('has-spotlight');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // =========================================================================
  // 7. INTERACTIVE PROCESS STEP TRACK & FULL BIDIRECTIONAL SYNC ENGINE
  // =========================================================================
  const processSection = document.getElementById('process');
  const trackFill = document.getElementById('process-progress-fill');
  const trackNodes = document.querySelectorAll('.track-node[data-step]');
  const processCards = document.querySelectorAll('.process-step-card');

  if (processSection && trackNodes.length > 0 && processCards.length > 0) {
    let currentStep = 1;
    let userLocked = false;
    let lockTimer = null;

    // Line fill percentages connecting node 1 (0%) through to node 4 (100%)
    const fillPercentages = {
      1: 0,
      2: 33.33,
      3: 66.66,
      4: 100
    };

    function syncProcessStep(targetStep) {
      if (targetStep < 1) targetStep = 1;
      if (targetStep > 4) targetStep = 4;
      currentStep = targetStep;

      // A. Smoothly animate the connecting gold timeline
      if (trackFill) {
        trackFill.style.width = `${fillPercentages[targetStep]}%`;
      }

      // B. Update Timeline Nodes (1 through targetStep are done/lit up)
      trackNodes.forEach(node => {
        const stepNum = parseInt(node.getAttribute('data-step'), 10);
        if (stepNum < targetStep) {
          // Completed steps
          node.classList.add('active');
          node.classList.add('completed');
          node.classList.remove('current-step');
        } else if (stepNum === targetStep) {
          // Active current step
          node.classList.add('active');
          node.classList.remove('completed');
          node.classList.add('current-step');
        } else {
          // Future pending steps
          node.classList.remove('active');
          node.classList.remove('completed');
          node.classList.remove('current-step');
        }
      });

      // C. Update Process Cards
      processCards.forEach(card => {
        const cardStep = parseInt(card.getAttribute('data-step-index'), 10);
        const statusTag = card.querySelector('.step-status-tag');

        if (cardStep < targetStep) {
          // Prior completed cards
          card.classList.remove('active');
          card.classList.remove('active-step');
          card.classList.add('step-completed');
          if (statusTag) {
            statusTag.textContent = 'DONE ✓';
            statusTag.className = 'step-status-tag tag-done';
          }
        } else if (cardStep === targetStep) {
          // Active selected card
          card.classList.add('active');
          card.classList.add('active-step');
          card.classList.remove('step-completed');
          if (statusTag) {
            statusTag.textContent = 'ACTIVE';
            statusTag.className = 'step-status-tag tag-active';
          }
        } else {
          // Future pending cards
          card.classList.remove('active');
          card.classList.remove('active-step');
          card.classList.remove('step-completed');
          if (statusTag) {
            statusTag.textContent = 'PENDING';
            statusTag.className = 'step-status-tag tag-pending';
          }
        }
      });
    }

    // Interactive Click Handler (Prioritizes user click)
    function onUserClickStep(stepNum) {
      userLocked = true;
      syncProcessStep(stepNum);

      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        userLocked = false;
      }, 3500); // 3.5s lock so scrolling does not override user action
    }

    // Attach Click & Keyboard Event to Cards
    processCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const step = parseInt(card.getAttribute('data-step-index'), 10);
        onUserClickStep(step);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const step = parseInt(card.getAttribute('data-step-index'), 10);
          onUserClickStep(step);
        }
      });
    });

    // Attach Click Event to Timeline Nodes
    trackNodes.forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const step = parseInt(node.getAttribute('data-step'), 10);
        onUserClickStep(step);
      });
    });

    // Natural Scroll Observer (Runs only when user hasn't manually clicked)
    function handleScrollSync() {
      if (userLocked) return;
      const rect = processSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top <= viewportHeight * 0.55 && rect.bottom >= viewportHeight * 0.25) {
        const scrolled = (viewportHeight * 0.55 - rect.top) / (rect.height * 0.55);
        const progress = Math.min(Math.max(scrolled, 0), 1);
        const autoStep = Math.min(Math.floor(progress * 4) + 1, 4);
        syncProcessStep(autoStep);
      }
    }

    window.addEventListener('scroll', handleScrollSync, { passive: true });

    // Initialize Step 1
    syncProcessStep(1);
  }

  // =========================================================================
  // 8. SCROLL PROGRESS INDICATOR & HEADER SCROLL BLUR
  // =========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const siteHeader = document.getElementById('header');

  function onScrollHandler() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && docHeight > 0) {
      const scrollPercent = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
      progressBar.style.width = scrollPercent + '%';
    }

    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', onScrollHandler, { passive: true });
  onScrollHandler();


  // =========================================================================
  // 9. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    function toggleMobileMenu(forceClose = false) {
      const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.add('open');
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      } else {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });
  }


  // =========================================================================
  // 10. FEATURED PROJECTS: CATEGORY FILTERING
  // =========================================================================
  const filterButtons = document.querySelectorAll('.work-filter-btn[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // =========================================================================
  // 11. INTERACTIVE MODALS & TOPOLOGY BLUEPRINT RENDERER
  // =========================================================================

  const serviceData = {
    web: {
      badge: 'SERVICE CAPABILITY',
      title: 'Web Platforms & Modern Cloud UI',
      desc: 'Scalable, high-performance web applications and enterprise portals engineered for instant loading, robust state management, and high conversion.',
      stack: ['TypeScript', 'Next.js 14', 'React', 'Node.js', 'GraphQL', 'Tailwind / Vanilla CSS', 'PostgreSQL', 'Redis'],
      deliverables: [
        'Complete end-to-end full-stack web application development',
        'Sub-second page loading speeds and 99/100 Core Web Vitals compliance',
        'Modular design systems and high-resilience component architecture',
        'Secure RESTful and GraphQL API design with role-based access',
        'Automated CI/CD pipelines and high-availability cloud deployment'
      ]
    },
    mobile: {
      badge: 'SERVICE CAPABILITY',
      title: 'Mobile App Engineering',
      desc: 'Native and cross-platform iOS and Android applications with robust offline caching, biometric security, and instantaneous push notifications.',
      stack: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Firebase', 'SQLite / Room', 'WebSockets', 'Push Notifications'],
      deliverables: [
        'Unified cross-platform and native iOS/Android codebases',
        'Offline-first data architecture with seamless background sync',
        'Hardware sensor integration (Bluetooth LE, GPS, Camera, Biometrics)',
        'App Store and Google Play Store compliance, submission, and release'
      ]
    },
    ai: {
      badge: 'FLAGSHIP CAPABILITY',
      title: 'AI & Machine Learning Systems',
      desc: 'Enterprise predictive models, autonomous LLM agent pipelines, real-time computer vision, and neural anomaly detectors engineered for mission-critical reliability.',
      stack: ['Python', 'PyTorch', 'TensorRT', 'Hugging Face', 'LangChain', 'FastAPI', 'Milvus / pgvector', 'Docker'],
      deliverables: [
        'Custom domain-specific predictive models and inference pipelines',
        'Automated classification, anomaly detection, and forecasting engines',
        'Generative AI integrations and Retrieval-Augmented Generation (RAG)',
        'Containerized model deployment with sub-50ms inference serving'
      ]
    },
    cloud: {
      badge: 'SERVICE CAPABILITY',
      title: 'Cloud Infrastructure & DevOps',
      desc: 'Automated deployment orchestration, Kubernetes cluster management, Infrastructure-as-Code, and distributed telemetry observability for maximum resilience.',
      stack: ['AWS', 'Google Cloud (GCP)', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana'],
      deliverables: [
        'Infrastructure-as-Code (IaC) setup and multi-region architecture',
        'Zero-downtime CI/CD deployment pipelines with automated rollbacks',
        'Container orchestration and auto-scaling Kubernetes clusters',
        'Full-observability telemetry, log aggregation, and 24/7 uptime monitoring'
      ]
    },
    embedded: {
      badge: 'FLAGSHIP CAPABILITY',
      title: 'Embedded Systems & Hardware',
      desc: 'Custom PCB layouts, deterministic firmware, sensor fusion pipelines, and TinyML intelligence deployed on edge microcontrollers for harsh industrial operating environments.',
      stack: ['Embedded C/C++', 'Rust', 'FreeRTOS', 'ESP32 / STM32', 'ARM Cortex', 'UART / SPI / I2C', 'CAN Bus', 'BLE'],
      deliverables: [
        'Low-power deterministic firmware engineering and RTOS scheduling',
        'Schematic design, PCB layout assistance, and hardware prototype testing',
        'Edge signal processing and industrial sensor bus integration',
        'Over-the-air (OTA) secure firmware updates and device provisioning'
      ]
    },
    robotics: {
      badge: 'SERVICE CAPABILITY',
      title: 'Robotics, IoT & Emerging Tech',
      desc: 'Industrial automation algorithms, ROS 2 integration, connected sensory fleets, and cutting-edge physical-digital interfaces that turn ambitious engineering ideas into reality.',
      stack: ['ROS 2', 'MicroPython', 'MQTT Broker', 'WebRTC', 'OpenCV', 'Edge AI Silicons', 'Zigbee', 'LoRaWAN'],
      deliverables: [
        'Robotic operating system (ROS 2) navigation and actuator control nodes',
        'Large-scale IoT telemetry ingestion and edge gateway configuration',
        'Real-time computer vision inference for defect and presence detection',
        'Secure hardware-to-cloud device management and telemetry streams'
      ]
    }
  };

  function getTopologySvg(projectId) {
    if (projectId === 'abhedya') {
      return `
        <svg viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect x="10" y="45" width="95" height="40" rx="6" fill="#141628" stroke="#10B981" stroke-width="1.5"/>
          <text x="57" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">1. Monitor</text>
          <text x="57" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Vehicle &amp; Cargo</text>

          <line x1="105" y1="65" x2="135" y2="65" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3"/>

          <rect x="135" y="45" width="95" height="40" rx="6" fill="#141628" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="182" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">2. Collect</text>
          <text x="182" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Physical Signals</text>

          <line x1="230" y1="65" x2="260" y2="65" stroke="#3B82F6" stroke-width="2"/>

          <rect x="260" y="45" width="95" height="40" rx="6" fill="#141628" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="307" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">3. Process</text>
          <text x="307" y="77" fill="#F59E0B" font-size="8.5" font-family="monospace" text-anchor="middle">Event Evaluation</text>

          <line x1="355" y1="65" x2="385" y2="65" stroke="#F59E0B" stroke-width="2"/>

          <rect x="385" y="45" width="145" height="40" rx="6" fill="#141628" stroke="#D4AF6E" stroke-width="1.5"/>
          <text x="457" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">4. Record &amp; Notify</text>
          <text x="457" y="77" fill="#D4AF6E" font-size="8.5" font-family="monospace" text-anchor="middle">Digital Event Ledger</text>
        </svg>
      `;
    } else if (projectId === 'campusprep') {
      return `
        <svg viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect x="10" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="62" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Candidate Voice</text>
          <text x="62" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">STT Web Speech API</text>

          <line x1="115" y1="65" x2="155" y2="65" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="3 3"/>

          <rect x="155" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#A78BFA" stroke-width="1.5"/>
          <text x="207" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">MCP Harness</text>
          <text x="207" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Difficulty Router</text>

          <line x1="260" y1="65" x2="300" y2="65" stroke="#A78BFA" stroke-width="2"/>

          <rect x="300" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="352" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Gemini LLM</text>
          <text x="352" y="77" fill="#F59E0B" font-size="8.5" font-family="monospace" text-anchor="middle">Adaptive Feedback</text>

          <line x1="405" y1="65" x2="445" y2="65" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3"/>

          <rect x="445" y="45" width="85" height="40" rx="6" fill="#141628" stroke="#10B981" stroke-width="1.5"/>
          <text x="487" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Alumni &amp; PDF</text>
          <text x="487" y="77" fill="#10B981" font-size="8.5" font-family="monospace" text-anchor="middle">Verified Scorecard</text>
        </svg>
      `;
    } else if (projectId === 'analytics') {
      return `
        <svg viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect x="10" y="45" width="100" height="40" rx="6" fill="#141628" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="60" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Edge Sensors</text>
          <text x="60" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Telemetry Fleet</text>

          <line x1="110" y1="65" x2="150" y2="65" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="3 3"/>

          <rect x="150" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#A78BFA" stroke-width="1.5"/>
          <text x="202" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Kafka Stream</text>
          <text x="202" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">50k msgs/sec</text>

          <line x1="255" y1="65" x2="295" y2="65" stroke="#A78BFA" stroke-width="2"/>

          <rect x="295" y="45" width="110" height="40" rx="6" fill="#141628" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="350" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">PyTorch Infer</text>
          <text x="350" y="77" fill="#F59E0B" font-size="8.5" font-family="monospace" text-anchor="middle">&lt;30ms Detection</text>

          <line x1="405" y1="65" x2="445" y2="65" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3"/>

          <rect x="445" y="45" width="85" height="40" rx="6" fill="#141628" stroke="#10B981" stroke-width="1.5"/>
          <text x="487" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Live UI</text>
          <text x="487" y="77" fill="#10B981" font-size="8.5" font-family="monospace" text-anchor="middle">WebSocket</text>
        </svg>
      `;
    } else if (projectId === 'services-app') {
      return `
        <svg viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect x="10" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="62" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Client Mobile</text>
          <text x="62" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Flutter / iOS / Android</text>

          <line x1="115" y1="65" x2="155" y2="65" stroke="#3B82F6" stroke-width="2"/>

          <rect x="155" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="207" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Sync Engine</text>
          <text x="207" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Offline SQLite / Room</text>

          <line x1="260" y1="65" x2="300" y2="65" stroke="#8B5CF6" stroke-width="2"/>

          <rect x="300" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="352" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Redis Geo</text>
          <text x="352" y="77" fill="#F59E0B" font-size="8.5" font-family="monospace" text-anchor="middle">Sub-100ms Dispatch</text>

          <line x1="405" y1="65" x2="445" y2="65" stroke="#F59E0B" stroke-width="2"/>

          <rect x="445" y="45" width="85" height="40" rx="6" fill="#141628" stroke="#10B981" stroke-width="1.5"/>
          <text x="487" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Postgres</text>
          <text x="487" y="77" fill="#10B981" font-size="8.5" font-family="monospace" text-anchor="middle">99.98% SLA</text>
        </svg>
      `;
    } else if (projectId === 'monitoring') {
      return `
        <svg viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect x="10" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="62" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">STM32 MCU</text>
          <text x="62" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Vibration Sensing</text>

          <line x1="115" y1="65" x2="155" y2="65" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3"/>

          <rect x="155" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="207" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">LoRa Gateway</text>
          <text x="207" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Long-Range Mesh</text>

          <line x1="260" y1="65" x2="300" y2="65" stroke="#8B5CF6" stroke-width="2"/>

          <rect x="300" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#A78BFA" stroke-width="1.5"/>
          <text x="352" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">IoT Core</text>
          <text x="352" y="77" fill="#A78BFA" font-size="8.5" font-family="monospace" text-anchor="middle">MQTT TLS Broker</text>

          <line x1="405" y1="65" x2="445" y2="65" stroke="#A78BFA" stroke-width="2"/>

          <rect x="445" y="45" width="85" height="40" rx="6" fill="#141628" stroke="#10B981" stroke-width="1.5"/>
          <text x="487" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Alert Bot</text>
          <text x="487" y="77" fill="#10B981" font-size="8.5" font-family="monospace" text-anchor="middle">Auto-Trigger</text>
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto;">
          <rect x="10" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#8B5CF6" stroke-width="1.5"/>
          <text x="62" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Next.js 14</text>
          <text x="62" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">Enterprise Web UI</text>

          <line x1="115" y1="65" x2="155" y2="65" stroke="#8B5CF6" stroke-width="2"/>

          <rect x="155" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#3B82F6" stroke-width="1.5"/>
          <text x="207" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">OAuth / SSO</text>
          <text x="207" y="77" fill="#94A3B8" font-size="8.5" font-family="monospace" text-anchor="middle">RBAC Access</text>

          <line x1="260" y1="65" x2="300" y2="65" stroke="#3B82F6" stroke-width="2"/>

          <rect x="300" y="45" width="105" height="40" rx="6" fill="#141628" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="352" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Workflow Node</text>
          <text x="352" y="77" fill="#F59E0B" font-size="8.5" font-family="monospace" text-anchor="middle">4-Hour SLA</text>

          <line x1="405" y1="65" x2="445" y2="65" stroke="#F59E0B" stroke-width="2"/>

          <rect x="445" y="45" width="85" height="40" rx="6" fill="#141628" stroke="#10B981" stroke-width="1.5"/>
          <text x="487" y="65" fill="#FFFFFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="600">Audit Log</text>
          <text x="487" y="77" fill="#10B981" font-size="8.5" font-family="monospace" text-anchor="middle">Compliance</text>
        </svg>
      `;
    }
  }

  const projectData = {
    campusprep: {
      category: 'AI & Analytics · Flagship Platform',
      title: 'CampusPrep — AI Voice Flight Simulator for Campus Placements',
      desc: 'CampusPrep is an intelligent, voice-driven mock interview simulation and career readiness platform. Engineered as a high-fidelity "flight simulator for job interviews," candidates practice real, spoken interview rounds with an adaptive AI agent that listens, reasons, adapts its difficulty to their resume in real time, and produces tamper-proof, alumni-validated scorecards before candidates ever face corporate recruiters.',
      challenge: 'Traditional campus placement preparation suffers from three major failures: severe interviewer scarcity (a university cohort of 5,000+ students cannot obtain individual practice from limited senior faculty), subjective human bias, and unrealistic written quiz forms that fail to simulate the high-pressure spoken cadence of live technical rounds. Replicating an authentic interview required sub-150ms speech pipeline latency, natural interruption handling (stopping the AI speech the instant a candidate speaks), dynamic resume-adaptive questioning, and cryptographically sound result certification.',
      tech: ['Python / FastAPI', 'Google Gemini 1.5 Pro', 'MCP Agent Decision Harness', 'Web Speech API (STT & TTS)', 'React 18 (Vite)', 'Firebase Auth & Cloud Storage', 'Tailwind CSS', 'Vercel Edge Runtime'],
      outcome: 'Successfully eliminated human interviewer bandwidth bottlenecks across student batches. Achieved 100% voice-driven mock interview automation with zero mid-interview form fatigue, sub-150ms speech interruption cancellation, resume-tailored difficulty routing, and verifiable tamper-proof PDF certification synced in real-time across Student, Alumni, and Admin dashboards.',
      liveUrl: 'https://campus-prep.vercel.app/',
      githubUrl: 'https://github.com/vivekpatil111/ORION_CAMPUS-PREP',
      features: [
        {
          icon: '🎙️',
          title: 'Conversational Voice AI Flight Simulator',
          desc: 'Low-latency bidirectional speech pipeline built on the Web Speech API (STT & TTS). Delivers authentic spoken dialogue with active interruption cancellation (AI stops immediately when candidate talks) and low-confidence reprompting.'
        },
        {
          icon: '🧠',
          title: 'MCP Agent Decision Harness',
          desc: 'Model Control & Processing (MCP) agent harness analyzes uploaded resumes in real-time to route candidates dynamically — qualified candidates receive deep technical grilling, while beginners receive foundational assessments.'
        },
        {
          icon: '👥',
          title: 'Tri-Role Real-Time Synced Dashboards',
          desc: 'Synchronized ecosystem connecting Candidates (session telemetry, history), Alumni Validators (industry rubric validation, request queues), and Admins (system fairness, verification oversight).'
        },
        {
          icon: '🛡️',
          title: 'Tamper-Proof Immutable Certification',
          desc: 'Interviews generate cryptographically secure, downloadable result PDF reports stored immutably on Google Cloud / Firebase to prevent post-hoc grade altering for campus training & placement cells.'
        },
        {
          icon: '⚡',
          title: 'Zero Mid-Interview Form Fatigue',
          desc: 'No typing answers or filling forms mid-session. Candidates simply speak into their microphone and listen, mimicking genuine corporate recruiter video and phone screens.'
        },
        {
          icon: '🏢',
          title: 'Campus & T&P Cell Scalability',
          desc: 'Architected to handle university placement cohorts of thousands simultaneously without scheduling conflicts, interviewer exhaustion, or subjective scoring discrepancies.'
        }
      ],
      workflow: [
        {
          title: 'Resume Upload & Semantic Parsing',
          desc: 'Student uploads their resume PDF; skills, experience tiers, and project technologies are extracted and evaluated.'
        },
        {
          title: 'MCP Agent Difficulty & Track Routing',
          desc: 'The MCP agent harness decides the appropriate question track and difficulty calibration suited for the candidate profile.'
        },
        {
          title: 'Live Spoken Voice Interview Round',
          desc: 'AI speaks questions via TTS; candidate speaks back via STT. Gemini LLM actively reasons on responses and adapts follow-up technical depth.'
        },
        {
          title: 'Real-Time Interruption & Confidence Guardrails',
          desc: 'Built-in audio guardrails cancel AI speech the instant candidate starts talking, or politely asks to repeat upon audio silence or low confidence.'
        },
        {
          title: 'Multi-Rubric AI Evaluation & Scoring',
          desc: 'Instant scoring across conceptual depth, problem-solving structure, communication clarity, and resume alignment.'
        },
        {
          title: 'Alumni Validation & Immutable PDF Scorecard',
          desc: 'Alumni review and validate results; a tamper-proof PDF certificate is generated and synced to Student, Alumni, and Admin dashboards.'
        }
      ],
      stackCategories: [
        {
          category: 'Frontend & Audio Pipeline',
          items: 'React 18 (Vite), Tailwind CSS, Web Speech API (Speech-to-Text & Text-to-Speech), WebSockets, Responsive Glassmorphism UI'
        },
        {
          category: 'Backend & Orchestration',
          items: 'Python 3.12, FastAPI asynchronous microservices, REST APIs, Firebase Admin SDK, ReportLab PDF Engine'
        },
        {
          category: 'Intelligence & Agent Harness',
          items: 'Google Gemini 1.5 Pro, MCP (Model Control & Processing) Decision Harness, Prompt Guardrails, Dynamic Context Injection'
        },
        {
          category: 'Cloud Infrastructure & Security',
          items: 'Google Cloud Platform (Firebase Auth & Immutable Cloud Storage), Vercel Serverless Edge Runtime, Zero Credential Leakage Architecture'
        }
      ],
      metrics: [
        { val: '0', label: 'Mid-Interview Typing (100% Spoken Voice)' },
        { val: '<150ms', label: 'Interruption Speech Cancellation' },
        { val: '5,000+', label: 'Concurrent Student Placement Scale' },
        { val: '100%', label: 'Verifiable Tamper-Proof Reports' }
      ]
    },
    analytics: {
      category: 'AI & Analytics',
      title: 'Intelligent Analytics Platform',
      desc: 'Turning complex continuous enterprise telemetry into actionable operational insights through intelligent real-time analysis, automated anomaly detection, and intuitive visual representations.',
      challenge: 'Handling massive continuous telemetry streams across distributed edge nodes while maintaining sub-second query latency and zero UI freezing during live spikes.',
      tech: ['Python / FastAPI', 'PyTorch Anomaly Engine', 'Apache Kafka', 'PostgreSQL Timescale', 'React Visual Matrix', 'Docker'],
      outcome: 'Empowered distributed operations teams to make high-confidence decisions with zero latency bottlenecks and automated alert classification, reducing critical response times by 68%.'
    },
    'myclaim-mobile': {
      category: 'FinTech Mobile · Cross-Platform Flutter Suite',
      title: 'MyClaim Mobile — Cross-Platform Financial Recovery & Channel Partner Suite',
      desc: 'An enterprise-grade Flutter mobile application engineered for claimants and financial advisors that digitizes IEPF share/dividend recovery, Pre-IPO allocations, and channel partner networks — secured by device-native biometrics, interactive legal heirship mapping, in-app dividend discovery, and sleep-resilient API pipelines.',
      challenge: 'Recovering ancestral shares, uncollected dividends, or contested policy payouts involves physical documentation and succession verification. Standard mobile apps fail due to lost physical paperwork, lack of multi-generational lineage tools, disconnected field agent networks, and server cold-start timeouts in low-connectivity zones.',
      tech: ['Flutter 3.x', 'Dart ^3.9.2', 'Provider / ChangeNotifier', 'local_auth Biometrics', 'file_picker & image_picker', 'Fast REST HTTP Interceptor', 'flutter_screenutil', 'flutter_animate', 'flutter_local_notifications'],
      outcome: 'Sub-500ms biometric unlock (Face ID / Fingerprint), instant dual-shell dynamic routing for Clients vs Partners, 100% interactive visual heirship graph builder, and 4-second sleep-resilient gateway with seamless offline fallback.',
      liveUrl: 'myclaim-mobile.html',
      features: [
        {
          icon: '🔒',
          title: 'Device-Native Biometric Security Vault',
          desc: 'Integrates hardware-level biometrics (local_auth) supporting Face ID, Fingerprint, and OS Passcode fallback with delayed auto-triggering for OEM screen transitions and kinetic shake feedback.'
        },
        {
          icon: '🌳',
          title: 'Interactive Heirship & Family Tree Engine',
          desc: 'Custom mobile genealogical tree manager backed by FamilyTreeProvider, allowing claimants to visually map spouses, siblings, and heirs to generate structured IEPF succession data.'
        },
        {
          icon: '👥',
          title: 'Role-Adaptive Dynamic Shell Routing',
          desc: 'Uses indexed stack state shells (ClientShell and PartnerShell) to hot-swap navigation hierarchies seamlessly between investor claims and channel partner lead CRM.'
        },
        {
          icon: '⚡',
          title: 'Sleep-Resilient & Offline-Tolerant API Client',
          desc: 'Strict 4-second network timeout threshold with graceful fallback to cached offline state and mock datasets, ensuring zero UI freezing during cloud server spin-ups.'
        },
        {
          icon: '📑',
          title: 'Integrated Mobile Document Vault & Picker',
          desc: 'Native file_picker and image_picker bridges allowing users to capture physical share certificates and indemnity bonds via camera or PDF import into a multipart upload pipeline.'
        },
        {
          icon: '🔔',
          title: 'Native Event & Notification Engine',
          desc: 'Powered by flutter_local_notifications for real-time system-tray alerts whenever case stages advance, documents require re-upload, or partner tickets resolve.'
        }
      ],
      workflow: [
        {
          title: '1. App Initialization & Animated Splash Boot',
          desc: 'ScreenUtilInit and NotificationService initialize while SplashScreen executes multi-controller particle, pulse, and ripple animations.'
        },
        {
          title: '2. Hardware Biometric Authentication & Session Recovery',
          desc: 'BiometricLockScreen engages native sensors and validates stored credentials from SharedPreferences.'
        },
        {
          title: '3. Role-Based Dynamic Shell Routing',
          desc: 'AuthProvider routes clients to ClientShell (claims, vault, services) and channel partners to PartnerShell (leads, client directories, commissions).'
        },
        {
          title: '4. Interactive Genealogical Heirship Tree Construction',
          desc: 'Claimants visually add family tree nodes on touch canvas to assemble valid succession claims.'
        },
        {
          title: '5. Multi-Source Document Capture & Vault Sync',
          desc: 'Users capture share certificates via camera or filesystem, validated and streamed to secure endpoints with local status tracking.'
        },
        {
          title: '6. Background Push Alerts & Real-Time Case Progression',
          desc: 'NotificationService fires local notification channels with status badges prompting users directly into updated case views.'
        }
      ],
      stackCategories: [
        {
          category: 'Mobile Core & State Architecture',
          items: 'Flutter 3.x, Dart SDK ^3.9.2, provider: ^6.1.5, ChangeNotifier, flutter_screenutil: ^5.9.3, google_fonts'
        },
        {
          category: 'Hardware, Biometrics & Security',
          items: 'local_auth: ^3.0.1, shared_preferences: ^2.5.5, Face ID, Fingerprint, OS PIN fallback'
        },
        {
          category: 'Media, Documents & Networking',
          items: 'file_picker: ^11.0.3, image_picker: ^1.1.2, http: ^1.6.0 with 4s Sleep-Resilient Gateway & Offline Cache'
        },
        {
          category: 'Motion, Animations & Notifications',
          items: 'flutter_animate: ^4.5.2, flutter_local_notifications: ^20.1.0, 60 FPS physics animations'
        }
      ],
      metrics: [
        { val: '<500ms', label: 'Biometric Unlock (Face ID / Fingerprint)' },
        { val: 'Dual-Shell', label: 'Runtime UI Switching (Client vs Partner)' },
        { val: '100%', label: 'Visual Heirship Graph Builder' },
        { val: '4s', label: 'Sleep-Resilient Gateway Timeout' }
      ]
    },
    'services-app': {
      category: 'FinTech Mobile Application',
      title: 'MyClaim Mobile — Cross-Platform Financial Recovery & Channel Partner Suite',
      desc: 'An enterprise-grade Flutter mobile application engineered for claimants and financial advisors that digitizes IEPF share/dividend recovery, Pre-IPO allocations, and channel partner networks.',
      challenge: 'Resolving manual paperwork bottlenecks, lack of family heirship mapping tools, and offline network disconnects in field partner environments.',
      tech: ['Flutter 3.x', 'Dart SDK', 'Provider', 'local_auth', 'REST API', 'Local Notifications'],
      outcome: 'Sub-500ms hardware biometrics, dual-shell client/partner navigation, 100% interactive legal heirship trees, and sleep-resilient network timeout resilience.',
      liveUrl: 'myclaim-mobile.html'
    },
    monitoring: {
      category: 'IoT & Hardware',
      title: 'Smart Monitoring System',
      desc: 'A connected hardware monitoring solution engineered to collect precision environmental and equipment telemetry in harsh industrial settings with multi-month battery autonomy.',
      challenge: 'Operating reliably on micro-watt power consumption while continuously monitoring vibration and temperature and transmitting encrypted bursts over long distances.',
      tech: ['Embedded C', 'STM32 Low-Power MCU', 'FreeRTOS', 'LoRaWAN / Cellular IoT', 'AWS IoT Core', 'Time-Series DB'],
      outcome: 'Delivered continuous operational monitoring across 12 industrial sites, preventing 4 major equipment failures through early acoustic signature anomaly alerts.'
    },
    abhedya: {
      category: 'IoT Hardware · Embedded Systems · Transportation Tech',
      title: 'ABHEDYA — Intelligent Blackbox for Commercial Vehicles',
      desc: 'Inspired by aircraft blackbox technology, ABHEDYA is an intelligent IoT-based hardware system engineered for commercial vehicles to improve transportation safety, cargo security, and journey accountability through continuous monitoring and digital event recording.',
      challenge: 'Commercial vehicles face fragmented monitoring where vehicle tracking, video, and cargo locks operate in separate silos. During cargo theft, route deviations, or road accidents, operators and insurers face severe information gaps, lack of reliable incident-related records, and prolonged claim disputes.',
      tech: ['Internet of Things (IoT)', 'Embedded Systems', 'Automotive Electronics', 'Sensor Technology', 'Wireless Telemetry', 'Digital Event Recording', 'Cloud Management', 'Edge Intelligence'],
      outcome: 'Unifies vehicle monitoring, cargo security, and incident recording into a centralized hardware blackbox. Delivers a complete, tamper-evident digital record throughout the journey to expedite insurance investigations and protect high-value fleet operations.',
      liveUrl: 'abhedya.html',
      features: [
        {
          icon: '🚗',
          title: 'Vehicle Monitoring',
          desc: 'Supports continuous monitoring of vital vehicle operations, engine activity, and journey telemetry.'
        },
        {
          icon: '📦',
          title: 'Cargo Security',
          desc: 'Actively monitors cargo conditions and physical compartment status to identify unauthorized access or suspicious tampering.'
        },
        {
          icon: '🚨',
          title: 'Incident Monitoring',
          desc: 'Detects and flags critical in-transit events, abrupt route deviations, collisions, and anomalous stops.'
        },
        {
          icon: '📼',
          title: 'Digital Event Recording',
          desc: 'Maintains tamper-evident journey and incident data records for post-trip forensic review and safety auditing.'
        },
        {
          icon: '📡',
          title: 'Remote Connectivity',
          desc: 'Supports remote cloud telemetry transmission and instantaneous dispatch notifications for fleet operators.'
        },
        {
          icon: '⚖️',
          title: 'Insurance & Claim Support',
          desc: 'Provides objective digital event records that assist insurance companies and investigators during claim verification.'
        }
      ],
      workflow: [
        {
          title: '1. Monitor',
          desc: 'Continuously observes important vehicle and transportation activities across the journey.'
        },
        {
          title: '2. Collect',
          desc: 'Gathers multi-sensory physical and journey telemetry during transit.'
        },
        {
          title: '3. Process',
          desc: 'Evaluates available telemetry on-device to identify unusual operational events and threshold breaches.'
        },
        {
          title: '4. Record',
          desc: 'Preserves critical event-related information in a protected, tamper-evident digital ledger.'
        },
        {
          title: '5. Notify',
          desc: 'Dispatches real-time alerts and situational updates to remote dispatch and fleet managers.'
        },
        {
          title: '6. Review',
          desc: 'Makes comprehensive journey records available for post-incident insurance investigations and performance audits.'
        }
      ],
      stackCategories: [
        {
          category: 'Core Technology Domains',
          items: 'Internet of Things (IoT), Embedded Systems, Automotive Electronics, Sensor Technology'
        },
        {
          category: 'Connectivity & Remote Access',
          items: 'Wireless Communication, Remote Cloud Management, Telemetry Streams'
        },
        {
          category: 'Data & Event Architecture',
          items: 'Digital Event Recording, Non-Volatile Event Storage, Journey Audit Records'
        },
        {
          category: 'Development Status',
          items: 'Pre-seed / Prototype Development Stage (PCB Design & Virtual Hardware Completed)'
        }
      ],
      metrics: [
        { val: '6-Step', label: 'Event Lifecycle (Monitor to Review)' },
        { val: 'Unified', label: 'Vehicle + Cargo + Incident System' },
        { val: 'Pre-Seed', label: 'Prototype Development Stage' },
        { val: 'Forensic', label: 'Tamper-Evident Claim Records' }
      ]
    },
    myclaim: {
      category: 'FinTech · Enterprise Web Platform · Multi-Agent AI',
      title: 'MyClaim — Enterprise Financial Recovery & Claim Management Portal',
      desc: 'An end-to-end, multi-tier claims management and investor recovery portal that unifies IEPF share/dividend retrieval, Pre-IPO allocations, wealth portfolios, and insurance claims into a single digitized workflow — powered by real-time WebSockets, in-browser OCR verification, and a CrewAI multi-agent workforce.',
      challenge: 'Recovering dormant securities, IEPF dividends, and settling contested insurance claims involves navigating complex multi-stakeholder chains: fragmented spreadsheets across independent advisors, days of manual human KYC data entry, opaque status black-holes for claimants, and unstructured ticket escalations without SLA accountability.',
      tech: ['React 18 / Vite 5', 'Tailwind CSS 3', 'Framer Motion 12', 'Tesseract.js OCR', 'Node.js / Express', 'Socket.io 4.8', 'MongoDB / Mongoose 7', 'Python CrewAI', 'jsPDF & html2canvas'],
      outcome: 'Achieved sub-100ms real-time event push via Socket.io, 100% client-side OCR extraction with zero server bottleneck, strict 8-tier hierarchical RBAC, and zero settlement ambiguity through automated tamper-proof PDF audit dossiers.',
      liveUrl: 'myclaim.html',
      features: [
        {
          icon: '🎨',
          title: 'Enterprise Form Animation & Progressive Reveal',
          desc: 'Custom motion utilities, floating labels, active-field spotlight effects, dynamic progress trackers, and 50+ keyframes to prevent visual fatigue across complex financial onboarding.'
        },
        {
          icon: '⚡',
          title: 'Real-Time Socket.io Duplex Event Bus',
          desc: 'Bi-directional WebSocket streaming keeps dashboards, operational queues, and client timelines synchronized with instant push across distributed sessions.'
        },
        {
          icon: '🔍',
          title: 'In-Browser Tesseract.js OCR Pipeline',
          desc: 'Executes optical character recognition directly within the client browser, extracting folio numbers, company names, and certificate IDs before payload transmission.'
        },
        {
          icon: '👥',
          title: 'Multi-Tier Hierarchical Channel Architecture',
          desc: 'Models real-world financial distribution channels with Super Partner and Partner relationships, automated referral tracking, and Mongoose-scoped client book isolation.'
        },
        {
          icon: '📄',
          title: 'Client-Side Dossier & PDF Generation',
          desc: 'Instant generation of client proposals, IEPF recovery requests, and operational summaries using jsPDF and html2canvas with zero server rendering lag.'
        },
        {
          icon: '🤖',
          title: 'CrewAI Multi-Agent Autonomous Workforce',
          desc: 'Autonomous Python agent crew (claim_agent, document_agent, employee_agent, finance_agent, notification_agent) auditing filing readiness and missing evidentiary documents.'
        }
      ],
      workflow: [
        {
          title: '1. Client Onboarding & Dynamic Form Progression',
          desc: 'Applicants and partners navigate guided multi-step forms with active field spotlights and progressive validation.'
        },
        {
          title: '2. Local Document Processing & Optical Verification',
          desc: 'Uploaded certificates and KYC documents enter the upload zone where in-browser Tesseract.js pre-fills verified folio numbers and metadata.'
        },
        {
          title: '3. Real-Time Ingestion & WebSocket Broadcast',
          desc: 'Payloads post to Express API and Socket.io broadcasts synchronized notification events to partners, case officers, and admins.'
        },
        {
          title: '4. Role-Segregated Operational Routing',
          desc: 'Claims and tickets are routed into designated operational departments (IEPF, Pre-IPO, Wealth, Policy Disputes) under strict permission gates.'
        },
        {
          title: '5. CrewAI Agent Triage & Validation',
          desc: 'Background CrewAI agents run automated audits to identify missing documents and compute financial tallies.'
        },
        {
          title: '6. Exportable Legal Dossiers & Payout Reconciliation',
          desc: 'The portal compiles formatted tamper-proof dossiers with jsPDF and reconciles partner commission and settlement balances.'
        }
      ],
      stackCategories: [
        {
          category: 'Frontend & Motion Systems',
          items: 'React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Framer Motion 12, Custom FormAnimations CSS'
        },
        {
          category: 'Client-Side Document AI',
          items: 'Tesseract.js In-Browser OCR, jsPDF, html2canvas, Recharts 3.8'
        },
        {
          category: 'Backend & Real-Time Engine',
          items: 'Node.js, Express 4.18, Socket.io 4.8 duplex event bus, MongoDB, Mongoose 7.0 Schematized ODM'
        },
        {
          category: 'Autonomous Multi-Agent AI',
          items: 'Python, CrewAI, uv Package Manager, Claim Agent, Document Agent, Employee Agent, Finance Agent, Notification Agent'
        }
      ],
      metrics: [
        { val: '<100ms', label: 'Real-Time Sync (Socket.io Duplex Event Bus)' },
        { val: '8-Tier', label: 'Hierarchical RBAC Access Tiers' },
        { val: '100%', label: 'Client-Side In-Browser OCR Verification' },
        { val: '0', label: 'Settlement Ambiguity (Immutable Dossiers)' }
      ]
    },
    'enterprise-portal': {
      category: 'FinTech · Enterprise Web Platform',
      title: 'MyClaim — Enterprise Financial Recovery & Claim Management Portal',
      desc: 'An end-to-end, multi-tier claims management and investor recovery portal that unifies IEPF share/dividend retrieval, Pre-IPO allocations, wealth portfolios, and insurance claims into a single digitized workflow.',
      challenge: 'Resolving multi-stakeholder bottlenecks, manual document processing, and lack of real-time visibility across independent partner-client chains.',
      tech: ['React 18', 'Socket.io', 'Tesseract.js', 'Express.js', 'MongoDB', 'CrewAI', 'jsPDF'],
      outcome: 'Sub-100ms real-time event synchronization, in-browser optical character recognition, 8-tier role-based access control, and automated tamper-proof legal dossiers.',
      liveUrl: 'myclaim.html'
    }
  };

  const serviceModal = document.getElementById('service-modal');
  const serviceModalClose = document.getElementById('service-modal-close');
  const serviceModalBadge = document.getElementById('service-modal-badge');
  const serviceModalTitle = document.getElementById('service-modal-title');
  const serviceModalDesc = document.getElementById('service-modal-desc');
  const serviceModalStack = document.getElementById('service-modal-stack');
  const serviceModalDeliverables = document.getElementById('service-modal-deliverables');

  function openServiceModal(key) {
    const data = serviceData[key];
    if (!data || !serviceModal) return;

    if (serviceModalBadge) serviceModalBadge.textContent = data.badge;
    if (serviceModalTitle) serviceModalTitle.textContent = data.title;
    if (serviceModalDesc) serviceModalDesc.textContent = data.desc;

    if (serviceModalStack) {
      serviceModalStack.innerHTML = data.stack
        .map(pill => `<span class="spec-pill">${pill}</span>`)
        .join('');
    }

    if (serviceModalDeliverables) {
      serviceModalDeliverables.innerHTML = data.deliverables
        .map(item => `<li class="spec-check-item">${item}</li>`)
        .join('');
    }

    serviceModal.classList.add('open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const projectModalCategory = document.getElementById('project-modal-category');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalDesc = document.getElementById('project-modal-desc');
  const projectModalChallenge = document.getElementById('project-modal-challenge');
  const projectModalTopology = document.getElementById('project-modal-topology');
  const projectModalTech = document.getElementById('project-modal-tech');
  const projectModalOutcome = document.getElementById('project-modal-outcome');
  const projectModalLinks = document.getElementById('project-modal-links');
  const projectModalLiveLink = document.getElementById('project-modal-live-link');
  const projectModalGithubLink = document.getElementById('project-modal-github-link');
  const projectModalFeaturesWrap = document.getElementById('project-modal-features-wrap');
  const projectModalFeatures = document.getElementById('project-modal-features');
  const projectModalWorkflowWrap = document.getElementById('project-modal-workflow-wrap');
  const projectModalWorkflow = document.getElementById('project-modal-workflow');
  const projectModalStackDetailsWrap = document.getElementById('project-modal-stack-details-wrap');
  const projectModalStackDetails = document.getElementById('project-modal-stack-details');
  const projectModalMetricsWrap = document.getElementById('project-modal-metrics-wrap');
  const projectModalMetrics = document.getElementById('project-modal-metrics');

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data || !projectModal) return;

    if (projectModalCategory) projectModalCategory.textContent = data.category;
    if (projectModalTitle) projectModalTitle.textContent = data.title;
    if (projectModalDesc) projectModalDesc.textContent = data.desc;
    if (projectModalChallenge) projectModalChallenge.textContent = data.challenge;
    if (projectModalOutcome) projectModalOutcome.textContent = data.outcome;

    if (projectModalLinks) {
      if (data.liveUrl || data.githubUrl) {
        projectModalLinks.style.display = 'flex';
        if (projectModalLiveLink) {
          projectModalLiveLink.href = data.liveUrl || '#';
          projectModalLiveLink.style.display = data.liveUrl ? 'inline-flex' : 'none';
        }
        if (projectModalGithubLink) {
          projectModalGithubLink.href = data.githubUrl || '#';
          projectModalGithubLink.style.display = data.githubUrl ? 'inline-flex' : 'none';
        }
      } else {
        projectModalLinks.style.display = 'none';
      }
    }

    if (projectModalTopology) {
      projectModalTopology.innerHTML = getTopologySvg(key);
    }

    if (projectModalTech) {
      projectModalTech.innerHTML = data.tech
        .map(pill => `<span class="spec-pill">${pill}</span>`)
        .join('');
    }

    // Dynamic Features / Innovations
    if (projectModalFeaturesWrap && projectModalFeatures) {
      if (data.features && data.features.length) {
        projectModalFeaturesWrap.style.display = 'block';
        projectModalFeatures.innerHTML = data.features.map(f => `
          <div class="modal-feature-card">
            <div class="modal-feature-header">
              <span class="modal-feature-icon">${f.icon || '✦'}</span>
              <span>${f.title}</span>
            </div>
            <p class="modal-feature-desc">${f.desc}</p>
          </div>
        `).join('');
      } else {
        projectModalFeaturesWrap.style.display = 'none';
      }
    }

    // Dynamic Workflow Loop
    if (projectModalWorkflowWrap && projectModalWorkflow) {
      if (data.workflow && data.workflow.length) {
        projectModalWorkflowWrap.style.display = 'block';
        projectModalWorkflow.innerHTML = data.workflow.map((w, idx) => `
          <div class="modal-workflow-step">
            <span class="modal-step-number">${idx + 1}</span>
            <div class="modal-step-content">
              <div class="modal-step-title">${w.title}</div>
              <div class="modal-step-desc">${w.desc}</div>
            </div>
          </div>
        `).join('');
      } else {
        projectModalWorkflowWrap.style.display = 'none';
      }
    }

    // Dynamic Architectural Subsystems
    if (projectModalStackDetailsWrap && projectModalStackDetails) {
      if (data.stackCategories && data.stackCategories.length) {
        projectModalStackDetailsWrap.style.display = 'block';
        projectModalStackDetails.innerHTML = data.stackCategories.map(cat => `
          <div class="modal-stack-category">
            <div class="modal-stack-cat-title">${cat.category}</div>
            <div class="modal-stack-cat-items">${cat.items}</div>
          </div>
        `).join('');
      } else {
        projectModalStackDetailsWrap.style.display = 'none';
      }
    }

    // Dynamic Metrics Telemetry
    if (projectModalMetricsWrap && projectModalMetrics) {
      if (data.metrics && data.metrics.length) {
        projectModalMetricsWrap.style.display = 'block';
        projectModalMetrics.innerHTML = data.metrics.map(m => `
          <div class="modal-metric-card">
            <span class="modal-metric-val">${m.val}</span>
            <span class="modal-metric-lbl">${m.label}</span>
          </div>
        `).join('');
      } else {
        projectModalMetricsWrap.style.display = 'none';
      }
    }

    const tabBtns = projectModal.querySelectorAll('.modal-tab-btn');
    const tabPanes = projectModal.querySelectorAll('.modal-tab-pane');
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));

    const defaultBtn = projectModal.querySelector('.modal-tab-btn[data-tab="overview"]');
    const defaultPane = document.getElementById('pane-overview');
    if (defaultBtn) defaultBtn.classList.add('active');
    if (defaultPane) defaultPane.classList.add('active');

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (projectModal) {
    const tabBtns = projectModal.querySelectorAll('.modal-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectModal.querySelectorAll('.modal-tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });

        const activePane = document.getElementById(`pane-${tabTarget}`);
        if (activePane) activePane.classList.add('active');
      });
    });
  }

  document.querySelectorAll('.service-card[data-service-key]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') return;
      const key = card.getAttribute('data-service-key');
      openServiceModal(key);
    });
  });

  document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) return;
      const key = card.getAttribute('data-project-id');
      openProjectModal(key);
    });
  });

  if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceModal);
  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);

  window.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeServiceModal();
    if (e.target === projectModal) closeProjectModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeServiceModal();
      closeProjectModal();
    }
  });


  // =========================================================================
  // 12. INTERACTIVE PROJECT SCOPE & ARCHITECTURE ESTIMATOR ENGINE
  // =========================================================================
  const estimatorSection = document.getElementById('estimator');
  if (estimatorSection) {
    let estState = {
      domain: 'ai',
      scale: 'mvp',
      capabilities: new Set(['realtime', 'edge', 'cicd'])
    };

    const domainProfiles = {
      ai: {
        name: 'AI & Machine Learning',
        blueprint: 'Distributed Neural Inference & Real-Time Streaming Mesh',
        stack: ['Python FastAPI', 'PyTorch / TensorRT', 'Apache Kafka', 'Redis Cache', 'Next.js 14 UI', 'Docker / K8s'],
        sla: '99.98% SLA',
        mvpWeeks: '5 – 7 Weeks',
        growthWeeks: '8 – 12 Weeks',
        entWeeks: '14 – 18 Weeks',
        deliverables: [
          'Containerized inference serving engine with dynamic batching',
          'Low-latency bidirectional WebSocket telemetry socket',
          'Production CI/CD deployment pipeline with automated test matrix'
        ]
      },
      web: {
        name: 'Web Platform & API',
        blueprint: 'High-Concurrency Edge-Rendered Multi-Tenant Platform',
        stack: ['TypeScript', 'Next.js 14 App Router', 'Node.js Cluster', 'PostgreSQL', 'Prisma ORM', 'Redis Caching'],
        sla: '99.99% SLA',
        mvpWeeks: '4 – 6 Weeks',
        growthWeeks: '7 – 10 Weeks',
        entWeeks: '12 – 16 Weeks',
        deliverables: [
          'End-to-end full-stack web application with responsive design system',
          'Sub-second Core Web Vitals optimization and edge caching',
          'Granular Role-Based Access Control (RBAC) and audit logging'
        ]
      },
      mobile: {
        name: 'Mobile Application',
        blueprint: 'Offline-First Cross-Platform Mobile Sync Architecture',
        stack: ['Flutter Cross-Platform', 'Kotlin / Swift', 'SQLite / Room', 'WebSockets', 'Firebase Auth', 'Background Workers'],
        sla: '99.95% SLA',
        mvpWeeks: '6 – 8 Weeks',
        growthWeeks: '9 – 12 Weeks',
        entWeeks: '14 – 18 Weeks',
        deliverables: [
          'Production iOS & Android builds optimized for 60 FPS fluid rendering',
          'Conflict-free offline synchronization engine with background queue',
          'Biometric authentication and automated app store packaging'
        ]
      },
      embedded: {
        name: 'Embedded Systems & Hardware',
        blueprint: 'Deterministic Low-Power Sensor Mesh & Telemetry Pipeline',
        stack: ['Embedded C', 'STM32 / ESP32', 'FreeRTOS', 'LoRaWAN', 'MQTT TLS', 'AWS IoT Core'],
        sla: '99.99% SLA',
        mvpWeeks: '6 – 9 Weeks',
        growthWeeks: '10 – 14 Weeks',
        entWeeks: '16 – 22 Weeks',
        deliverables: [
          'Deterministic RTOS firmware with micro-watt low-power sleep modes',
          'Industrial sensor bus interface (I2C, SPI, CAN bus) validation',
          'Secure Over-The-Air (OTA) firmware upgrade mechanism'
        ]
      },
      cloud: {
        name: 'Cloud & DevOps',
        blueprint: 'Zero-Downtime Multi-Region Kubernetes & Infrastructure-as-Code',
        stack: ['Kubernetes (EKS/GKE)', 'Terraform IaC', 'ArgoCD GitOps', 'Prometheus / Grafana', 'Vault', 'GitHub Actions'],
        sla: '99.999% SLA',
        mvpWeeks: '3 – 5 Weeks',
        growthWeeks: '6 – 8 Weeks',
        entWeeks: '10 – 14 Weeks',
        deliverables: [
          'Declarative multi-environment Terraform infrastructure automation',
          'Zero-downtime canary deployment pipelines with automatic rollback',
          'Comprehensive 24/7 observability, distributed tracing, and metrics'
        ]
      },
      robotics: {
        name: 'Robotics & Automation',
        blueprint: 'ROS 2 Spatial Navigation & Autonomous Sensory Fusion Fleet',
        stack: ['ROS 2 Humble', 'C++20', 'MicroPython', 'OpenCV / YOLO', 'MQTT Broker', 'WebRTC Tele-operation'],
        sla: '99.95% SLA',
        mvpWeeks: '7 – 10 Weeks',
        growthWeeks: '12 – 16 Weeks',
        entWeeks: '18 – 24 Weeks',
        deliverables: [
          'ROS 2 node graph architecture with deterministic publisher/subscriber loops',
          'Real-time edge computer vision inference for spatial tracking',
          'High-reliability telemetry uplink with WebRTC video feed'
        ]
      }
    };

    const elTitle = document.getElementById('est-blueprint-title');
    const elTimeline = document.getElementById('est-blueprint-timeline');
    const elSla = document.getElementById('est-blueprint-sla');
    const elStack = document.getElementById('est-blueprint-stack');
    const elDeliverables = document.getElementById('est-blueprint-deliverables');
    const applyBtn = document.getElementById('est-apply-blueprint-btn');

    function updateEstimatorUI() {
      const profile = domainProfiles[estState.domain] || domainProfiles.ai;

      if (elTitle) elTitle.textContent = profile.blueprint;

      let timeline = profile.mvpWeeks;
      if (estState.scale === 'growth') timeline = profile.growthWeeks;
      if (estState.scale === 'enterprise') timeline = profile.entWeeks;

      if (elTimeline) elTimeline.textContent = timeline;
      if (elSla) elSla.textContent = profile.sla;

      if (elStack) {
        elStack.innerHTML = profile.stack
          .map(s => `<span class="spec-pill">${s}</span>`)
          .join('');
      }

      if (elDeliverables) {
        elDeliverables.innerHTML = profile.deliverables
          .map(d => `<li>${d}</li>`)
          .join('');
      }
    }

    document.querySelectorAll('#est-domain-choices .estimator-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#est-domain-choices .estimator-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        estState.domain = btn.getAttribute('data-domain');
        updateEstimatorUI();
      });
    });

    document.querySelectorAll('#est-scale-choices .estimator-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#est-scale-choices .estimator-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        estState.scale = btn.getAttribute('data-scale');
        updateEstimatorUI();
      });
    });

    document.querySelectorAll('#est-capabilities-choices .estimator-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const cap = btn.getAttribute('data-cap');
        if (estState.capabilities.has(cap)) {
          estState.capabilities.delete(cap);
          btn.classList.remove('active');
        } else {
          estState.capabilities.add(cap);
          btn.classList.add('active');
        }
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const profile = domainProfiles[estState.domain] || domainProfiles.ai;
        const problemInput = document.getElementById('contact-problem');
        const solutionSelect = document.getElementById('contact-solution-type');

        if (solutionSelect) {
          const map = {
            ai: 'AI & Machine Learning',
            web: 'Web Development',
            mobile: 'Mobile App Development',
            embedded: 'Embedded Systems & Hardware',
            cloud: 'Cloud & DevOps',
            robotics: 'Robotics, IoT & Emerging Technologies'
          };
          solutionSelect.value = map[estState.domain] || '';
        }

        if (problemInput) {
          const caps = Array.from(estState.capabilities).join(', ');
          problemInput.value = `Selected Architecture Blueprint: ${profile.blueprint}\n` +
            `Target Domain: ${profile.name}\n` +
            `Project Scope: ${estState.scale.toUpperCase()}\n` +
            `Core Requirements: ${caps || 'Full standard pipeline'}\n\n` +
            `We would like to discuss engineering implementation, timeline, and deliverables.`;
          problemInput.style.borderColor = 'var(--accent-violet)';
        }

        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const headerOffset = 80;
          const elementPosition = contactSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          setTimeout(() => {
            const nameInput = document.getElementById('contact-name');
            if (nameInput) nameInput.focus();
          }, 600);
        }
      });
    }

    updateEstimatorUI();
  }


  // =========================================================================
  // 13. INTERACTIVE EXECUTIVE FAQ ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other open FAQ items
        faqItems.forEach(i => i.classList.remove('open'));

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });


  // =========================================================================
  // 14. 3D CARD PERSPECTIVE TILT PHYSICS
  // =========================================================================
  const tiltElements = document.querySelectorAll(
    '.service-card, .bento-card, .project-card, .process-step-card, .pillar-card, .engagement-card, .audience-strip-card, .telemetry-card, .estimator-blueprint-card'
  );

  tiltElements.forEach(el => {
    el.classList.add('tilt-card-3d');

    el.addEventListener('mousemove', (e) => {
      if (el.classList.contains('pillar-card') && !el.classList.contains('is-opened')) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    el.addEventListener('mouseleave', () => {
      if (el.classList.contains('pillar-card')) {
        el.style.transform = '';
        el.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        return;
      }
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });


  // =========================================================================
  // 14.5 QUICK ARCHITECTURE FORMULATOR CONTROLLER
  // =========================================================================
  const domainPills = document.querySelectorAll('#param-domain-pills .formulator-chip');
  const stagePills = document.querySelectorAll('#param-stage-pills .formulator-chip');
  const solutionTypeSelect = document.getElementById('contact-solution-type');
  const problemTextarea = document.getElementById('contact-problem');

  function updateFormulatorPreFill() {
    const activeDomainChip = document.querySelector('#param-domain-pills .formulator-chip.active');
    const activeStageChip = document.querySelector('#param-stage-pills .formulator-chip.active');

    const domainVal = activeDomainChip ? activeDomainChip.getAttribute('data-val') : '';
    const stageVal = activeStageChip ? activeStageChip.getAttribute('data-val') : '';

    if (solutionTypeSelect && domainVal) {
      solutionTypeSelect.value = domainVal;
      solutionTypeSelect.style.borderColor = 'rgba(212, 175, 110, 0.6)';
      setTimeout(() => {
        solutionTypeSelect.style.borderColor = '';
      }, 600);
    }

    if (problemTextarea) {
      const currentVal = problemTextarea.value.trim();
      const prefixPattern = /^\[Scope:.*?\]\s*/;
      if (!currentVal || prefixPattern.test(currentVal)) {
        problemTextarea.value = `[Scope: ${domainVal || 'Engineering'} | Stage: ${stageVal || 'Concept'}] `;
      }
    }
  }

  domainPills.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      domainPills.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateFormulatorPreFill();
    });
  });

  stagePills.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      stagePills.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateFormulatorPreFill();
    });
  });

  if (solutionTypeSelect) {
    solutionTypeSelect.addEventListener('change', () => {
      const selectedVal = solutionTypeSelect.value;
      domainPills.forEach(chip => {
        if (chip.getAttribute('data-val') === selectedVal) {
          domainPills.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        }
      });
    });
  }


  // =========================================================================
  // 15. CONTACT FORM SUBMISSION CONTROLLER (GOOGLE SHEETS & EMAIL PIPELINE)
  // =========================================================================
  const contactForm = document.getElementById('contact-inquiry-form');
  const formSuccessBox = document.getElementById('form-success-box');
  const formErrorAlert = document.getElementById('form-error-msg');
  const resetEnquiryBtn = document.getElementById('reset-enquiry-btn');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && formSuccessBox) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (formErrorAlert) {
        formErrorAlert.style.display = 'none';
      }

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const companyInput = document.getElementById('contact-company');
      const problemInput = document.getElementById('contact-problem');
      const solutionSelect = document.getElementById('contact-solution-type');
      const selectedRadio = contactForm.querySelector('input[name="engagementPreference"]:checked');

      // Validation
      let hasError = false;
      [nameInput, emailInput, problemInput].forEach(field => {
        if (!field || !field.value.trim()) {
          if (field) {
            field.style.borderColor = 'rgba(239, 68, 68, 0.8)';
            field.focus();
          }
          hasError = true;
        } else if (field) {
          field.style.borderColor = '';
        }
      });

      // Basic email syntax validation
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.style.borderColor = 'rgba(239, 68, 68, 0.8)';
          emailInput.focus();
          hasError = true;
        }
      }

      if (hasError) return;

      const payload = {
        fullName: nameInput.value.trim(),
        businessEmail: emailInput.value.trim(),
        company: companyInput ? companyInput.value.trim() : 'Not Specified',
        solutionType: solutionSelect ? solutionSelect.value : 'General Enquiry',
        engagementPreference: selectedRadio ? selectedRadio.value : 'Project-based',
        problemStatement: problemInput.value.trim(),
        sourcePage: window.location.href,
        submittedAt: new Date().toISOString()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <span class="arrow" aria-hidden="true">✦</span>';
      }

      const scriptUrl = getGoogleSheetsUrl();
      const isConfigured = scriptUrl &&
        scriptUrl.startsWith('https://script.google.com') &&
        !scriptUrl.includes('YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE');

      if (isConfigured) {
        try {
          // Send request with text/plain to avoid pre-flight CORS block on Google Apps Script
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
          });

          // Backup locally as well
          try {
            const saved = JSON.parse(localStorage.getItem('swamiverse_enquiries') || '[]');
            saved.push(payload);
            localStorage.setItem('swamiverse_enquiries', JSON.stringify(saved));
          } catch (_) {}

          contactForm.style.display = 'none';
          formSuccessBox.style.display = 'block';

        } catch (fetchErr) {
          console.error('Google Sheets dispatch error:', fetchErr);
          if (formErrorAlert) {
            formErrorAlert.style.display = 'flex';
            const errorText = formErrorAlert.querySelector('.error-text');
            if (errorText) {
              errorText.textContent = 'Transmission error. Please check connection or email swamiverseinfotek@gmail.com directly.';
            }
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Your Enquiry <span class="arrow" aria-hidden="true">→</span>';
          }
        }
      } else {
        // Development / Demo mode if Web App URL has not been pasted yet
        console.info('⚡ [Swamiverse Infotek] Form response captured locally. To sync live to Google Sheets, paste your deployed Web App URL into config.js. See GOOGLE_SHEETS_SETUP_GUIDE.md', payload);
        
        try {
          const saved = JSON.parse(localStorage.getItem('swamiverse_enquiries') || '[]');
          saved.push(payload);
          localStorage.setItem('swamiverse_enquiries', JSON.stringify(saved));
        } catch (_) {}

        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccessBox.style.display = 'block';

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Your Enquiry <span class="arrow" aria-hidden="true">→</span>';
          }
        }, 600);
      }
    });

    if (resetEnquiryBtn) {
      resetEnquiryBtn.addEventListener('click', () => {
        contactForm.reset();
        if (formErrorAlert) formErrorAlert.style.display = 'none';
        formSuccessBox.style.display = 'none';
        contactForm.style.display = 'block';
      });
    }
  }


  // =========================================================================
  // 16. SMOOTH ANCHOR SCROLLING
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // =========================================================================
  // 17. WHY WORK WITH US STEP-BY-STEP SLIDING ANIMATION
  // =========================================================================
  const pillarsSection = document.getElementById('about');
  const pillarsList = document.getElementById('about-pillars-list');
  const pillarCards = document.querySelectorAll('.pillar-card');
  const spineProgress = document.getElementById('pillars-spine-progress');

  if (pillarsList && pillarCards.length > 0) {
    // Prepare initial sliding state
    pillarsList.classList.add('is-animated-ready');

    let hasTriggered = false;

    const triggerPillarsSequence = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      pillarCards.forEach((card, index) => {
        const delay = index * 260; // 260ms smooth step cadence
        setTimeout(() => {
          card.classList.add('is-opened');
          card.classList.add('sweep-active');
          setTimeout(() => card.classList.remove('sweep-active'), 1200);

          // Fill vertical timeline step spine in sync
          if (spineProgress) {
            const pct = ((index + 1) / pillarCards.length) * 100;
            spineProgress.style.height = `${pct}%`;
          }
        }, delay);
      });
    };

    // Interactive card click handler
    pillarCards.forEach(card => {
      card.addEventListener('click', () => {
        pillarCards.forEach(c => c.classList.remove('is-active-step'));
        card.classList.add('is-active-step');
        card.classList.add('sweep-active');
        setTimeout(() => card.classList.remove('sweep-active'), 1000);
      });
    });

    // Trigger on scroll when section enters viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerPillarsSequence();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      observer.observe(pillarsSection || pillarsList);
    } else {
      setTimeout(triggerPillarsSequence, 400);
    }
  }

})();
