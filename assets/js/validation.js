/*
  validation.js - Form validation helpers for FAKIAH Customer Inquiry Form
*/

const Validation = {
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    showError: (inputElement, show) => {
        const group = inputElement.closest('.form-group');
        if (group) {
            if (show) {
                group.classList.add('has-error');
            } else {
                group.classList.remove('has-error');
            }
        }
    },

    validateStep1: () => {
        let isValid = true;
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');

        if (nameInput.value.trim().length < 2) {
            Validation.showError(nameInput, true);
            isValid = false;
        } else {
            Validation.showError(nameInput, false);
        }

        if (!Validation.isValidEmail(emailInput.value.trim())) {
            Validation.showError(emailInput, true);
            isValid = false;
        } else {
            Validation.showError(emailInput, false);
        }

        return isValid;
    },

    validateStep2: () => {
        let isValid = true;
        
        // Service Selection
        const services = document.querySelectorAll('input[name="service"]:checked');
        const serviceGroup = document.getElementById('serviceOptions').closest('.form-group');
        if (services.length === 0) {
            serviceGroup.classList.add('has-error');
            isValid = false;
        } else {
            serviceGroup.classList.remove('has-error');
        }

        // Project Title
        const titleInput = document.getElementById('projectTitle');
        if (titleInput.value.trim().length === 0) {
            Validation.showError(titleInput, true);
            isValid = false;
        } else {
            Validation.showError(titleInput, false);
        }

        // Project Description
        const descInput = document.getElementById('projectDescription');
        if (descInput.value.trim().length < 20) {
            Validation.showError(descInput, true);
            isValid = false;
        } else {
            Validation.showError(descInput, false);
        }

        return isValid;
    },

    validateStep3: () => {
        let isValid = true;
        const fileInput = document.getElementById('fileUpload');
        
        // Ensure file is < 10MB
        if (fileInput.files.length > 0) {
            const size = fileInput.files[0].size;
            if (size > 10 * 1024 * 1024) { // 10MB
                document.getElementById('fileError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('fileError').style.display = 'none';
            }
        }
        
        return isValid;
    },

    validateStep4: () => {
        // Timeline and budget are optional
        return true;
    },

    validateStep5: () => {
        let isValid = true;
        const consent = document.getElementById('consent');
        if (!consent.checked) {
            Validation.showError(consent, true);
            isValid = false;
        } else {
            Validation.showError(consent, false);
        }
        return isValid;
    }
};
