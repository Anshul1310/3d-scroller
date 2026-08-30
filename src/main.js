import './style.css';
import './2d.css';
import './2d1.css';
import './2d2.css';
import './2d3.css';
import './2d4.css';
import './2d5.css';

class AppRouter {
  constructor() {
    this.currentInstance = null;
    this.currentRoute = null;
    this.container = null;
    this.navElement = null;
  }

  init() {
    this.setupGlobalDOM();
    this.handleRoute();
    window.addEventListener('popstate', () => this.handleRoute());

    // Intercept clicks on router links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const routeAttr = link.getAttribute('data-route');
      const targetRoute = routeAttr || href;

      if (targetRoute && (targetRoute === '/' || targetRoute.startsWith('/2d'))) {
        e.preventDefault();
        const cleanRoute = targetRoute.endsWith('/') && targetRoute.length > 1 ? targetRoute.slice(0, -1) : targetRoute;
        if (window.location.pathname !== cleanRoute) {
          window.history.pushState({}, '', cleanRoute);
          this.handleRoute();
        }
      }
    });
  }

  setupGlobalDOM() {
    // Top Navigation
    let nav = document.getElementById('globalNav');
    if (!nav) {
      nav = document.createElement('header');
      nav.id = 'globalNav';
      nav.className = 'app-global-nav';
      document.body.prepend(nav);
    }
    this.navElement = nav;

    // Content App Root
    let app = document.getElementById('app');
    if (!app) {
      app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
    }
    this.container = app;
  }

  renderGlobalNav(activeRoute) {
    if (!this.navElement) return;

    const routes = [
      { path: '/', label: '3D' },
      { path: '/2d0', altPath: '/2d', label: '2D0 Spiral' },
      { path: '/2d1', label: '2D1 Kinetic' },
      { path: '/2d2', label: '2D2 Deck' },
      { path: '/2d3', label: '2D3 Vortex' },
      { path: '/2d4', label: '2D4 Frames' },
      { path: '/2d5', label: '2D5 Book' }
    ];

    const currentKey = (activeRoute === '/2d' || activeRoute === '/2d0') ? '/2d0' : activeRoute;

    const tabsHtml = routes.map((r) => {
      const isActive = r.path === currentKey || (r.altPath && r.altPath === activeRoute);
      return `<a href="${r.path}" class="nav-tab ${isActive ? 'active' : ''} nav-route-link" data-route="${r.path}">${r.label}</a>`;
    }).join('');

    this.navElement.innerHTML = `
      <div class="nav-brand-wrap">
        <a href="/" class="global-brand nav-route-link" data-route="/">TRANSFINITTE</a>
      </div>
      <nav class="nav-tabs-scroll">
        <div class="nav-tabs-pills">
          ${tabsHtml}
        </div>
      </nav>
    `;
  }

  getRoute() {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/2d5')) return '/2d5';
    if (path.startsWith('/2d4')) return '/2d4';
    if (path.startsWith('/2d3')) return '/2d3';
    if (path.startsWith('/2d2')) return '/2d2';
    if (path.startsWith('/2d1')) return '/2d1';
    if (path.startsWith('/2d0') || path.startsWith('/2d')) return '/2d0';
    return '/';
  }

  async handleRoute() {
    const route = this.getRoute();
    if (route === this.currentRoute && this.currentInstance) {
      this.renderGlobalNav(route);
      return;
    }

    // Teardown existing instance
    if (this.currentInstance) {
      this.currentInstance.destroy();
      this.currentInstance = null;
    }

    if (this.container) {
      this.container.innerHTML = '';
    }

    // Reset body scroll and attributes
    window.scrollTo(0, 0);
    this.currentRoute = route;

    document.body.classList.remove('two-d-active', 'two-d1-active', 'two-d2-active', 'two-d3-active', 'two-d4-active', 'two-d5-active');
    this.renderGlobalNav(route);

    if (route === '/2d5') {
      document.body.classList.add('two-d5-active');
      document.title = "2D5 Book Folio — Transfinitte";
      const { TwoD5Scroller } = await import('./twoD5Scroller.js');
      this.currentInstance = new TwoD5Scroller(this.container);
      this.currentInstance.mount();
    } else if (route === '/2d4') {
      document.body.classList.add('two-d4-active');
      document.title = "2D4 Gallery Frames — Transfinitte";
      const { TwoD4Scroller } = await import('./twoD4Scroller.js');
      this.currentInstance = new TwoD4Scroller(this.container);
      this.currentInstance.mount();
    } else if (route === '/2d3') {
      document.body.classList.add('two-d3-active');
      document.title = "2D3 Radial Vortex — Transfinitte";
      const { TwoD3Scroller } = await import('./twoD3Scroller.js');
      this.currentInstance = new TwoD3Scroller(this.container);
      this.currentInstance.mount();
    } else if (route === '/2d2') {
      document.body.classList.add('two-d2-active');
      document.title = "2D2 Horizontal Deck — Transfinitte";
      const { TwoD2Scroller } = await import('./twoD2Scroller.js');
      this.currentInstance = new TwoD2Scroller(this.container);
      this.currentInstance.mount();
    } else if (route === '/2d1') {
      document.body.classList.add('two-d1-active');
      document.title = "2D1 Kinetic Scroller — Transfinitte";
      const { TwoD1Scroller } = await import('./twoD1Scroller.js');
      this.currentInstance = new TwoD1Scroller(this.container);
      this.currentInstance.mount();
    } else if (route === '/2d0' || route === '/2d') {
      document.body.classList.add('two-d-active');
      document.title = "2D0 Spiral Scroller — Transfinitte";
      const { TwoDScroller } = await import('./twoDScroller.js');
      this.currentInstance = new TwoDScroller(this.container);
      this.currentInstance.mount();
    } else {
      document.title = "3D Scroller — Spatial Architectural Experience";
      const { ThreeScroller } = await import('./threeScroller.js');
      this.currentInstance = new ThreeScroller(this.container);
      this.currentInstance.mount();
    }
  }
}

// Boot application
const router = new AppRouter();
router.init();
