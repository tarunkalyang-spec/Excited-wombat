// Financing Calculator
function calculatePayment() {
    const vehiclePrice = parseFloat(document.getElementById('vehiclePrice')?.value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment')?.value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate')?.value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm')?.value) || 60;
    const tradeInValue = parseFloat(document.getElementById('tradeInValue')?.value) || 0;
    
    // Calculate loan amount
    const loanAmount = vehiclePrice - downPayment - tradeInValue;
    
    // Calculate monthly payment
    const monthlyRate = (interestRate / 100) / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    // Calculate totals
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;
    
    // Update display
    if (document.getElementById('monthlyPayment')) {
        document.getElementById('monthlyPayment').textContent = `$${monthlyPayment.toFixed(2)}`;
        document.getElementById('loanAmount').textContent = `$${loanAmount.toLocaleString()}`;
        document.getElementById('totalInterest').textContent = `$${totalInterest.toLocaleString()}`;
        document.getElementById('totalPayment').textContent = `$${totalPayment.toLocaleString()}`;
    }
}

// Initialize calculator on page load
if (document.getElementById('calculateBtn')) {
    document.getElementById('calculateBtn').addEventListener('click', calculatePayment);
    
    // Auto-calculate on input change
    const calculatorInputs = ['vehiclePrice', 'downPayment', 'interestRate', 'loanTerm', 'tradeInValue'];
    calculatorInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculatePayment);
        }
    });
    
    // Initial calculation
    calculatePayment();
}

// Trade-in toggle
const tradeInSelect = document.getElementById('tradeIn');
if (tradeInSelect) {
    tradeInSelect.addEventListener('change', function() {
        const tradeInDetails = document.getElementById('tradeInDetails');
        if (this.value === 'yes') {
            tradeInDetails.style.display = 'block';
        } else {
            tradeInDetails.style.display = 'none';
        }
    });
}

// Form submissions
const financeForm = document.getElementById('financeForm');
if (financeForm) {
    financeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Application submitted successfully! We\'ll contact you within 24 hours.');
        this.reset();
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for contacting us! We\'ll get back to you shortly.');
        this.reset();
    });
}

const testDriveForm = document.getElementById('testDriveForm');
if (testDriveForm) {
    testDriveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Test drive scheduled! We\'ll send you a confirmation email.');
        this.reset();
    });
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Filter functionality
const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
let activeFilters = {
    type: [],
    price: [],
    make: [],
    year: [],
    fuel: []
};

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        updateFilters();
        filterVehicles();
    });
});

function updateFilters() {
    // Reset filters
    activeFilters = {
        type: [],
        price: [],
        make: [],
        year: [],
        fuel: []
    };
    
    // Collect active filters
    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const value = checkbox.value;
            // Determine filter category based on parent filter-group
            const filterGroup = checkbox.closest('.filter-group');
            const heading = filterGroup.querySelector('h4').textContent;
            
            if (heading.includes('Type')) activeFilters.type.push(value);
            else if (heading.includes('Price')) activeFilters.price.push(value);
            else if (heading.includes('Make')) activeFilters.make.push(value);
            else if (heading.includes('Year')) activeFilters.year.push(value);
            else if (heading.includes('Fuel')) activeFilters.fuel.push(value);
        }
    });
}

function filterVehicles() {
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    let visibleCount = 0;
    
    vehicleCards.forEach(card => {
        let show = true;
        
        // Check type filter
        if (activeFilters.type.length > 0) {
            const vehicleType = card.getAttribute('data-type');
            if (!activeFilters.type.includes(vehicleType)) {
                show = false;
            }
        }
        
        // Check price filter
        if (activeFilters.price.length > 0 && show) {
            const vehiclePrice = parseInt(card.getAttribute('data-price'));
            let priceMatch = false;
            
            activeFilters.price.forEach(range => {
                if (range === '0-20000' && vehiclePrice < 20000) priceMatch = true;
                if (range === '20000-40000' && vehiclePrice >= 20000 && vehiclePrice < 40000) priceMatch = true;
                if (range === '40000-60000' && vehiclePrice >= 40000 && vehiclePrice < 60000) priceMatch = true;
                if (range === '60000+' && vehiclePrice >= 60000) priceMatch = true;
            });
            
            if (!priceMatch) show = false;
        }
        
        // Show/hide card
        if (show) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    const resultsCount = document.querySelector('.results-count strong');
    if (resultsCount) {
        resultsCount.textContent = visibleCount;
    }
}

// Reset filters button
const resetButton = document.querySelector('.reset-filters');
if (resetButton) {
    resetButton.addEventListener('click', function() {
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateFilters();
        filterVehicles();
        showNotification('Filters reset');
    });
}

// Sort functionality
const sortSelect = document.querySelector('.sort-select');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const vehiclesGrid = document.querySelector('.vehicles-grid');
        const vehicles = Array.from(document.querySelectorAll('.vehicle-card'));
        
        vehicles.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price')) || 0;
            const priceB = parseInt(b.getAttribute('data-price')) || 0;
            
            switch(this.value) {
                case 'Price: Low to High':
                    return priceA - priceB;
                case 'Price: High to Low':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });
        
        // Re-append sorted vehicles
        vehicles.forEach(vehicle => {
            vehiclesGrid.appendChild(vehicle);
        });
        
        showNotification(`Sorted by: ${this.value}`);
    });
}

// View Details buttons
const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
viewDetailsButtons.forEach(button => {
    button.addEventListener('click', function() {
        const vehicleCard = this.closest('.vehicle-card');
        const vehicleName = vehicleCard.querySelector('h3').textContent;
        showNotification(`Viewing details for ${vehicleName}`);
    });
});

// Schedule Test Drive buttons
const scheduleTestButtons = document.querySelectorAll('.schedule-test-btn');
scheduleTestButtons.forEach(button => {
    button.addEventListener('click', function() {
        const vehicleCard = this.closest('.vehicle-card');
        const vehicleName = vehicleCard.querySelector('h3').textContent;
        
        // Scroll to test drive form if on contact page
        const testDriveSection = document.querySelector('.test-drive-section');
        if (testDriveSection) {
            testDriveSection.scrollIntoView({ behavior: 'smooth' });
            // Pre-fill vehicle name
            setTimeout(() => {
                const vehicleInput = document.getElementById('tdVehicle');
                if (vehicleInput) {
                    vehicleInput.value = vehicleName;
                }
            }, 500);
        } else {
            // Redirect to contact page with parameter
            window.location.href = `contact.html?vehicle=${encodeURIComponent(vehicleName)}`;
        }
    });
});

// Check for vehicle parameter in URL (for test drive pre-fill)
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicle = urlParams.get('vehicle');
    
    if (vehicle) {
        const vehicleInput = document.getElementById('tdVehicle');
        if (vehicleInput) {
            vehicleInput.value = decodeURIComponent(vehicle);
            // Scroll to test drive form
            const testDriveSection = document.querySelector('.test-drive-section');
            if (testDriveSection) {
                setTimeout(() => {
                    testDriveSection.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Pagination
const pageButtons = document.querySelectorAll('.page-btn');
pageButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (!this.disabled && !this.classList.contains('active')) {
            // Remove active class from all buttons
            pageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button (if not arrow)
            if (this.textContent !== '«' && this.textContent !== '»') {
                this.classList.add('active');
            }
            
            // Scroll to top of inventory
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            showNotification(`Loading page ${this.textContent}...`);
        }
    });
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Enhanced form validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const emailInputs = this.querySelectorAll('input[type="email"]');
        const phoneInputs = this.querySelectorAll('input[type="tel"]');
        
        let isValid = true;
        
        emailInputs.forEach(input => {
            if (input.value && !validateEmail(input.value)) {
                isValid = false;
                input.style.borderColor = '#e94560';
                showNotification('Please enter a valid email address');
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        phoneInputs.forEach(input => {
            if (input.value && !validatePhone(input.value)) {
                isValid = false;
                input.style.borderColor = '#e94560';
                showNotification('Please enter a valid phone number');
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
});

// Auto-format phone numbers
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                this.value = value;
            } else if (value.length <= 6) {
                this.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                this.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
    });
});

// SSN formatting
const ssnInput = document.getElementById('ssn');
if (ssnInput) {
    ssnInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                this.value = value;
            } else if (value.length <= 5) {
                this.value = `${value.slice(0, 3)}-${value.slice(3)}`;
            } else {
                this.value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 9)}`;
            }
        }
    });
}

// Animate stats on about page
const statBoxes = document.querySelectorAll('.stat-box');
if (statBoxes.length > 0) {
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    statBoxes.forEach(box => {
        observer.observe(box);
    });
}

// Add fade-in animation CSS
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyle);

console.log('AutoPremium website loaded successfully!');