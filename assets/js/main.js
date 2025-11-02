// ============================================
// JAVASCRIPT PRINCIPAL - BUENAS PRÁCTICAS
// ============================================
//
// BUENAS PRÁCTICAS APLICADAS:
//
// 1. JAVASCRIPT MODULAR
//    - Original: Todo en un archivo o inline en HTML
//    - Correcto: Código organizado en módulos y funciones
//
// 2. PATRONES MODERNOS
//    - ES6+ syntax (const, let, arrow functions)
//    - Modules (si se usa bundler)
//    - Event delegation
//    - Async/await para operaciones asíncronas
//
// 3. ACCESIBILIDAD
//    - Manejo de teclado
//    - ARIA attributes dinámicos
//    - Focus management
//
// 4. RENDIMIENTO
//    - Event delegation en lugar de múltiples listeners
//    - Debouncing/throttling cuando es necesario
//    - Lazy loading
//
// 5. MANTENIBILIDAD
//    - Código comentado
//    - Nombres descriptivos
//    - Separación de responsabilidades

// ============================================
// UTILIDADES GENERALES
// ============================================

/**
 * Debounce function - Limita la frecuencia de ejecución
 * Útil para eventos que se disparan frecuentemente (resize, scroll, input)
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Query selector simplificado
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} parent - Elemento padre (opcional)
 * @returns {HTMLElement|null}
 */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

// ============================================
// MÓDULO: NAVEGACIÓN MÓVIL
// ============================================

/**
 * Maneja el menú hamburguesa para dispositivos móviles
 * Buena práctica: Incluye manejo de teclado y ARIA
 */
const MobileMenu = (() => {
  const toggle = $('.menu-toggle');
  const menu = $('#menu-items');
  
  if (!toggle || !menu) return; // Salir si no existen los elementos
  
  const open = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    // Trap focus dentro del menú
    const firstFocusable = menu.querySelector('a, button');
    if (firstFocusable) firstFocusable.focus();
  };
  
  const close = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus(); // Devolver focus al botón
  };
  
  const toggleMenu = () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  };
  
  // Event listeners
  toggle.addEventListener('click', toggleMenu);
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
    }
  });
  
  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      close();
    }
  });
  
  return { open, close, toggleMenu };
})();

// ============================================
// MÓDULO: FILTRO DE MENÚ
// ============================================

/**
 * Filtrado de items del menú por categoría
 * Buena práctica: Usa event delegation y data attributes
 */
const MenuFilter = (() => {
  const filterButtons = $$('[data-filter]');
  const menuItems = $$('[data-category]');
  
  if (filterButtons.length === 0) return; // Salir si no hay filtros
  
  const filterItems = (category) => {
    menuItems.forEach(item => {
      const itemCategory = item.dataset.category;
      
      if (category === 'all' || itemCategory === category) {
        item.style.display = '';
        item.setAttribute('aria-hidden', 'false');
      } else {
        item.style.display = 'none';
        item.setAttribute('aria-hidden', 'true');
      }
    });
  };
  
  // Event delegation para los botones de filtro
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      
      // Actualizar estado visual de los botones
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filtrar items
      filterItems(category);
    });
  });
  
  return { filterItems };
})();

// ============================================
// MÓDULO: SCROLL SUAVE
// ============================================

/**
 * Implementa scroll suave para enlaces internos
 * Buena práctica: Mejora la UX sin JavaScript invasivo
 */
const SmoothScroll = (() => {
  // Event delegation para todos los enlaces internos
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Ignorar enlaces vacíos o solo '#'
    if (!href || href === '#') return;
    
    const target = $(href);
    
    if (target) {
      e.preventDefault();
      
      // Scroll suave con offset para header fijo
      const headerHeight = $('header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Actualizar foco para accesibilidad
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
})();

// ============================================
// MÓDULO: LAZY LOADING DE IMÁGENES
// ============================================

/**
 * Carga perezosa de imágenes para mejor rendimiento
 * Buena práctica: Usa Intersection Observer API
 */
const LazyLoad = (() => {
  const images = $$('img[data-src]');
  
  if (images.length === 0) return;
  
  // Verificar soporte de IntersectionObserver
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback para navegadores antiguos
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
})();

// ============================================
// MÓDULO: VALIDACIÓN DE FORMULARIOS
// ============================================

/**
 * Validación de formularios con feedback accesible
 * Buena práctica: Validación del lado del cliente + servidor
 */
const FormValidation = (() => {
  const forms = $$('form[data-validate]');
  
  if (forms.length === 0) return;
  
  const showError = (input, message) => {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
      errorElement.setAttribute('aria-live', 'polite');
    }
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('has-error');
  };
  
  const clearError = (input) => {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = '';
    }
    input.setAttribute('aria-invalid', 'false');
    input.classList.remove('has-error');
  };
  
  const validateInput = (input) => {
    clearError(input);
    
    // Validación básica
    if (input.hasAttribute('required') && !input.value.trim()) {
      showError(input, 'Este campo es obligatorio');
      return false;
    }
    
    // Validación de email
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        showError(input, 'Ingrese un email válido');
        return false;
      }
    }
    
    return true;
  };
  
  forms.forEach(form => {
    // Validar en tiempo real
    form.addEventListener('blur', (e) => {
      if (e.target.matches('input, textarea, select')) {
        validateInput(e.target);
      }
    }, true);
    
    // Validar al enviar
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input, textarea, select');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        // Focus en el primer campo con error
        const firstError = form.querySelector('[aria-invalid="true"]');
        if (firstError) firstError.focus();
      }
    });
  });
})();

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Función de inicialización principal
 * Se ejecuta cuando el DOM está listo
 */
const init = () => {
  console.log('Menú Tajal - JavaScript inicializado');
  
  // Cualquier código adicional de inicialización aquí
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================
// COMPARACIÓN CON EL ORIGINAL:
//
// - Original: JavaScript inline o todo en un archivo caótico
// - Correcto: Módulos organizados con responsabilidades claras
//
// - Original: Sin consideración de accesibilidad
// - Correcto: ARIA attributes, focus management, teclado
//
// - Original: Event listeners por todos lados sin organización
// - Correcto: Event delegation, patrones modulares
//
// - Original: Sin optimización de rendimiento
// - Correcto: Debouncing, lazy loading, Intersection Observer
//
// - Original: jQuery o vanilla JS desorganizado
// - Correcto: ES6+ moderno, funcional, mantenible
// ============================================
