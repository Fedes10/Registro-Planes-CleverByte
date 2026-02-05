/* 
╭━━━╮╱╱╱╱╭╮╱╱╱╱╱╱╭╮╭━━━╮
┃╭━━╯╱╱╱╱┃┃╱╱╱╱╱╭╯┃┃╭━╮┃
┃╰━━┳━━┳━╯┣━━┳━━╋╮┃┃┃┃┃┃
┃╭━━┫┃━┫╭╮┃┃━┫━━┫┃┃┃┃┃┃┃
┃┃╱╱┃┃━┫╰╯┃┃━╋━━┣╯╰┫╰━╯┃
╰╯╱╱╰━━┻━━┻━━┻━━┻━━┻━━━╯
╭━━━╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮╱╭╮
┃╭━╮┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃╭╯╰╮
┃┃╱╰╋━━┳━━┳╮╱╭┳━┳┳━━┫╰┻╮╭╯
┃┃╱╭┫╭╮┃╭╮┃┃╱┃┃╭╋┫╭╮┃╭╮┃┃
┃╰━╯┃╰╯┃╰╯┃╰━╯┃┃┃┃╰╯┃┃┃┃╰╮
╰━━━┻━━┫╭━┻━╮╭┻╯╰┻━╮┣╯╰┻━╯
╱╱╱╱╱╱╱┃┃╱╭━╯┃╱╱╱╭━╯┃
╱╱╱╱╱╱╱╰╯╱╰━━╯╱╱╱╰━━╯


© 2026 Federico Lora 
*/

if (false) {

// ============= VARIABLES GLOBALES =============
let selectedPlan = null;
let selectedPrice = null;

// ============= INICIALIZACIÓN =============
document.addEventListener('DOMContentLoaded', function() {
    initializePlanSelection();
    initializeForm();
    initializeAnimations();
    updateProgressSteps();
    initializeBillingToggle();
    updateSidePlanCards();
});

// ============= SELECCIÓN DE PLANES =============
function initializePlanSelection() {
    const planButtons = document.querySelectorAll('.btn-select-plan');
    const planCards = document.querySelectorAll('.plan-card');
    
    // Hacer toda la tarjeta clickeable
    planCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Si ya se hizo clic en el botón, no procesar de nuevo
            if (e.target.classList.contains('btn-select-plan')) {
                return;
            }
            
            const button = this.querySelector('.btn-select-plan');
            const planName = button.getAttribute('data-plan');
            const planPrice = button.getAttribute('data-price');
            
            // Remover selección anterior
            planCards.forEach(c => c.classList.remove('selected'));
            
            // Agregar selección a la tarjeta actual
            this.classList.add('selected');
            
            // Guardar datos del plan
            selectedPlan = planName;
            selectedPrice = planPrice;
            
            // Actualizar información del plan en el formulario
            updateSelectedPlan(planName, planPrice);
            
            // Scroll suave al formulario
            scrollToForm();
        });
    });
    
    // Manejar clics en los botones también
    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevenir que se dispare el evento del card
            
            const planName = this.getAttribute('data-plan');
            const planPrice = this.getAttribute('data-price');
            
            // Remover selección anterior
            planCards.forEach(card => card.classList.remove('selected'));
            
            // Agregar selección a la tarjeta actual
            const currentCard = this.closest('.plan-card');
            currentCard.classList.add('selected');
            
            // Guardar datos del plan
            selectedPlan = planName;
            selectedPrice = planPrice;
            
            // Actualizar información del plan en el formulario
            updateSelectedPlan(planName, planPrice);
            
            // Scroll suave al formulario
            scrollToForm();
        });
    });
}

function updateSelectedPlan(planName, planPrice) {
    const planSummary = document.getElementById('planSummary');
    const planNameElement = document.getElementById('selectedPlanName');
    const planPriceElement = document.getElementById('selectedPlanPrice');
    
    // Capitalizar nombre del plan
    const capitalizedPlanName = planName.charAt(0).toUpperCase() + planName.slice(1);
    
    // Actualizar contenido
    planNameElement.textContent = capitalizedPlanName;
    planPriceElement.textContent = `€${planPrice}/mes`;
    
    // Mostrar el resumen del plan con animación
    planSummary.style.display = 'block';
    planSummary.style.opacity = '0';
    planSummary.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        planSummary.style.transition = 'all 0.5s ease';
        planSummary.style.opacity = '1';
        planSummary.style.transform = 'translateY(0)';
    }, 100);

    updateProgressSteps();
    updateSidePlanCards();
}

function scrollToForm() {
    const formSection = document.getElementById('registro');
    if (formSection) {
        const offset = 100;
        const elementPosition = formSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ============= VALIDACIÓN DEL FORMULARIO =============
function initializeForm() {
    const form = document.getElementById('registrationForm');
    const passwordInput = document.getElementById('contrasena');
    const confirmPasswordInput = document.getElementById('confirmarContrasena');
    
    // Validación en tiempo real
    if (form) {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
                updateProgressSteps();
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
                updateProgressSteps();
            });
        });
        
        // Validación de contraseñas coincidentes
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
            updateProgressSteps();
        });
        
        // Barra de fortaleza de contraseña
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
            updateProgressSteps();
        });
        
        // Envío del formulario
        form.addEventListener('submit', handleFormSubmit);
    }
}

// ============= PROGRESO DE PASOS =============
function updateProgressSteps() {
    const steps = document.querySelectorAll('.progress-steps .step');
    if (!steps.length) return;

    const stepStatus = {
        plan: Boolean(selectedPlan),
        empresa: isCompanySectionComplete(),
        contacto: isContactSectionComplete(),
        contrasena: isPasswordSectionComplete()
    };

    steps.forEach(step => {
        const key = step.getAttribute('data-step');
        const isComplete = Boolean(stepStatus[key]);
        step.classList.toggle('completed', isComplete);
        step.classList.remove('active');
    });

    const firstPending = Array.from(steps).find(step => !step.classList.contains('completed'));
    if (firstPending) {
        firstPending.classList.add('active');
    } else {
        steps[steps.length - 1].classList.add('active');
    }
}

function isCompanySectionComplete() {
    const nombre = document.getElementById('nombreEmpresa');
    const cif = document.getElementById('cif');
    const direccion = document.getElementById('direccion');
    return [nombre, cif, direccion].every(field => field && isFieldValidSilent(field));
}

function isContactSectionComplete() {
    const email = document.getElementById('email');
    return email && isFieldValidSilent(email);
}

function isPasswordSectionComplete() {
    const password = document.getElementById('contrasena');
    const confirm = document.getElementById('confirmarContrasena');
    if (!password || !confirm) return false;
    if (password.value.trim().length < 8 || confirm.value.trim().length < 8) return false;
    return validatePasswordMatch() && isFieldValidSilent(password) && isFieldValidSilent(confirm);
}

function isFieldValidSilent(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    if (field.hasAttribute('required') && value === '') {
        return false;
    }

    switch (fieldName) {
        case 'email':
            return isValidEmail(value);
        case 'cif':
            return isValidCIF(value);
        case 'telefono':
            return value ? isValidPhone(value) : true;
        case 'contrasena':
        case 'confirmarContrasena':
            return value.length >= 8;
        default:
            return true;
    }
}

// ============= BARRA DE FORTALEZA DE CONTRASEÑA =============
function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!strengthFill || !strengthText) return;
    
    // Limpiar clases previas
    strengthFill.className = 'password-strength-fill';
    strengthText.className = 'password-strength-text';
    
    if (password.length === 0) {
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    
    // Calcular fortaleza basada en longitud y complejidad
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Aplicar estilos según fortaleza
    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.classList.add('weak');
        strengthText.textContent = 'Débil';
    } else if (strength <= 3) {
        strengthFill.classList.add('medium');
        strengthText.classList.add('medium');
        strengthText.textContent = 'Media';
    } else {
        strengthFill.classList.add('strong');
        strengthText.classList.add('strong');
        strengthText.textContent = 'Fuerte';
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Limpiar mensajes de error previos
    removeError(field);
    
    // Validación básica de campos requeridos
    if (field.hasAttribute('required') && value === '') {
        showError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Validaciones específicas por tipo
    switch(fieldName) {
        case 'email':
            if (!isValidEmail(value)) {
                showError(field, 'Por favor, introduce un email válido');
                return false;
            }
            break;
            
        case 'cif':
            if (!isValidCIF(value)) {
                showError(field, 'El formato del CIF/NIF no es válido');
                return false;
            }
            break;
            
        case 'telefono':
            if (value && !isValidPhone(value)) {
                showError(field, 'El formato del teléfono no es válido');
                return false;
            }
            break;
            
        case 'contrasena':
            if (value.length < 8) {
                showError(field, 'La contraseña debe tener al menos 8 caracteres');
                return false;
            }
            break;
    }
    
    return true;
}

function validatePasswordMatch() {
    const password = document.getElementById('contrasena').value;
    const confirmPassword = document.getElementById('confirmarContrasena');
    const confirmValue = confirmPassword.value;
    
    removeError(confirmPassword);
    
    if (confirmValue && password !== confirmValue) {
        showError(confirmPassword, 'Las contraseñas no coinciden');
        return false;
    }
    
    return true;
}

function showError(field, message) {
    field.classList.add('error');
    
    // Crear mensaje de error si no existe
    let errorMessage = field.parentElement.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        field.parentElement.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function removeError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

// ============= FUNCIONES DE VALIDACIÓN =============
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCIF(cif) {
    // Validación básica de CIF/NIF español
    const cifRegex = /^[A-Z][0-9]{8}$|^[0-9]{8}[A-Z]$/;
    return cifRegex.test(cif.toUpperCase());
}

function isValidPhone(phone) {
    // Validación básica de teléfono (admite formato internacional)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ============= MANEJO DEL ENVÍO DEL FORMULARIO =============
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const form = e.target;
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validar coincidencia de contraseñas
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    // Verificar que se haya seleccionado un plan
    if (!selectedPlan) {
        alert('Por favor, selecciona un plan antes de continuar');
        scrollToPlanSelection();
        return;
    }
    
    if (isValid) {
        // Recopilar datos del formulario
        const formData = {
            nombreEmpresa: document.getElementById('nombreEmpresa').value,
            cif: document.getElementById('cif').value,
            direccion: document.getElementById('direccion').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value || '',
            contrasena: document.getElementById('contrasena').value,
            plan: selectedPlan,
            precio: selectedPrice
        };
        
        // Mostrar mensaje de éxito
        showSuccessMessage(formData);
        
        // Aquí normalmente enviarías los datos al servidor
        console.log('Datos del formulario:', formData);
    } else {
        // Scroll al primer campo con error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

function scrollToPlanSelection() {
    const plansSection = document.querySelector('.plans-section');
    if (plansSection) {
        plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============= TOGGLE MENSUAL/ANUAL =============
function initializeBillingToggle() {
    const billingToggle = document.getElementById('billingToggle');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const annualLabel = document.getElementById('annualLabel');
    const priceAmounts = document.querySelectorAll('.price-amount');
    const billingNotes = document.querySelectorAll('[data-annual-note]');

    if (!billingToggle || !monthlyLabel || !annualLabel || !priceAmounts.length) return;

    function updateBillingUI() {
        const isAnnual = billingToggle.checked;

        monthlyLabel.classList.toggle('active', !isAnnual);
        annualLabel.classList.toggle('active', isAnnual);

        priceAmounts.forEach(price => {
            const monthly = price.getAttribute('data-monthly');
            const annual = price.getAttribute('data-annual');
            const value = isAnnual ? annual : monthly;
            if (value) {
                price.textContent = `€${value}`;
            }
        });

        billingNotes.forEach(note => {
            note.classList.toggle('is-hidden', !isAnnual);
        });

        updateSidePlanCards();
    }

    billingToggle.addEventListener('change', updateBillingUI);
    monthlyLabel.addEventListener('click', () => {
        billingToggle.checked = false;
        updateBillingUI();
    });
    annualLabel.addEventListener('click', () => {
        billingToggle.checked = true;
        updateBillingUI();
    });

    updateBillingUI();
}

// ============= TARJETAS LATERALES DE PLAN =============
function updateSidePlanCards() {
    const leftCard = document.querySelector('.side-plan-card.side-left');
    const rightCard = document.querySelector('.side-plan-card.side-right');
    if (!leftCard || !rightCard) return;

    const planCard = selectedPlan ? document.querySelector(`.plan-card[data-plan="${selectedPlan}"]`) : null;
    if (!planCard) {
        leftCard.classList.add('is-muted');
        rightCard.classList.add('is-muted');
        return;
    }

    const planName = planCard.querySelector('.plan-name')?.textContent?.trim() || 'Plan';
    const priceElement = planCard.querySelector('.price-amount');
    const monthlyPrice = priceElement?.getAttribute('data-monthly') || selectedPrice || '--';
    const annualPrice = priceElement?.getAttribute('data-annual') || selectedPrice || '--';
    const features = Array.from(planCard.querySelectorAll('.plan-features .feature-item span'))
        .map(el => el.textContent.trim())
        .filter(Boolean);

    const isAnnual = document.getElementById('billingToggle')?.checked;

    hydrateSideCard(leftCard, {
        title: planName,
        price: monthlyPrice,
        note: 'Facturado mensualmente',
        features
    });

    hydrateSideCard(rightCard, {
        title: planName,
        price: annualPrice,
        note: 'Facturado anualmente',
        features
    });

    leftCard.classList.toggle('is-active', !isAnnual);
    rightCard.classList.toggle('is-active', Boolean(isAnnual));
    leftCard.classList.toggle('is-muted', Boolean(isAnnual));
    rightCard.classList.toggle('is-muted', !isAnnual);
}

function hydrateSideCard(card, data) {
    const nameEl = card.querySelector('.side-plan-name');
    const priceEl = card.querySelector('.side-plan-amount');
    const noteEl = card.querySelector('.side-plan-note');
    const listEl = card.querySelector('.side-plan-features');

    if (nameEl) nameEl.textContent = data.title;
    if (priceEl) priceEl.textContent = `€${data.price}`;
    if (noteEl) noteEl.textContent = data.note;

    if (listEl) {
        listEl.innerHTML = '';
        data.features.slice(0, 6).forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            listEl.appendChild(li);
        });
    }
}

function showSuccessMessage(data) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(8, 24, 56, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    // Crear mensaje de éxito
    const successBox = document.createElement('div');
    successBox.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 20px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
    `;
    
    successBox.innerHTML = `
        <svg style="width: 80px; height: 80px; color: #81EB52; margin-bottom: 1.5rem;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
        <h2 style="color: #081838; font-size: 2rem; margin-bottom: 1rem; font-weight: 700;">¡Registro Exitoso!</h2>
        <p style="color: #6B7280; font-size: 1.1rem; margin-bottom: 1.5rem;">
            Hemos recibido tu solicitud de registro para el plan <strong style="color: #0096C6;">${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}</strong>.
        </p>
        <p style="color: #6B7280; margin-bottom: 2rem;">
            Te hemos enviado un email de confirmación a <strong>${data.email}</strong>
        </p>
        <button id="closeSuccess" style="
            background: linear-gradient(135deg, #0096C6 0%, #2ED285 100%);
            color: white;
            border: none;
            padding: 14px 40px;
            border-radius: 10px;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        ">
            Entendido
        </button>
    `;
    
    overlay.appendChild(successBox);
    document.body.appendChild(overlay);
    
    // Cerrar mensaje
    document.getElementById('closeSuccess').addEventListener('click', function() {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(overlay);
            // Redireccionar o resetear formulario
            window.location.href = 'https://app.cleverfactu.com/';
        }, 300);
    });
}

// ============= ANIMACIONES AL SCROLL =============
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const elementsToAnimate = document.querySelectorAll('.plan-card, .form-section');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ============= EFECTOS HOVER EN TARJETAS =============
document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(0) scale(1)';
        } else {
            this.style.transform = 'translateY(0) scale(1.02)';
        }
    });
});

// ============= ANIMACIONES CSS =============
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ============= CONSOLE LOG DE BIENVENIDA =============
console.log('%c¡Bienvenido a CleverFactu! 🚀', 'color: #0096C6; font-size: 20px; font-weight: bold;');
console.log('%cDesarrollado por Federico Lora - CleverByte Consulting', 'color: #2ED285; font-size: 14px;');
console.log('%c© 2026 Todos los derechos reservados', 'color: #6B7280; font-size: 12px;');
}

// ====== SCRIPT DEL NUEVO DISEÑO ======
const currentYear = new Date().getFullYear();
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
    currentYearEl.textContent = currentYear;
}

const verifactuYearElement = document.getElementById("verifactuYear");
if (verifactuYearElement) {
    if (currentYear < 2025) {
        verifactuYearElement.textContent = "2025/2026";
    } else if (currentYear === 2025) {
        verifactuYearElement.textContent = "2025/2026";
    } else {
        verifactuYearElement.textContent = currentYear;
    }
}

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    document.querySelectorAll("#mobileMenu a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
        });
    });
}

const billingToggle = document.getElementById("billingToggle");
const monthlyLabel = document.getElementById("monthlyLabel");
const annualLabel = document.getElementById("annualLabel");
const priceAmounts = document.querySelectorAll(".price-amount");
const billingNotes = document.querySelectorAll(".annual-billing-note");

if (billingToggle && monthlyLabel && annualLabel) {
    const updateBilling = () => {
        const isAnnual = billingToggle.checked;

        if (isAnnual) {
            monthlyLabel.classList.remove("font-semibold", "text-primary-dark");
            monthlyLabel.classList.add("text-text-gray", "font-medium");
            annualLabel.classList.remove("text-text-gray", "font-medium");
            annualLabel.classList.add("font-semibold", "text-primary-dark");
        } else {
            monthlyLabel.classList.add("font-semibold", "text-primary-dark");
            monthlyLabel.classList.remove("text-text-gray", "font-medium");
            annualLabel.classList.add("text-text-gray", "font-medium");
            annualLabel.classList.remove("font-semibold", "text-primary-dark");
        }

        priceAmounts.forEach((priceElement) => {
            const monthlyPrice = priceElement.getAttribute("data-monthly");
            const annualPrice = priceElement.getAttribute("data-annual");
            const newPrice = isAnnual ? annualPrice : monthlyPrice;
            if (newPrice) {
                priceElement.textContent = "€" + newPrice;
            }
        });

        billingNotes.forEach((note) => {
            if (isAnnual) {
                note.classList.remove("invisible");
            } else {
                note.classList.add("invisible");
            }
        });
    };

    billingToggle.addEventListener("change", updateBilling);
    monthlyLabel.addEventListener("click", () => {
        billingToggle.checked = false;
        updateBilling();
    });
    annualLabel.addEventListener("click", () => {
        billingToggle.checked = true;
        updateBilling();
    });

    updateBilling();
}

// ============= FORMULARIOS DE PRUEBA EN PLANES =============
const trialToggles = document.querySelectorAll(".plan-trial-toggle");
const trialForms = document.querySelectorAll(".plan-trial-form-inner");
const trialEmailTarget = "soporte@cleverfactu.com";

const loadEmailTemplate = async () => {
    try {
        const response = await fetch("comprimido.html", { cache: "no-store" });
        if (!response.ok) {
            throw new Error("No se pudo cargar la plantilla");
        }
        return await response.text();
    } catch (error) {
        return `
            <body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:#f3f6f9;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f3f6f9;padding:40px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;box-shadow:0 8px 30px rgba(8,24,56,0.12);max-width:600px;overflow:hidden;">
                                <tr><td style="background-color:#081838;padding:6px 0;"></td></tr>
                                <tr>
                                    <td style="padding:40px;">
                                        <h1 style="margin:0;font-size:24px;color:#081838;">Solicitud de prueba</h1>
                                        <p style="margin:12px 0 0 0;color:#5A6C7D;">Se ha generado una solicitud de prueba.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        `;
    }
};

const normalizeEmailTemplate = (html) => {
    if (html.includes("<html")) return html;
    return `<html><head><meta charset="UTF-8"></head>${html}</html>`;
};

const injectBaseHref = (html) => {
    const baseHref = window.location.href.replace(/[^/]*$/, "");
    if (html.includes("<base")) return html;
    return html.replace(
        "<head>",
        `<head><base href="${baseHref}">`
    );
};

const escapeHtmlAttribute = (value) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const openEmailPreview = (html) => {
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) return;
    const normalized = injectBaseHref(normalizeEmailTemplate(html));
    previewWindow.document.open();
    previewWindow.document.write(normalized);
    previewWindow.document.close();
};

const openDraftWindow = (html, subject) => {
    const draftWindow = window.open("", "_blank");
    if (!draftWindow) return;
    const normalized = injectBaseHref(normalizeEmailTemplate(html));
    const safeSubject = subject.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeSrcdoc = escapeHtmlAttribute(normalized);
    draftWindow.document.open();
    draftWindow.document.write(`
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Redactar correo</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f3f6f9; margin: 0; padding: 20px; }
                    .wrap { max-width: 1040px; margin: 0 auto; background: #fff; border-radius: 14px; box-shadow: 0 10px 30px rgba(8,24,56,0.12); padding: 20px; }
                    .row { display: flex; gap: 12px; margin-bottom: 12px; align-items: center; }
                    label { width: 70px; font-weight: 600; color: #1a2744; }
                    input { flex: 1; border: 1px solid #dbe3ea; border-radius: 10px; padding: 10px 12px; }
                    .editor { border: 1px solid #e3e9ef; border-radius: 12px; padding: 12px; min-height: 520px; background: #fff; }
                    iframe { width: 100%; min-height: 600px; border: none; border-radius: 10px; }
                </style>
            </head>
            <body>
                <div class="wrap">
                    <div class="row"><label>Para</label><input value="${trialEmailTarget}" /></div>
                    <div class="row"><label>Asunto</label><input value="${safeSubject}" /></div>
                    <div id="html" class="editor">
                        <iframe srcdoc="${safeSrcdoc}"></iframe>
                    </div>
                </div>
            </body>
        </html>
    `);
    draftWindow.document.close();
};

const closeTrialCard = (card) => {
    if (!card) return;
    card.classList.remove("is-open");
    card.classList.remove("is-selected");
    const button = card.querySelector(".plan-trial-toggle");
    const formWrapper = card.querySelector(".plan-trial-form");
    if (button) button.setAttribute("aria-expanded", "false");
    if (formWrapper) formWrapper.setAttribute("aria-hidden", "true");
};

const openTrialCard = (card) => {
    if (!card) return;
    document
        .querySelectorAll(".pricing-card.is-open")
        .forEach((openCard) => {
            if (openCard !== card) {
                closeTrialCard(openCard);
            }
        });
    card.classList.add("is-open");
    card.classList.add("is-selected");
    const button = card.querySelector(".plan-trial-toggle");
    const formWrapper = card.querySelector(".plan-trial-form");
    if (button) button.setAttribute("aria-expanded", "true");
    if (formWrapper) formWrapper.setAttribute("aria-hidden", "false");
};

trialToggles.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".pricing-card");
        if (!card) return;

        const isOpen = card.classList.contains("is-open");
        document
            .querySelectorAll(".pricing-card.is-open")
            .forEach((openCard) => {
                if (openCard !== card) {
                    closeTrialCard(openCard);
                }
            });

        if (isOpen) {
            closeTrialCard(card);
        } else {
            openTrialCard(card);
        }
    });
});

document.addEventListener("click", (event) => {
    if (event.target.closest(".pricing-card")) return;
    document
        .querySelectorAll(".pricing-card.is-open")
        .forEach((openCard) => closeTrialCard(openCard));
});

document.querySelectorAll(".pricing-card").forEach((card) => {
    card.addEventListener("click", (event) => {
        const target = event.target;
        if (
            target.closest(".plan-trial-form-inner") ||
            target.closest(".plan-trial-toggle")
        ) {
            return;
        }

        const button = card.querySelector(".plan-trial-toggle");
        if (button) {
            button.click();
        }
    });
});

trialForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const nameInput = form.querySelector('input[name="nombre"]');
        const emailInput = form.querySelector('input[name="email"]');
        const message = form.querySelector(".plan-trial-message");
        const plan = form.getAttribute("data-plan") || "";

        if (!message || !nameInput || !emailInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        message.classList.remove("is-error");

        if (!name || !email || !emailInput.checkValidity()) {
            message.textContent = "Completa nombre y un email válido.";
            message.classList.add("is-error");
            return;
        }

        message.textContent = "Abriendo borrador de correo...";

        const template = await loadEmailTemplate();
        const planValue = plan || "Plan seleccionado";
        const personalizedTemplate = template
            .replace(/\{\{NOMBRE\}\}/g, name)
            .replace(/\{\{EMAIL\}\}/g, email)
            .replace(/\{\{PLAN\}\}/g, planValue)
            .replace(/\{\{NOMBRE_URL\}\}/g, encodeURIComponent(name))
            .replace(/\{\{EMAIL_URL\}\}/g, encodeURIComponent(email))
            .replace(/\{\{PLAN_URL\}\}/g, encodeURIComponent(planValue));
        const normalizedTemplate = normalizeEmailTemplate(personalizedTemplate);

        openDraftWindow(normalizedTemplate, `Solicitud prueba ${plan}`);

        message.textContent = `Solicitud enviada para el plan ${plan}. Te contactaremos pronto.`;
        form.reset();
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href.startsWith("http")) return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
        }
    });
}, observerOptions);

document
    .querySelectorAll(
        ".bg-white.rounded-3xl, .bg-white.rounded-xl, .bg-white.p-10"
    )
    .forEach((el) => {
        observer.observe(el);
    });

document.querySelectorAll(".gradient-cta").forEach((btn) => {
    btn.addEventListener("click", function () {
        console.log("CTA clicked:", this.textContent.trim());
    });
});
