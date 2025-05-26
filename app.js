const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list a");

const scrollContainer = document.getElementById("tratamentos-scroll");
const tratamentoItems = scrollContainer.querySelectorAll('.tratamento-item');
tratamentoItems.forEach(item => {
  item.draggable = false;
});

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
  const expanded = nav.classList.contains("active");
  hamburger.setAttribute("aria-expanded", expanded);
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    hamburger.setAttribute("aria-expanded", false);
  });
});

const slides = document.querySelectorAll(".carousel-img");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

if (slides.length > 0) {
  showSlide(current);
}

nextBtn.addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

prevBtn.addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
});

if (!window.carouselInterval) {
  window.carouselInterval = setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
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

const btnLeft = document.querySelector(".scroll-btn.left");
const btnRight = document.querySelector(".scroll-btn.right");

let isDragging = false;
let startX, scrollLeft;

scrollContainer.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
  scrollContainer.style.cursor = "grabbing";
});

scrollContainer.addEventListener("mouseleave", () => {
  isDragging = false;
  scrollContainer.style.cursor = "grab";
});

scrollContainer.addEventListener("mouseup", () => {
  isDragging = false;
  scrollContainer.style.cursor = "grab";
});

scrollContainer.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 3;
  scrollContainer.scrollLeft = scrollLeft - walk;
});

scrollContainer.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener("touchend", () => {
  isDragging = false;
});

scrollContainer.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const x = e.touches[0].pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 2;
  scrollContainer.scrollLeft = scrollLeft - walk;
});

document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('tratamentos-scroll');
  const leftBtn = document.querySelector('.scroll-btn.left');
  const rightBtn = document.querySelector('.scroll-btn.right');

  function getScrollAmount() {
    const item = scrollContainer.querySelector('.tratamento-item');
    if (item) {
      const styles = window.getComputedStyle(item);
      const marginLeft = parseFloat(styles.marginLeft) || 0;
      const marginRight = parseFloat(styles.marginRight) || 0;
      return item.getBoundingClientRect().width + marginLeft + marginRight + 10;
    }
    return 350 + 10;
  }

  scrollContainer.scrollTo({
    left: 0,
    behavior: 'smooth'
  });

  leftBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
      left: -getScrollAmount(),
      behavior: 'smooth'
    });
  });

  rightBtn.addEventListener('click', () => {
    scrollContainer.scrollBy({
      left: getScrollAmount(),
      behavior: 'smooth'
    });
  });

  window.addEventListener('resize', () => {
    scrollContainer.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  });
});

const btnTop = document.getElementById("btn-top");

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

const popup = document.getElementById("tratamento-popup");
const popupImg = popup.querySelector(".popup-img");
const popupTitle = popup.querySelector(".popup-title");
const popupDescription = popup.querySelector(".popup-description");
const popupClose = popup.querySelector(".popup-close");
const saibaMaisButtons = document.querySelectorAll(".saiba-mais-btn");

function lockScroll() {
  document.body.classList.add("no-scroll");
  document.addEventListener('touchmove', preventDefaultScroll, { passive: false });
  document.addEventListener('wheel', preventDefaultScroll, { passive: false });
}

function unlockScroll() {
  document.body.classList.remove("no-scroll");
  document.removeEventListener('touchmove', preventDefaultScroll);
  document.removeEventListener('wheel', preventDefaultScroll);
}

function preventDefaultScroll(e) {
  e.preventDefault();
}

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

document.querySelectorAll('.footer-col.institucional-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    const navbarHeight = 70;
    const offset = 30;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});