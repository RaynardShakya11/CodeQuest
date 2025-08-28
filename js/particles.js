// Particles Animation JavaScript

// Particle System Configuration
const particleConfig = {
  particleCount: 20,
  symbols: [
    "<>",
    "{}",
    "[]",
    "/>",
    "</>",
    "()",
    "/*",
    "*/",
    "==",
    "++",
    "--",
    "=>",
  ],
  colors: ["#6366f1", "#8b5cf6", "#ec4899", "#60a5fa", "#34d399"],
  minSize: 10,
  maxSize: 30,
  minSpeed: 10,
  maxSpeed: 30,
  fadeInTime: 2,
  fadeOutTime: 2,
};

// Particle Class
class Particle {
  constructor(container) {
    this.container = container;
    this.element = null;
    this.x = Math.random() * window.innerWidth;
    this.y = window.innerHeight + 50;
    this.size =
      Math.random() * (particleConfig.maxSize - particleConfig.minSize) +
      particleConfig.minSize;
    this.speed =
      Math.random() * (particleConfig.maxSpeed - particleConfig.minSpeed) +
      particleConfig.minSpeed;
    this.symbol =
      particleConfig.symbols[
        Math.floor(Math.random() * particleConfig.symbols.length)
      ];
    this.color =
      particleConfig.colors[
        Math.floor(Math.random() * particleConfig.colors.length)
      ];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
    this.opacity = 0;
    this.fadeState = "in";
    this.horizontalMovement = Math.random() * 2 - 1;

    this.createElement();
    this.animate();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.className = "particle";
    this.element.innerHTML = this.symbol;
    this.element.style.cssText = `
            position: fixed;
            left: ${this.x}px;
            top: ${this.y}px;
            font-size: ${this.size}px;
            color: ${this.color};
            opacity: 0;
            z-index: -1;
            pointer-events: none;
            transform: rotate(${this.rotation}deg);
            transition: opacity ${particleConfig.fadeInTime}s ease;
            font-family: 'Monaco', 'Courier New', monospace;
            font-weight: bold;
            text-shadow: 0 0 10px ${this.color}40;
        `;

    this.container.appendChild(this.element);
  }

  animate() {
    // Start fade in
    setTimeout(() => {
      this.element.style.opacity = "0.3";
      this.fadeState = "visible";
    }, 100);

    // Animation loop
    this.animationFrame = setInterval(() => {
      this.update();
    }, 50);
  }

  update() {
    // Update position
    this.y -= this.speed / 10;
    this.x += this.horizontalMovement;
    this.rotation += this.rotationSpeed;

    // Apply transformations
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;

    // Check if particle should fade out
    if (this.y < -50) {
      this.fadeOut();
    }

    // Add slight horizontal drift
    if (Math.random() > 0.98) {
      this.horizontalMovement = Math.random() * 2 - 1;
    }
  }

  fadeOut() {
    if (this.fadeState === "out") return;

    this.fadeState = "out";
    this.element.style.transition = `opacity ${particleConfig.fadeOutTime}s ease`;
    this.element.style.opacity = "0";

    setTimeout(() => {
      this.destroy();
    }, particleConfig.fadeOutTime * 1000);
  }

  destroy() {
    clearInterval(this.animationFrame);
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Particle System Manager
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.container = null;
    this.isActive = true;
    this.init();
  }

  init() {
    // Create container
    this.createContainer();

    // Start particle generation
    this.startGeneration();

    // Handle visibility change
    this.handleVisibilityChange();

    // Handle resize
    this.handleResize();
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.id = "particle-container";
    this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
    document.body.appendChild(this.container);
  }

  startGeneration() {
    // Initial particles
    for (let i = 0; i < particleConfig.particleCount; i++) {
      setTimeout(() => {
        if (this.isActive) {
          this.createParticle();
        }
      }, i * 500);
    }

    // Continuous generation
    this.generationInterval = setInterval(() => {
      if (
        this.isActive &&
        this.particles.length < particleConfig.particleCount
      ) {
        this.createParticle();
      }
    }, 2000);
  }

  createParticle() {
    const particle = new Particle(this.container);
    this.particles.push(particle);

    // Clean up completed particles
    setTimeout(() => {
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }
    }, 30000);
  }

  handleVisibilityChange() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  handleResize() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Adjust particle positions if needed
        this.particles.forEach((particle) => {
          if (particle.x > window.innerWidth) {
            particle.x = window.innerWidth - 50;
          }
        });
      }, 250);
    });
  }

  pause() {
    this.isActive = false;
    clearInterval(this.generationInterval);
  }

  resume() {
    this.isActive = true;
    this.startGeneration();
  }

  destroy() {
    this.pause();
    this.particles.forEach((particle) => particle.destroy());
    this.particles = [];
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
// Advanced Particle Effects
class AdvancedParticleEffects {
  constructor() {
    this.init();
  }

  init() {
    // Mouse trail effect
    this.setupMouseTrail();

    // Click burst effect
    this.setupClickBurst();

    // Scroll parallax
    this.setupScrollParallax();
  }

  setupMouseTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let trailActive = false;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!trailActive && Math.random() > 0.98) {
        trailActive = true;
        this.createTrailParticle(mouseX, mouseY);
        setTimeout(() => {
          trailActive = false;
        }, 100);
      }
    });
  }

  createTrailParticle(x, y) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: ${
              particleConfig.colors[
                Math.floor(Math.random() * particleConfig.colors.length)
              ]
            };
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 1s ease-out forwards;
        `;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  setupClickBurst() {
    document.addEventListener("click", (e) => {
      // Don't create burst on button clicks
      if (e.target.tagName === "BUTTON" || e.target.tagName === "A") {
        return;
      }

      this.createBurst(e.clientX, e.clientY);
    });
  }

  createBurst(x, y) {
    const particleCount = 8;
    const symbols = ["*", "+", "•"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 50 + Math.random() * 50;

      const particle = document.createElement("div");
      particle.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                color: ${
                  particleConfig.colors[
                    Math.floor(Math.random() * particleConfig.colors.length)
                  ]
                };
                font-size: ${10 + Math.random() * 10}px;
                font-weight: bold;
                pointer-events: none;
                z-index: 9999;
                animation: burstParticle 0.6s ease-out forwards;
                --dx: ${Math.cos(angle) * velocity}px;
                --dy: ${Math.sin(angle) * velocity}px;
            `;

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 600);
    }
  }

  setupScrollParallax() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const particles = document.querySelectorAll(".particle");

      particles.forEach((particle, index) => {
        const speed = 0.5 + (index % 3) * 0.2;
        particle.style.transform += ` translateY(${scrolled * speed}px)`;
      });

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
}

// Initialize Particle System
let particleSystem = null;
let advancedEffects = null;

document.addEventListener("DOMContentLoaded", () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    // Initialize particle system
    particleSystem = new ParticleSystem();

    // Initialize advanced effects on desktop only
    if (window.innerWidth > 768) {
      advancedEffects = new AdvancedParticleEffects();
    }
  }

  // Add CSS for particle animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes trailFade {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0);
            }
        }
        
        @keyframes burstParticle {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(var(--dx), var(--dy)) scale(0);
            }
        }
        
        .particle {
            will-change: transform, opacity;
        }
    `;
  document.head.appendChild(style);
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (particleSystem) {
    particleSystem.destroy();
  }
});

// Performance optimization
const checkPerformance = () => {
  // Reduce particles on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    particleConfig.particleCount = Math.floor(particleConfig.particleCount / 2);
  }

  // Check available memory (if API is available)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    particleConfig.particleCount = Math.floor(particleConfig.particleCount / 2);
  }
};

checkPerformance();

// Export for external control
window.ParticleSystem = {
  pause: () => particleSystem?.pause(),
  resume: () => particleSystem?.resume(),
  destroy: () => particleSystem?.destroy(),
  setParticleCount: (count) => {
    particleConfig.particleCount = count;
    if (particleSystem) {
      particleSystem.destroy();
      particleSystem = new ParticleSystem();
    }
  },
};
