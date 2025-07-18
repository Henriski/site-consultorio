const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list a");

const scrollContainer = document.querySelector("#tratamentos-scroll");
if (scrollContainer) {
  const tratamentoItems = scrollContainer.querySelectorAll('.tratamento-item');
  tratamentoItems.forEach(item => {
    item.draggable = false;
  });
}

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
    const expanded = nav.classList.contains("active");
    hamburger.setAttribute("aria-expanded", expanded);
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navbarHeight = 70;
      const offset = 30;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", false);
    }
  });
});

const slides = document.querySelectorAll(".carousel-img");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let current = 0;
let carouselInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function startCarousel() {
  clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 4000);
}

if (slides.length > 0) {
  showSlide(current);
  startCarousel();
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    showSlide(current);
    startCarousel();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
    startCarousel();
  });
}

if (slides.length > 0) {
  slides.forEach(slide => {
    slide.addEventListener('focus', () => clearInterval(carouselInterval));
    slide.addEventListener('blur', startCarousel);
  });
}

const faders = document.querySelectorAll(".fade-in");
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

faders.forEach(fader => appearOnScroll.observe(fader));

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('tratamentos-scroll');
  const leftBtn = document.querySelector('.scroll-btn.left');
  const rightBtn = document.querySelector('.scroll-btn.right');

  if (!scrollContainer) return;

  function getScrollAmount() {
    const item = scrollContainer.querySelector('.tratamento-item');
    if (item) {
      const styles = window.getComputedStyle(item);
      const marginLeft = parseFloat(styles.marginLeft) || 0;
      const marginRight = parseFloat(styles.marginRight) || 0;
      return item.offsetWidth + marginLeft + marginRight;
    }
    return 350;
  }

  function snapToNearestItem() {
    const scrollAmount = getScrollAmount();
    const currentScroll = scrollContainer.scrollLeft;
    const nearestItemIndex = Math.round(currentScroll / scrollAmount);
    scrollContainer.scrollTo({
      left: nearestItemIndex * scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollContainer.scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      const scrollAmount = getScrollAmount();
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      const scrollAmount = getScrollAmount();
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
  }

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice()) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      scrollContainer.classList.add('grabbing');
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX);
      scrollContainer.scrollLeft = scrollLeft - walk;
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDragging = false;
      scrollContainer.classList.remove('grabbing');
      snapToNearestItem();
    });

    scrollContainer.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        scrollContainer.classList.remove('grabbing');
        snapToNearestItem();
      }
    });
  }

  scrollContainer.addEventListener('scroll', () => {
    clearTimeout(scrollContainer.scrollTimeout);
    scrollContainer.scrollTimeout = setTimeout(snapToNearestItem, 100);
  });

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  window.addEventListener('resize', debounce(() => {
    scrollContainer.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  }, 200));
});

const btnTop = document.getElementById("btn-top");

if (btnTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btnTop.classList.add("show");
    } else {
      btnTop.classList.remove("show");
    }
  });

  btnTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

const popup = document.getElementById("tratamento-popup");
const popupImg = popup.querySelector(".popup-img");
const popupTitle = popup.querySelector(".popup-title");
const popupDescription = popup.querySelector(".popup-description");
const popupClose = popup.querySelector(".popup-close");
const saibaMaisButtons = document.querySelectorAll(".saiba-mais-btn");

let isScrollLocked = false;

function lockScroll() {
  if (isScrollLocked) return;
  isScrollLocked = true;
  document.body.classList.add("no-scroll");
  document.addEventListener('touchmove', preventDefaultScroll, { passive: false });
  document.addEventListener('wheel', preventDefaultScroll, { passive: false });
}

function unlockScroll() {
  if (!isScrollLocked) return;
  isScrollLocked = false;
  document.body.classList.remove("no-scroll");
  document.removeEventListener('touchmove', preventDefaultScroll);
  document.removeEventListener('wheel', preventDefaultScroll);
}

function preventDefaultScroll(e) {
  e.preventDefault();
}

if (popup && popupImg && popupTitle && popupDescription && popupClose) {
  saibaMaisButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      popupImg.src = btn.dataset.img;
      popupImg.alt = btn.dataset.title;
      popupTitle.textContent = btn.dataset.title || "Tratamento";
      popupDescription.textContent = btn.dataset.description || "Descrição do tratamento.";
      popup.classList.add("active");
      lockScroll();
    });
  });

  popupClose.addEventListener("click", () => {
    popup.classList.remove("active");
    unlockScroll();
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
      unlockScroll();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) {
      popup.classList.remove("active");
      unlockScroll();
    }
  });
}

document.querySelectorAll('.footer-col.institucional-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navbarHeight = 70;
      const offset = 30;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});