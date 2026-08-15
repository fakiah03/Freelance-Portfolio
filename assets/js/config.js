/*
  config.js - Configuration for FAKIAH Customer Inquiry Form
*/

const CONFIG = {
    // Replace this with your Google Apps Script Web App URL after deployment
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxyOGz9-Qgf3oVw2Fx0rYobA2Njb5c0W8B1imQ7S8oda0ysVPSDpnL9z73_Y9COcSyKdg/exec',
    
    // Replace with your portfolio URL
    PORTFOLIO_URL: 'index.html',
    
    // Replace with your contact email
    CONTACT_EMAIL: 'fakiahadnan@gmail.com'
};

// Update UI placeholders
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('portfolioLink').href = CONFIG.PORTFOLIO_URL;
    document.getElementById('backToPortfolio').href = CONFIG.PORTFOLIO_URL;
    document.getElementById('successBackToPortfolio').href = CONFIG.PORTFOLIO_URL;
    document.getElementById('contactDirectly').href = `mailto:${CONFIG.CONTACT_EMAIL}`;
});
