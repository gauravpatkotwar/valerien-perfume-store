import { Product3DScene } from './3d-product.js';
import { ShoppingCart } from './cart.js';
import { createIcons, Search, ShoppingBag, Truck, MousePointerClick, X } from 'lucide';

// Initialize Lucide Icons for HTML elements that exist on load
createIcons({
  icons: {
    Search,
    ShoppingBag,
    Truck,
    MousePointerClick,
    X
  }
});

class App {
  constructor() {
    // Init Cart
    this.cart = new ShoppingCart();
    
    // Luxury Features
    this.initCipherGate();
    this.initCursor();
    this.initParticles();
    this.initScrollReveal();
    this.initMagneticElements();
    this.initTypography();
    this.initParallax();
  }

  initCipherGate() {
    const gate = document.getElementById('cipher-gate');
    const input = document.getElementById('cipher-input');
    const feedback = document.getElementById('cipher-feedback');
    if(!gate || !input || !feedback) {
      this.initPreloader();
      return;
    }

    // Keep focus on input for the gate
    input.focus();
    document.addEventListener('click', () => {
      if(!gate.classList.contains('unlocked')) input.focus();
    });

    input.addEventListener('keyup', (e) => {
      if(e.key === 'Enter') {
        const val = input.value.trim().toUpperCase();
        if(val === 'V-2026') {
          feedback.textContent = 'ALLOCATION APPROVED';
          feedback.classList.remove('error');
          feedback.classList.add('success', 'show');
          input.disabled = true;
          
          setTimeout(() => {
            gate.classList.add('unlocked');
            this.initPreloader(); // Start preloader AFTER gate opens
          }, 1500);
        } else {
          feedback.textContent = 'ALLOCATION DENIED. PLEASE CONTACT YOUR CONCIERGE.';
          feedback.classList.add('show', 'error');
          input.value = '';
          
          setTimeout(() => {
            feedback.classList.remove('show');
          }, 3000);
        }
      }
    });
  }

  initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    // Hold the curtain down for 2.5 seconds to build anticipation
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 2500);
  }

  initMagneticElements() {
    const magnetics = document.querySelectorAll('.magnetic');
    
    magnetics.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        
        // 0.3 factor limits the pull strength for subtlety
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  initCursor() {
    const cursor = document.getElementById('custom-cursor');
    const spotlight = document.getElementById('cursor-spotlight');
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return; // Skip on mobile

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    // Physics lerp factor
    const speed = 0.1;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Spotlight follows instantly
      if(spotlight) {
        spotlight.style.left = mouseX + 'px';
        spotlight.style.top = mouseY + 'px';
      }
    });

    const animateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * speed;
      cursorY += dy * speed;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverElements = document.querySelectorAll('button, a, .icon-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  initTypography() {
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      
      let delay = 0;
      for(let char of text) {
        const span = document.createElement('span');
        span.textContent = char;
        if(char === ' ') {
          span.style.width = '0.5em';
          span.style.display = 'inline-block';
        } else {
          span.className = 'char-span';
          span.style.transitionDelay = `${delay}s`;
          delay += 0.05;
        }
        el.appendChild(span);
      }
    });
  }

  initParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxImages.forEach(img => {
        // Move image inside its container
        img.style.transform = `translateY(${scrollY * 0.15}px)`;
      });
    });
  }

  initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 15) + 's';
      container.appendChild(particle);
    }
  }

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.scroll-reveal, .split-text').forEach(el => {
      observer.observe(el);
    });
    
    // Auto reveal nav brand
    const navBrand = document.querySelector('.nav-brand h1');
    if(navBrand) setTimeout(() => navBrand.classList.add('visible'), 2500);
  }
}

// Start App
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
