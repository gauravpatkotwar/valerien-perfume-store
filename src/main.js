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
    this.initCursor();
    this.initParticles();
    this.initScrollReveal();
    this.initMagneticElements();
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
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return; // Skip on mobile

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('button, a, .icon-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
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

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  }
}

// Start App
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
