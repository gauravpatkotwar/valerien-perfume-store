import { createIcons, ShoppingBag, X, Search, Truck, MousePointerClick } from 'lucide';

export class ShoppingCart {
  constructor() {
    this.items = [];
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    this.openBtn = document.getElementById('open-cart-btn');
    this.closeBtn = document.getElementById('close-cart-btn');
    this.continueBtn = document.getElementById('continue-shopping-btn');
    this.itemsContainer = document.getElementById('cart-items-container');
    this.emptyMsg = document.getElementById('empty-cart-msg');
    this.badge = document.getElementById('cart-badge-count');
    this.totalPriceEl = document.getElementById('cart-total-price');
    this.checkoutBtn = document.getElementById('checkout-btn');
    
    // Add to cart from Hero
    this.addToCartHeroBtn = document.getElementById('add-to-cart-hero');

    this.initEvents();
    this.render();
    
    // Init Lucide Icons
    createIcons({
      icons: {
        ShoppingBag,
        X,
        Search,
        Truck,
        MousePointerClick
      }
    });
  }

  initEvents() {
    this.openBtn.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    if(this.continueBtn) {
      this.continueBtn.addEventListener('click', () => this.close());
    }

    this.addToCartHeroBtn.addEventListener('click', () => {
      this.addItem({
        id: 'elixir-50ml',
        title: 'Elixir Essence',
        meta: '50ML / 1.7 FL.OZ',
        price: 245.00,
        qty: 1
      });
      this.open();
    });
  }

  open() {
    this.drawer.classList.add('open');
    this.overlay.classList.add('open');
  }

  close() {
    this.drawer.classList.remove('open');
    this.overlay.classList.remove('open');
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.qty += product.qty;
    } else {
      this.items.push({ ...product });
    }
    this.render();
  }

  updateQty(id, newQty) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty = newQty;
      if (item.qty <= 0) {
        this.removeItem(id);
      } else {
        this.render();
      }
    }
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.render();
  }

  render() {
    const count = this.items.reduce((sum, item) => sum + item.qty, 0);
    const total = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Update badge
    this.badge.textContent = count;
    this.badge.style.display = count > 0 ? 'flex' : 'none';
    
    // Update total
    this.totalPriceEl.textContent = `$${total.toFixed(2)}`;
    
    // Toggle empty state
    if (this.items.length === 0) {
      this.emptyMsg.style.display = 'flex';
      this.checkoutBtn.disabled = true;
      // Remove all items except empty msg
      Array.from(this.itemsContainer.children).forEach(child => {
        if (child.id !== 'empty-cart-msg') {
          this.itemsContainer.removeChild(child);
        }
      });
      return;
    }
    
    this.emptyMsg.style.display = 'none';
    this.checkoutBtn.disabled = false;
    
    // Render items
    Array.from(this.itemsContainer.children).forEach(child => {
      if (child.id !== 'empty-cart-msg') {
        this.itemsContainer.removeChild(child);
      }
    });
    
    this.items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-img">VALÉRIEN</div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">${item.meta}</div>
          <div style="margin-bottom: 8px;">$${item.price.toFixed(2)}</div>
          
          <div class="cart-item-bottom">
            <div class="qty-controls">
              <button class="qty-btn minus" data-id="${item.id}">-</button>
              <div class="qty-val">${item.qty}</div>
              <button class="qty-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
      this.itemsContainer.appendChild(el);
    });
    
    // Bind events for rendered items
    this.itemsContainer.querySelectorAll('.minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const item = this.items.find(i => i.id === id);
        if (item) this.updateQty(id, item.qty - 1);
      });
    });
    
    this.itemsContainer.querySelectorAll('.plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const item = this.items.find(i => i.id === id);
        if (item) this.updateQty(id, item.qty + 1);
      });
    });
    
    this.itemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.removeItem(e.target.dataset.id);
      });
    });
  }
}
