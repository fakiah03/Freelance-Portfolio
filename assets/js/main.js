/* 
  main.js - Main functionality for Fakiah's Portfolio 
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };

  // Initial check and event listener for scrolling
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger on load

  // --- Dynamic Year for Footer ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Simple Contact Form Fallback (Mailto creation) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const projectType = document.getElementById('project-type').value;
      const message = document.getElementById('message').value;
      
      const subject = encodeURIComponent(`Freelance Inquiry: ${projectType} from ${name}`);
      const body = encodeURIComponent(`Hi Fakiah,\n\n${message}\n\nBest regards,\n${name}`);
      
      // Open default email client
      window.location.href = `mailto:hello@fakiah.com?subject=${subject}&body=${body}`;
    });
  }
});
