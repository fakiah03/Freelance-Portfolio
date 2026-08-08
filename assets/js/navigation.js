/* 
  navigation.js - Navigation and Menu functionality 
*/

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');
  const navbar = document.querySelector('.navbar');

  // Toggle Mobile Menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (navLinks.classList.contains('active')) {
        hamburger.innerHTML = '✕'; // Simple close icon
      } else {
        hamburger.innerHTML = '☰'; // Simple hamburger icon
      }
    });
  }

  // Close Mobile Menu when a link is clicked
  navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '☰';
      }
    });
  });

  // Sticky Navbar Shrink effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.5rem 0';
      navbar.style.boxShadow = '0 4px 10px rgba(91, 58, 130, 0.05)';
    } else {
      navbar.style.padding = '1rem 0';
      navbar.style.boxShadow = 'none';
    }
    
    // Active section highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinksItems.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  });
});
