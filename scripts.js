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

// ============= VARIABLES GLOBALES =============
let selectedPlan = null;
let selectedPrice = null;

// ============= INICIALIZACIÓN =============
document.addEventListener('DOMContentLoaded', function() {
    initializePlanSelection();
    initializeForm();
    initializeAnimations();
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
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        // Validación de contraseñas coincidentes
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
        
        // Barra de fortaleza de contraseña
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
        
        // Envío del formulario
        form.addEventListener('submit', handleFormSubmit);
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
