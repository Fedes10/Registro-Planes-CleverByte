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

© 2026 Fedes10
CleverFactu - Sistema de Registro Wizard
Versión: 2.0
*/

// ============================================================================
// SISTEMA DE PERSISTENCIA DE ESTADO
// Guarda el paso actual en sessionStorage para mantener el progreso al recargar
// ============================================================================

const WizardState = {
    STORAGE_KEY: 'cleverfactu_wizard_step',
    
    save(step) {
        try {
            sessionStorage.setItem(this.STORAGE_KEY, step.toString());
        } catch (e) {
            console.warn('No se pudo guardar el estado:', e);
        }
    },
    
    load() {
        try {
            const saved = sessionStorage.getItem(this.STORAGE_KEY);
            return saved ? parseInt(saved, 10) : 0;
        } catch (e) {
            console.warn('No se pudo cargar el estado:', e);
            return 0;
        }
    },
    
    clear() {
        try {
            sessionStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.warn('No se pudo limpiar el estado:', e);
        }
    }
};

// ============================================================================
// WIZARD DE REGISTRO - INICIALIZACIÓN PRINCIPAL
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ELEMENTOS DEL DOM ==========
    const panels = Array.from(document.querySelectorAll('.wizard-panel'));
    const btnNext = document.querySelector('.wizard-actions .wizard-btn-next');
    const btnPrev = document.querySelector('.wizard-btn-prev');
    const btnSubmit = document.querySelector('.wizard-btn-submit');
    const progressBar = document.getElementById('progressBar');
    const progressLabel = document.getElementById('progressLabel');
    
    // Verificar existencia de elementos esenciales
    if (!btnNext || panels.length === 0) {
        console.error('Elementos esenciales del wizard no encontrados');
        return;
    }
    
    // ========== VARIABLES DE ESTADO ==========
    let currentStep = WizardState.load(); // Cargar paso guardado
    let datosStep2Intentado = false;
    
    // ========== ICONOS SVG PARA SELECT DE ACTIVIDAD ==========
    const iconosActividad = {
        shop: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/><path d="M3 11h18"/></svg>',
        restaurant: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><path d="M4 3v7a4 4 0 0 0 8 0V3"/><path d="M12 3v7a4 4 0 0 0 8 0V3"/><path d="M5 21h14"/></svg>',
        briefcase: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>',
        construction: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 13V7a5 5 0 0 1 10 0v6"/></svg>',
        tech: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 21h8"/></svg>',
        health: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>',
        education: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M21 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6"/></svg>',
        truck: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="7" width="15" height="13" rx="2"/><path d="M16 17h2a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2"/></svg>',
        home: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9"/><rect x="6" y="12" width="12" height="8" rx="2"/></svg>',
        megaphone: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><path d="M3 11v2a1 1 0 0 0 1 1h2l3 5v-5h4a1 1 0 0 0 1-1v-2"/></svg>',
        consulting: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>',
        factory: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="10" rx="2"/><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>',
        farm: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 16l4-8 4 8"/></svg>',
        other: '<svg width="22" height="22" fill="none" stroke="#0096C6" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
    };
    
    // ========== INICIALIZAR ICONO DE ACTIVIDAD ==========
    const actividadSelect = document.getElementById('actividad');
    const actividadIcon = document.getElementById('actividadIcon');
    
    if (actividadSelect && actividadIcon) {
        function setActividadIcon() {
            const selected = actividadSelect.options[actividadSelect.selectedIndex];
            const iconKey = selected.getAttribute('data-icon');
            actividadIcon.innerHTML = iconosActividad[iconKey] || '';
        }
        actividadSelect.addEventListener('change', setActividadIcon);
        setActividadIcon();
    }
    
    // ========== PASO 1: SELECCIÓN DE TIPO DE USUARIO ==========
    document.querySelectorAll('.user-type-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.user-type-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            btnNext.disabled = false;
            
            // Avanzar automáticamente al paso 2
            setTimeout(() => {
                if (currentStep === 0) goToStep(1);
            }, 300);
        });
    });
    
    // ========== NAVEGACIÓN: BOTÓN SIGUIENTE ==========
    btnNext.addEventListener('click', function() {
        // Paso 0: Verificar selección de tipo de usuario
        if (currentStep === 0 && !document.querySelector('.user-type-card.selected')) {
            return;
        }
        
        // Paso 1: Validar datos antes de avanzar
        if (currentStep === 1) {
            datosStep2Intentado = true;
            
            // Validar email específicamente
            const emailInput = document.getElementById('email');
            if (emailInput && !emailInput.checkValidity()) {
                emailInput.focus();
                const field = emailInput.closest('.wizard-field');
                const avisoPrevio = field && field.querySelector('.wizard-warning-email');
                if (avisoPrevio) avisoPrevio.remove();
                
                if (field && !field.querySelector('.wizard-warning-email')) {
                    const aviso = document.createElement('div');
                    aviso.className = 'wizard-warning wizard-warning-email';
                    aviso.style.color = '#e53e3e';
                    aviso.style.fontSize = '0.97em';
                    aviso.style.marginTop = '4px';
                    aviso.textContent = 'El formato del correo no es correcto';
                    field.appendChild(aviso);
                }
                return;
            } else if (emailInput) {
                const field = emailInput.closest('.wizard-field');
                const avisoPrevio = field && field.querySelector('.wizard-warning-email');
                if (avisoPrevio) avisoPrevio.remove();
            }
            
            // Validar todos los campos
            if (!validateDatosSection(true)) {
                updateProgressBar();
                return;
            }
            
            // Pasar al paso de verificación
            goToStep(2);
            
            // Actualizar email de verificación
            const email = emailInput?.value || '';
            const correoSpan = document.getElementById('verificacionCorreo');
            if (correoSpan && email) correoSpan.textContent = email;
            
            // Habilitar botón de verificación
            const btnNextVerificacion = document.getElementById('btnNextVerificacion');
            if (btnNextVerificacion) {
                btnNextVerificacion.disabled = false;
                btnNextVerificacion.style.opacity = '1';
                btnNextVerificacion.style.pointerEvents = 'auto';
                btnNextVerificacion.style.display = 'block';
                btnNextVerificacion.removeAttribute('disabled');
            }
            
            // Abrir ventana de correo
            openEmailDraft();
            return;
        }
        
        // Avanzar al siguiente paso
        goToStep(currentStep + 1);
    });
    
    // ========== NAVEGACIÓN: BOTÓN ANTERIOR ==========
    btnPrev.addEventListener('click', function() {
        if (currentStep > 0) goToStep(currentStep - 1);
    });
    
    // ========== NAVEGACIÓN: BOTÓN ENVIAR ==========
    if (btnSubmit) {
        btnSubmit.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateFinalSection()) {
                alert('¡Registro completado con éxito!');
                WizardState.clear(); // Limpiar estado guardado
                // Aquí iría la lógica de envío al servidor
            }
        });
    }
    
    
   // ========== FUNCIÓN: CAMBIAR DE PASO ==========
    function goToStep(step) {
        // 1. Guardamos el paso actual en el navegador para que no se pierda al recargar
        localStorage.setItem('wizard_step_saved', step);

        panels.forEach((panel, idx) => {
            if (idx === step) {
                panel.classList.add('active');
                panel.style.display = 'block'; // Asegura visibilidad del panel actual
            } else {
                panel.classList.remove('active');
                panel.style.display = 'none'; // Oculta los demás (elimina botones de inicio en otros pasos)
            }
        });

        currentStep = step;
        updateWizardButtons();
        updateProgressBar();
        updateStepsBar();

        // Si volvemos al paso de datos (paso 1), reseteamos los avisos de error
        if (currentStep === 1) {
            datosStep2Intentado = false;
            if (typeof ocultarAvisosDatosStep2 === 'function') {
                ocultarAvisosDatosStep2();
            }
        }
        
        // Ajuste de altura para el paso de "Completa tu registro" (Paso 3, índice 2)
        if (currentStep === 2) {
            const panelVerificacion = document.querySelector('.wizard-panel[data-panel="2"]');
            if (panelVerificacion) {
                panelVerificacion.style.paddingTop = '10px';
                panelVerificacion.style.paddingBottom = '10px';
                // Si tienes un iframe o editor de correo, esto ayuda a que no sea eterno:
                const editor = panelVerificacion.querySelector('.editor');
                if (editor) editor.style.minHeight = '300px'; 
            }
        }
    }

    // ========== LÓGICA DE INICIO (AÑADIR ESTO AL FINAL DEL DOMCONTENTLOADED) ==========
    // Al recargar, comprobamos si hay un paso guardado
    const savedStep = localStorage.getItem('wizard_step_saved');
    if (savedStep !== null) {
        // Usamos un pequeño timeout para asegurar que todo el HTML está listo
        setTimeout(() => {
            goToStep(parseInt(savedStep));
        }, 100);
    }

    // ========== FUNCIÓN: ACTUALIZAR BOTONES DE NAVEGACIÓN ==========
    function updateWizardButtons() {
        // Botón Anterior: Oculto solo en el paso 0
        btnPrev.style.display = currentStep === 0 ? 'none' : '';
        
        // Botón Siguiente: Oculto en el último paso
        btnNext.style.display = (currentStep < panels.length - 1) ? '' : 'none';
        
        // Botón Finalizar/Enviar: Solo en el último paso
        btnSubmit.style.display = currentStep === panels.length - 1 ? '' : 'none';
        
        // Deshabilitar siguiente si no se ha elegido tipo de usuario en el paso 0
        if (currentStep === 0) {
            const userTypeSelected = document.querySelector('.user-type-card.selected');
            btnNext.disabled = !userTypeSelected;
        } else {
            btnNext.disabled = false;
        }
    }

    // ========== FUNCIÓN: ACTUALIZAR BARRA DE PROGRESO ==========
    function updateProgressBar() {
        let percent = 0;
        
        // Paso 1: Tipo de usuario seleccionado
        const paso1 = document.querySelector('.user-type-card.selected') ? 1 : 0;
        
        // Paso 2: Campos de datos completados
        const requiredStep2 = Array.from(document.querySelectorAll('.wizard-panel[data-panel="1"] input[required], .wizard-panel[data-panel="1"] select[required]'));
        const filledStep2 = requiredStep2.filter(input => input.value && input.value.trim() !== '').length;
        
        // Paso 4: Campos finales completados (Paso de suscripción/envío)
        const requiredStep4 = Array.from(document.querySelectorAll('.wizard-panel[data-panel="3"] input[required], .wizard-panel[data-panel="3"] select[required]'));
        const filledStep4 = requiredStep4.filter(input => {
            if (input.type === 'checkbox') return input.checked;
            return input.value && input.value.trim() !== '';
        }).length;
        
        // Calcular porcentaje basado en campos obligatorios
        const totalFields = 1 + requiredStep2.length + requiredStep4.length;
        const filledFields = paso1 + filledStep2 + filledStep4;
        
        percent = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
        
        if (percent > 100) percent = 100;
        
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
        if (progressLabel) {
            progressLabel.textContent = percent + '% completado';
        }
    }
    
    // ========== FUNCIÓN: ACTUALIZAR BARRA DE PASOS ==========
    function updateStepsBar() {
        const steps = document.querySelectorAll('.wizard-step-bar-item');
        
        steps.forEach((stepEl, idx) => {
            stepEl.classList.remove('active', 'completed', 'blocked');
            
            let allowClick = false;
            
            // Permitir clic en pasos anteriores
            if (idx < currentStep) allowClick = true;
            
            // Permitir paso 2 si tipo de usuario está seleccionado
            if (idx === 1 && currentStep === 0 && document.querySelector('.user-type-card.selected')) {
                allowClick = true;
            }
            
            // Permitir paso 3 si datos están completos
            if (idx === 2) {
                const tipoUsuarioSeleccionado = document.querySelector('.user-type-card.selected');
                if (currentStep >= 2) {
                    allowClick = true;
                } else if (tipoUsuarioSeleccionado && validateDatosSection()) {
                    allowClick = true;
                }
            }
            
            // Aplicar estilos
            stepEl.style.cursor = allowClick ? 'pointer' : 'default';
            
            if (idx < currentStep) {
                stepEl.classList.add('completed');
            } else if (idx === currentStep) {
                stepEl.classList.add('active');
            } else if (idx === steps.length - 1 && currentStep < steps.length - 1) {
                stepEl.classList.add('blocked');
            }
            
            // Manejar clic
            stepEl.onclick = allowClick ? function() {
                // Si va a verificación desde datos, preparar email
                if (idx === 2 && currentStep < 2) {
                    const email = document.getElementById('email')?.value || '';
                    const correoSpan = document.getElementById('verificacionCorreo');
                    if (correoSpan && email) correoSpan.textContent = email;
                    
                    const btnNextVerificacion = document.getElementById('btnNextVerificacion');
                    if (btnNextVerificacion) {
                        btnNextVerificacion.disabled = false;
                        btnNextVerificacion.style.opacity = '1';
                        btnNextVerificacion.style.pointerEvents = 'auto';
                        btnNextVerificacion.style.display = 'block';
                        btnNextVerificacion.removeAttribute('disabled');
                    }
                }
                goToStep(idx);
            } : null;
        });
    }
    
    // ========== FUNCIÓN: OCULTAR AVISOS DEL PASO 2 ==========
    function ocultarAvisosDatosStep2() {
        document.querySelectorAll('[data-panel="1"] .wizard-warning').forEach(el => el.remove());
        document.querySelectorAll('[data-panel="1"] input[required], [data-panel="1"] select[required]').forEach(input => {
            input.classList.remove('error');
        });
        
        const apellidos = document.getElementById('contactoApellidos');
        if (apellidos) apellidos.classList.remove('error');
        
        const actividad = document.getElementById('actividad');
        if (actividad) actividad.classList.remove('error');
    }
    
    // ========== FUNCIÓN: VALIDAR SECCIÓN DE DATOS ==========
    function validateDatosSection(showWarnings = datosStep2Intentado) {
        let valid = true;
        
        // Limpiar advertencias previas
        if (showWarnings) {
            document.querySelectorAll('[data-panel="1"] .wizard-field').forEach(f => {
                const adv = f.querySelector('.wizard-warning');
                if (adv) adv.remove();
            });
        }
        
        // Validar campos requeridos
        document.querySelectorAll('[data-panel="1"] input[required], [data-panel="1"] select[required]').forEach(input => {
            const isVisible = input.offsetParent !== null;
            const isEnabled = !input.disabled;
            
            if (!isVisible || !isEnabled) return;
            
            const field = input.closest('.wizard-field');
            
            if (!input.value || !input.value.trim()) {
                if (showWarnings) {
                    input.classList.add('error');
                    if (field && !field.querySelector('.wizard-warning')) {
                        const aviso = document.createElement('div');
                        aviso.className = 'wizard-warning';
                        aviso.style.color = '#e53e3e';
                        aviso.style.fontSize = '0.97em';
                        aviso.style.marginTop = '4px';
                        aviso.textContent = 'Este campo es obligatorio';
                        field.appendChild(aviso);
                    }
                }
                valid = false;
            } else {
                input.classList.remove('error');
            }
        });
        
        // Validar apellidos
        const apellidos = document.getElementById('contactoApellidos');
        if (apellidos && (!apellidos.value || !apellidos.value.trim())) {
            if (showWarnings) {
                apellidos.classList.add('error');
                const field = apellidos.closest('.wizard-field');
                if (field && !field.querySelector('.wizard-warning')) {
                    const aviso = document.createElement('div');
                    aviso.className = 'wizard-warning';
                    aviso.style.color = '#e53e3e';
                    aviso.style.fontSize = '0.97em';
                    aviso.style.marginTop = '4px';
                    aviso.textContent = 'Este campo es obligatorio';
                    field.appendChild(aviso);
                }
            }
            valid = false;
        } else if (apellidos) {
            apellidos.classList.remove('error');
        }
        
        // Validar select de actividad
        const actividad = document.getElementById('actividad');
        if (actividad && (!actividad.value || actividad.value === '')) {
            if (showWarnings) {
                actividad.classList.add('error');
                const field = actividad.closest('.wizard-field');
                if (field && !field.querySelector('.wizard-warning')) {
                    const aviso = document.createElement('div');
                    aviso.className = 'wizard-warning';
                    aviso.style.color = '#e53e3e';
                    aviso.style.fontSize = '0.97em';
                    aviso.style.marginTop = '4px';
                    aviso.textContent = 'Selecciona una opción';
                    field.appendChild(aviso);
                }
            }
            valid = false;
        } else if (actividad) {
            actividad.classList.remove('error');
        }
        
        return valid;
    }
    
    // ========== FUNCIÓN: VALIDAR SECCIÓN FINAL ==========
    function validateFinalSection() {
        let valid = true;
        
        document.querySelectorAll('[data-panel="3"] select[required], [data-panel="3"] input[required]').forEach(input => {
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    input.classList.add('error');
                    valid = false;
                } else {
                    input.classList.remove('error');
                }
            } else {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    valid = false;
                } else {
                    input.classList.remove('error');
                }
            }
        });
        
        return valid;
    }
    
    // ========== FUNCIÓN: ACTIVAR BOTÓN DE VERIFICACIÓN ==========
    function activarBotonVerificacion() {
        const btnNextVerificacion = document.getElementById('btnNextVerificacion');
        if (btnNextVerificacion) {
            btnNextVerificacion.onclick = null;
            if (panels[2].classList.contains('active')) {
                btnNextVerificacion.disabled = false;
                btnNextVerificacion.style.opacity = '1';
                btnNextVerificacion.style.pointerEvents = 'auto';
                btnNextVerificacion.style.display = 'block';
                btnNextVerificacion.removeAttribute('disabled');
                btnNextVerificacion.onclick = function() {
                    goToStep(3);
                };
            }
        }
    }
    
    // ========== FUNCIÓN: ABRIR BORRADOR DE EMAIL ==========
    function openEmailDraft() {
        const win = window.open('redactar-correo.html', '_blank');
        if (win) {
            win.onload = function() {
                try {
                    const asuntoInput = win.document.querySelector('.row label + input');
                    if (asuntoInput) asuntoInput.value = 'Prueba gratuita de CleverFactu de 15 días';
                    
                    const iframe = win.document.querySelector('.editor iframe');
                    if (iframe) {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        
                        const h1 = doc.querySelector('h1');
                        if (h1) h1.textContent = 'Completa tu registro';
                        
                        const parrafos = doc.querySelectorAll('p');
                        const nombreContacto = document.getElementById('contactoNombre')?.value || '';
                        
                        if (parrafos.length > 0 && nombreContacto) {
                            parrafos[0].innerHTML = 'Hola <strong style="color:#081838;">' + nombreContacto + '</strong>,';
                        }
                        if (parrafos.length > 1) {
                            parrafos[1].innerHTML = 'Hemos recibido tu solicitud de <strong style="color:#0096C6;">prueba gratuita de 15 días</strong>. Para continuar, completa el registro.';
                        }
                        
                        const boton = doc.querySelector('a');
                        if (boton) boton.textContent = 'Confirmar Correo';
                    }
                } catch (e) {
                    console.warn('No se pudo modificar el correo (CORS):', e);
                }
            };
        }
    }
    
    // ========== INICIALIZAR PROVINCIAS Y POBLACIONES ==========
    const provincias = [
        "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", 
        "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", 
        "Ciudad Real", "Córdoba", "La Coruña", "Cuenca", "Gerona", "Granada", 
        "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares", "Jaén", 
        "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Orense", 
        "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", 
        "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria", "Tarragona", 
        "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
    ];
    
    const provinciaSelect = document.getElementById('provincia');
    if (provinciaSelect) {
        provinciaSelect.innerHTML = '<option value="">Selecciona provincia</option>' + 
            provincias.map(p => `<option value="${p}">${p}</option>`).join('');
    }
    
    // ========== ACTUALIZAR PROGRESO AL ESCRIBIR ==========
    document.querySelectorAll('input[required], select[required]').forEach(el => {
        el.addEventListener('input', updateProgressBar);
        el.addEventListener('change', updateProgressBar);
    });
    
    // ========== RESTRICCIÓN DE TELÉFONO ==========
    const telInput = document.getElementById('telefono');
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9+()\-\s]/g, '');
        });
    }
    
    // ========== MANEJO DE CAMPO DE ARCHIVO (LOGO) ==========
    const logoInput = document.getElementById('logoEmpresa');
    const fileLabel = document.querySelector('.wizard-file-label');
    const fileName = document.querySelector('.wizard-file-name');
    const fileText = document.querySelector('.wizard-file-text');
    
    if (logoInput && fileLabel && fileName && fileText) {
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validar tipo de archivo
                if (!file.type.startsWith('image/')) {
                    alert('Por favor, selecciona un archivo de imagen válido.');
                    logoInput.value = '';
                    fileName.textContent = '';
                    fileLabel.classList.remove('has-file');
                    fileText.textContent = 'Seleccionar imagen';
                    return;
                }
                
                // Validar tamaño (máximo 5MB)
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
                    logoInput.value = '';
                    fileName.textContent = '';
                    fileLabel.classList.remove('has-file');
                    fileText.textContent = 'Seleccionar imagen';
                    return;
                }
                
                // Mostrar nombre del archivo
                fileName.textContent = file.name;
                fileLabel.classList.add('has-file');
                fileText.textContent = '✓ Archivo:';
            } else {
                fileName.textContent = '';
                fileLabel.classList.remove('has-file');
                fileText.textContent = 'Seleccionar imagen';
            }
        });
        
        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileLabel.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            fileLabel.addEventListener(eventName, () => {
                fileLabel.style.borderColor = '#0096C6';
                fileLabel.style.background = '#f0f9ff';
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            fileLabel.addEventListener(eventName, () => {
                fileLabel.style.borderColor = '';
                fileLabel.style.background = '';
            }, false);
        });
        
        fileLabel.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                logoInput.files = files;
                logoInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, false);
    }
    
    // ========== TOGGLE DE CONTRASEÑAS ==========
    const togglePasswordsBtn = document.getElementById('toggle-passwords-btn');
    const passwordInput = document.getElementById('password');
    const password2Input = document.getElementById('password2');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (togglePasswordsBtn && passwordInput && password2Input && eyeIcon) {
        let passwordsVisible = false;
        
        togglePasswordsBtn.addEventListener('click', function() {
            passwordsVisible = !passwordsVisible;
            
            if (passwordsVisible) {
                passwordInput.type = 'text';
                password2Input.type = 'text';
                eyeIcon.innerHTML = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/><line x1="4" y1="4" x2="20" y2="20" stroke="#0096C6" stroke-width="2"/>';
            } else {
                passwordInput.type = 'password';
                password2Input.type = 'password';
                eyeIcon.innerHTML = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/>';
            }
        });
    }
    
    // ========== BARRA DE FORTALEZA DE CONTRASEÑA ==========
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const val = this.value;
            const bar = document.getElementById('passwordStrengthBar');
            if (!bar) return;
            
            let score = 0;
            if (val.length >= 8) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;
            
            let color = '#e53e3e';
            if (score === 2) color = '#f1c40f';
            if (score === 3) color = '#2ED285';
            
            bar.style.height = '7px';
            bar.style.borderRadius = '6px';
            bar.style.marginTop = '7px';
            bar.style.background = color;
        });
    }
    
    // ========== INICIALIZACIÓN COMPLETA ==========
    // Restaurar al paso guardado
    goToStep(currentStep);
    updateWizardButtons();
    updateProgressBar();
    updateStepsBar();
    
    console.log('%c✓ Wizard CleverFactu inicializado correctamente', 'color: #2ED285; font-weight: bold;');
});

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================