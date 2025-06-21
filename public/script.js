// Animatie popup verdwijnen na 10 seconden - feedback geslaagde POST
window.addEventListener('DOMContentLoaded', function () {
    const popup = document.querySelector('.contact-popup');
    if (popup) {
      setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
          popup.style.display = 'none';
        }, 1000); 
      }, 10000);
    }
  });

// Loading state gemaakt voor button op de POST
const form = document.querySelector('.contact-form');
const submitButton = document.querySelector('.button-contact-submit');

  form.addEventListener('submit', function () {     // Er wordt op het formulier een event toegevoegd (submit) en wanneer iemand op versturen klikt, wordt de loading class toegevoegd.
    submitButton.classList.add('loading');
  });

document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header-nav');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {      // ------> Feature detection
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});
