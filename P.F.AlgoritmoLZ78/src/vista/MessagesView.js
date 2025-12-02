// Vista para mostrar mensajes al usuario.
export class MessagesView {
    constructor() {
        this.container = null;
        this.messageQueue = [];
        this.currentMessageId = 0;
    }

    // Renderiza el componente.
    // @returns {HTMLElement} - Sección de mensajes.
    render() {
        const section = document.createElement('section');
        section.className = 'messages-view';
        
        const header = document.createElement('h2');
        header.textContent = 'Mensajes';
        header.className = 'section-header';
        
        const container = document.createElement('div');
        container.id = 'messages-container';
        container.className = 'messages-container';
        
        section.appendChild(header);
        section.appendChild(container);
        
        this.container = container;
        
        return section;
    }

    // Muestra un mensaje de éxito.
    // @param {string} text - Texto del mensaje.
    // @param {number} timeout - Tiempo en ms para auto-ocultar (0 = no auto-ocultar).
    showSuccess(text, timeout = 5000) {
        this._addMessage(text, 'success', timeout);
    }

    // Muestra un mensaje de error.
    // @param {string} text - Texto del mensaje.
    // @param {number} timeout - Tiempo en ms para auto-ocultar (0 = no auto-ocultar).
    showError(text, timeout = 0) {
        this._addMessage(text, 'error', timeout);
    }

    // Muestra un mensaje informativo.
    // @param {string} text - Texto del mensaje.
    // @param {number} timeout - Tiempo en ms para auto-ocultar (0 = no auto-ocultar).
    showInfo(text, timeout = 3000) {
        this._addMessage(text, 'info', timeout);
    }

    // Muestra un mensaje de advertencia.
    // @param {string} text - Texto del mensaje.
    // @param {number} timeout - Tiempo en ms para auto-ocultar (0 = no auto-ocultar).
    showWarning(text, timeout = 4000) {
        this._addMessage(text, 'warning', timeout);
    }

    // Añade un mensaje al contenedor.
    // @param {string} text - Texto del mensaje.
    // @param {string} type - Tipo: 'success', 'error', 'info', 'warning'.
    // @param {number} timeout - Tiempo para auto-ocultar.
    _addMessage(text, type, timeout) {
        const messageId = ++this.currentMessageId;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.id = `message-${messageId}`;
        
        // Icono según tipo
        const iconMap = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        const icon = document.createElement('span');
        icon.className = 'message-icon';
        icon.textContent = iconMap[type] || '📢';
        
        const textElement = document.createElement('span');
        textElement.className = 'message-text';
        textElement.textContent = text;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'message-close';
        closeButton.innerHTML = '&times;';
        closeButton.title = 'Cerrar mensaje';
        closeButton.addEventListener('click', () => {
            this._removeMessage(messageId);
        });
        
        messageElement.appendChild(icon);
        messageElement.appendChild(textElement);
        messageElement.appendChild(closeButton);
        
        // Insertar al principio
        if (this.container.firstChild) {
            this.container.insertBefore(messageElement, this.container.firstChild);
        } else {
            this.container.appendChild(messageElement);
        }
        
        // Auto-ocultar si hay timeout
        if (timeout > 0) {
            setTimeout(() => {
                this._removeMessage(messageId);
            }, timeout);
        }
        
        // Mantener solo últimos 5 mensajes
        this.messageQueue.push(messageId);
        if (this.messageQueue.length > 5) {
            const oldId = this.messageQueue.shift();
            const oldMessage = document.getElementById(`message-${oldId}`);
            if (oldMessage && oldMessage.parentNode) {
                oldMessage.remove();
            }
        }
    }

    // Elimina un mensaje por ID.
    // @param {number} messageId - ID del mensaje.
    _removeMessage(messageId) {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement && messageElement.parentNode) {
            messageElement.remove();
            
            // Eliminar de la cola
            const index = this.messageQueue.indexOf(messageId);
            if (index > -1) {
                this.messageQueue.splice(index, 1);
            }
        }
    }

    // Limpia todos los mensajes.
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
            this.messageQueue = [];
        }
    }

    // Obtiene el número de mensajes actuales.
    // @returns {number} - Cantidad de mensajes.
    getMessageCount() {
        return this.messageQueue.length;
    }
}