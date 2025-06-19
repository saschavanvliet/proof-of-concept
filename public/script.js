window.addEventListener('DOMContentLoaded', () => {
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