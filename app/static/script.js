// Variables globales
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let isTyping = false;

// Elementos del DOM
const authContainer = document.getElementById('auth-container');
const chatApp = document.getElementById('chat-app');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const charCount = document.getElementById('charCount');
const loadingOverlay = document.getElementById('loading-overlay');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    if (authToken) {
        validateTokenAndShowChat();
    } else {
        showAuthContainer();
    }
}

function setupEventListeners() {
    // Formularios de autenticación
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Input de mensaje
    messageInput.addEventListener('input', handleMessageInput);
    messageInput.addEventListener('keydown', handleKeyDown);
    
    // Auto-resize del textarea
    messageInput.addEventListener('input', autoResizeTextarea);
}

// Funciones de autenticación
function showLogin() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

function showRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function showAuthContainer() {
    authContainer.style.display = 'flex';
    chatApp.style.display = 'none';
}

function showChatApp() {
    authContainer.style.display = 'none';
    chatApp.style.display = 'flex';
    loadChatHistory();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading(true);
    
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.data.access_token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            
            showToast('Bienvenido de vuelta', 'success');
            showChatApp();
        } else {
            showToast(data.error || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    showLoading(true);
    
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.data.access_token;
            currentUser = data.data.user;
            localStorage.setItem('authToken', authToken);
            
            showToast('¡Hola! Bienvenido', 'success');
            showChatApp();
        } else {
            showToast(data.error || 'Error al crear cuenta', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

async function validateTokenAndShowChat() {
    try {
        const response = await fetch('/auth/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.data;
            showChatApp();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Error validating token:', error);
        logout();
    }
}

async function logout() {
    const confirmed = await showConfirmModal(
        '🚪 Cerrar Sesión',
        '¿Estás seguro de que quieres cerrar tu sesión actual?',
        'Cerrar Sesión',
        'warning'
    );
    
    if (!confirmed) return;
    
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showAuthContainer();
    clearMessages();
    showToast('Sesión cerrada', 'success');
}

// Funciones del chat
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || isTyping) {
        return;
    }
    
    // Deshabilitar input mientras se procesa
    setInputState(false);
    
    // Mostrar mensaje del usuario
    addMessage('user', message);
    
    // Limpiar input
    messageInput.value = '';
    updateCharCount();
    autoResizeTextarea();
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    try {
        const response = await fetch('/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content: message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            // Mostrar respuesta del asistente con efecto de escritura
            addMessageWithTypingEffect('assistant', data.data.assistant_response.content);
        } else {
            hideTypingIndicator();
            
            if (response.status === 401) {
                logout();
                return;
            }
            
            showToast(data.error || 'Error al enviar mensaje', 'error');
            addMessage('assistant', 'Lo siento, ocurrió un error al procesar tu mensaje.');
        }
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        showToast('Error de conexión', 'error');
        addMessage('assistant', 'Lo siento, no pude conectarme al servidor.');
    } finally {
        setInputState(true);
    }
}

function addMessage(role, content) {
    // Remover mensaje de bienvenida si existe
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${formatMessageContent(content)}
            <div class="message-time">${timeString}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function formatMessageContent(content) {
    // Convertir saltos de línea a <br>
    return content.replace(/\n/g, '<br>');
}

function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span>Escribiendo</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

async function loadChatHistory() {
    try {
        const response = await fetch('/chat/history', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const messages = data.data.messages;
            
            // Limpiar contenedor
            clearMessages();
            
            if (messages.length === 0) {
                showWelcomeMessage();
            } else {
                messages.forEach(msg => {
                    addMessageFromHistory(msg.role, msg.content, msg.timestamp);
                });
            }
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function addMessageFromHistory(role, content, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${formatMessageContent(content)}
            <div class="message-time">${timeString}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
}

function showWelcomeMessage() {
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">
                <i class="fas fa-robot"></i>
            </div>
            <h2>¡Hola! Soy tu asistente IA</h2>
            <p>Puedes preguntarme cualquier cosa. Estoy aquí para ayudarte.</p>
        </div>
    `;
}

function clearMessages() {
    messagesContainer.innerHTML = '';
}

async function clearHistory() {
    const confirmed = await showConfirmModal(
        '🗑️ Limpiar Historial',
        '¿Estás seguro de que quieres eliminar todo el historial de chat?',
        'Limpiar',
        'danger'
    );
    
    if (!confirmed) return;
    
    showLoading(true);
    
    try {
        const response = await fetch('/chat/clear', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            clearMessages();
            showWelcomeMessage();
            showToast('Historial limpiado', 'success');
        } else {
            showToast('Error al limpiar historial', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        showLoading(false);
    }
}

// Funciones de utilidad
function handleMessageInput() {
    updateCharCount();
    
    // Habilitar/deshabilitar botón de envío
    const hasContent = messageInput.value.trim().length > 0;
    sendButton.disabled = !hasContent;
}

function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = count;
    
    // Cambiar color si se acerca al límite
    if (count > 4500) {
        charCount.style.color = 'var(--error-color)';
    } else if (count > 4000) {
        charCount.style.color = 'var(--warning-color)';
    } else {
        charCount.style.color = 'var(--text-muted)';
    }
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 128) + 'px';
}

function setInputState(enabled) {
    messageInput.disabled = !enabled;
    sendButton.disabled = !enabled || messageInput.value.trim().length === 0;
    
    if (enabled) {
        messageInput.focus();
    }
}

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
    
    // Permitir cerrar haciendo clic
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

// Funciones para modales de confirmación
function showConfirmModal(title, message, confirmText, type = 'primary') {
    return new Promise((resolve) => {
        // Crear el modal
        const modal = document.createElement('div');
        modal.className = 'confirm-modal-overlay';
        modal.innerHTML = `
            <div class="confirm-modal">
                <div class="confirm-modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="confirm-modal-body">
                    <p>${message}</p>
                </div>
                <div class="confirm-modal-footer">
                    <button class="confirm-btn cancel-btn" onclick="closeConfirmModal(false)">Cancelar</button>
                    <button class="confirm-btn confirm-btn-${type}" onclick="closeConfirmModal(true)">${confirmText}</button>
                </div>
            </div>
        `;
        
        // Función para cerrar el modal
        window.closeConfirmModal = (result) => {
            document.body.removeChild(modal);
            delete window.closeConfirmModal;
            resolve(result);
        };
        
        // Cerrar con ESC o click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                window.closeConfirmModal(false);
            }
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', escHandler);
                if (document.body.contains(modal)) {
                    window.closeConfirmModal(false);
                }
            }
        });
        
        document.body.appendChild(modal);
        
        // Enfocar el botón de confirmar
        setTimeout(() => {
            const confirmBtn = modal.querySelector('.confirm-btn-' + type);
            if (confirmBtn) confirmBtn.focus();
        }, 100);
    });
}

// Función para agregar mensaje con efecto de escritura
function addMessageWithTypingEffect(role, content) {
    // Remover mensaje de bienvenida si existe
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-text"></div>
            <div class="message-time">${timeString}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Efecto de escritura
    const typingElement = messageDiv.querySelector('.typing-text');
    const formattedContent = formatMessageContent(content);
    let currentIndex = 0;
    
    function typeNextCharacter() {
        if (currentIndex < formattedContent.length) {
            // Manejar tags HTML
            if (formattedContent[currentIndex] === '<') {
                const tagEnd = formattedContent.indexOf('>', currentIndex);
                if (tagEnd !== -1) {
                    typingElement.innerHTML += formattedContent.substring(currentIndex, tagEnd + 1);
                    currentIndex = tagEnd + 1;
                } else {
                    typingElement.innerHTML += formattedContent[currentIndex];
                    currentIndex++;
                }
            } else {
                typingElement.innerHTML += formattedContent[currentIndex];
                currentIndex++;
            }
            
            scrollToBottom();
            
            // Velocidad de escritura (5ms por carácter)
            setTimeout(typeNextCharacter, 5);
        }
    }
    
    typeNextCharacter();
}

// Inicializar estado del input
document.addEventListener('DOMContentLoaded', function() {
    if (messageInput) {
        updateCharCount();
        sendButton.disabled = true;
    }
});