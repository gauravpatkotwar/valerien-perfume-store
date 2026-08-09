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
    this.initPreloader();
    this.initCursor();
    this.initParticles();
    this.initScrollReveal();
    this.initMagneticElements();
    this.initTypography();
    this.initParallax();
    this.initTilt();
    this.initHorizontalScroll();
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
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight || window.matchMedia("(pointer: coarse)").matches) return; // Skip on mobile

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Spotlight follows instantly
      spotlight.style.left = mouseX + 'px';
      spotlight.style.top = mouseY + 'px';
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
        // Reduced magnitude to prevent "half popping" out of container
        img.style.transform = `translateY(${scrollY * 0.05}px) scale(1.15)`;
      });
    });
  }

  initHorizontalScroll() {
    const container = document.getElementById('horizontal-scroll-container');
    if (!container) return; // Only runs on atelier.html

    // Calculate total width of all slides
    const totalWidth = container.scrollWidth;
    
    // Set the body height so the user can scroll vertically to scrub through horizontal content
    document.body.style.height = `${totalWidth}px`;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // Move container left
      container.style.transform = `translateX(-${scrollY}px)`;

      // Subtle parallax scale effect for images inside the container
      const slides = container.querySelectorAll('.image-slide img');
      slides.forEach(img => {
        // Find how far the image is from the center of the screen
        const rect = img.parentElement.getBoundingClientRect();
        const centerOffset = Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2);
        
        // Scale down slightly as it moves away from center
        const scale = 1 - (centerOffset * 0.00015);
        img.style.transform = `scale(${Math.max(0.9, scale)})`;
      });
    });
  }

  initTilt() {
    const containers = document.querySelectorAll('.tilt-container');
    containers.forEach(container => {
      const image = container.querySelector('.tilt-image');
      if(!image) return;

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Apply a 3D tilt effect on top of parallax
        image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.15) translateY(${window.scrollY * 0.05}px)`;
      });

      container.addEventListener('mouseleave', () => {
        image.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.15) translateY(${window.scrollY * 0.05}px)`;
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
