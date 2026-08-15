/*
  form.js - Multi-step logic and submission for FAKIAH Customer Inquiry Form
*/

let currentStep = 1;
const totalSteps = 5;
let base64File = null;
let fileName = null;
let mimeType = null;

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    initCards();
    initFileUpload();
    initCharCounter();
    updateProgress();
});

function initButtons() {
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep === 4) {
                    populateReview();
                }
                goToStep(currentStep + 1);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    // Form Submission
    const form = document.getElementById('inquiryForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            await submitForm();
        }
    });
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1: return Validation.validateStep1();
        case 2: return Validation.validateStep2();
        case 3: return Validation.validateStep3();
        case 4: return Validation.validateStep4();
        case 5: return Validation.validateStep5();
        default: return true;
    }
}

window.goToStep = function(stepNum) {
    if (stepNum < 1 || stepNum > totalSteps) return;

    // Hide current
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show new
    currentStep = stepNum;
    const newStep = document.getElementById(`step${currentStep}`);
    newStep.classList.add('active');
    
    // Scroll to top of app container smoothly
    document.querySelector('.app-container').scrollIntoView({ behavior: 'smooth' });

    updateProgress();
}

function updateProgress() {
    // Desktop Progress Bar
    const progressFill = document.getElementById('progressFill');
    const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${percent}%`;

    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, idx) => {
        const stepNum = idx + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.innerHTML = '✓';
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.innerHTML = stepNum;
        } else {
            step.innerHTML = stepNum;
        }
    });

    // Mobile Progress
    document.getElementById('mobileProgressText').textContent = `Step ${currentStep} of ${totalSteps}`;
    document.getElementById('mobileProgressFill').style.width = `${((currentStep) / totalSteps) * 100}%`;
}

function initCards() {
    // Add selected class to radio and checkbox cards for styling
    const cards = document.querySelectorAll('.option-card');
    
    cards.forEach(card => {
        const input = card.querySelector('input');
        
        // Initial state
        if (input.checked) card.classList.add('selected');
        
        input.addEventListener('change', () => {
            if (input.type === 'radio') {
                // Remove selected from other radios in same group
                const group = document.querySelectorAll(`input[name="${input.name}"]`);
                group.forEach(r => r.closest('.option-card').classList.remove('selected'));
            }
            
            if (input.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    });
}

function initCharCounter() {
    const desc = document.getElementById('projectDescription');
    const counter = document.getElementById('descCount');
    
    desc.addEventListener('input', () => {
        counter.textContent = desc.value.length;
    });
}

function initFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    const display = document.getElementById('fileNameDisplay');
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            display.textContent = `Attached: ${file.name}`;
            fileName = file.name;
            mimeType = file.type || 'application/octet-stream';
            
            // Read file as Base64 to send via JSON
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result;
                // Extract just the base64 data, ignoring the data URI prefix
                base64File = base64String.split(',')[1];
            };
            reader.readAsDataURL(file);
        } else {
            display.textContent = '';
            base64File = null;
            fileName = null;
            mimeType = null;
        }
    });
}

function populateReview() {
    // Step 1
    document.getElementById('revName').textContent = document.getElementById('fullName').value || '-';
    document.getElementById('revEmail').textContent = document.getElementById('email').value || '-';
    document.getElementById('revCompany').textContent = document.getElementById('company').value || '-';
    
    const contact = document.querySelector('input[name="preferredContact"]:checked');
    document.getElementById('revContact').textContent = contact ? contact.value : '-';

    // Step 2
    const services = Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value);
    document.getElementById('revServices').textContent = services.length > 0 ? services.join(', ') : '-';
    document.getElementById('revTitle').textContent = document.getElementById('projectTitle').value || '-';
    document.getElementById('revDesc').textContent = document.getElementById('projectDescription').value || '-';

    // Step 3
    const formats = Array.from(document.querySelectorAll('input[name="fileFormat"]:checked')).map(cb => cb.value);
    document.getElementById('revFormat').textContent = formats.length > 0 ? formats.join(', ') : 'None specified';
    
    const size = document.querySelector('input[name="dataSize"]:checked');
    document.getElementById('revSize').textContent = size ? size.value : 'Not specified';
    
    document.getElementById('revFile').textContent = fileName ? fileName : 'No file attached';

    // Step 4
    document.getElementById('revDeadline').textContent = document.getElementById('deadline').value || 'Not specified';
    
    const urgency = document.querySelector('input[name="urgency"]:checked');
    document.getElementById('revUrgency').textContent = urgency ? urgency.value : 'Normal';
    
    document.getElementById('revBudget').textContent = document.getElementById('budget').value || 'Not specified';
}

async function submitForm() {
    const submitBtn = document.getElementById('submitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (submitBtn.disabled) return; // Prevent duplicate

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending... ♡';
    loadingOverlay.classList.add('active');

    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        preferredContact: document.querySelector('input[name="preferredContact"]:checked')?.value || '',
        service: Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value),
        projectTitle: document.getElementById('projectTitle').value,
        projectDescription: document.getElementById('projectDescription').value,
        fileFormat: Array.from(document.querySelectorAll('input[name="fileFormat"]:checked')).map(cb => cb.value),
        dataSize: document.querySelector('input[name="dataSize"]:checked')?.value || '',
        deadline: document.getElementById('deadline').value,
        urgency: document.querySelector('input[name="urgency"]:checked')?.value || '',
        budget: document.getElementById('budget').value || '',
        additionalRequirements: document.getElementById('additionalRequirements').value,
        source: document.getElementById('source').value,
        consent: document.getElementById('consent').checked
    };

    if (base64File && fileName && mimeType) {
        data.file = {
            name: fileName,
            mimeType: mimeType,
            content: base64File
        };
    }

    try {
        if (CONFIG.GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            console.warn('Apps Script URL is not configured. Simulating success response.');
            // Simulate network delay
            await new Promise(r => setTimeout(r, 2000));
            showSuccess({ inquiryId: 'FAK-' + new Date().getTime().toString().slice(-6) + '-001' });
            return;
        }

        const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Bypass CORS preflight for Apps Script
            }
        });

        const result = await response.json();
        
        if (result.success) {
            showSuccess(result);
        } else {
            showError();
        }
    } catch (err) {
        console.error('Submission error:', err);
        showError();
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Inquiry ♡';
        loadingOverlay.classList.remove('active');
    }
}

function showSuccess(result) {
    document.getElementById('step5').classList.remove('active');
    document.getElementById('successStep').classList.add('active');
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('mobileProgress').style.display = 'none';
    
    if (result.inquiryId) {
        document.getElementById('inquiryIdDisplay').textContent = result.inquiryId;
    }
    document.querySelector('.app-container').scrollIntoView({ behavior: 'smooth' });
}

function showError() {
    document.getElementById('step5').classList.remove('active');
    document.getElementById('errorStep').classList.add('active');
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('mobileProgress').style.display = 'none';
    document.querySelector('.app-container').scrollIntoView({ behavior: 'smooth' });
}
