//  Vista para mostrar texto (original o descomprimido).
export class TextView {
    constructor() {
        this.container = null;
        this.textElement = null;
    }

    // Renderiza el componente.
    // @returns {HTMLElement} - Sección de texto.
    render() {
        const section = document.createElement('section');
        section.className = 'text-view';
        
        const header = document.createElement('h2');
        header.textContent = 'Texto';
        header.className = 'section-header';
        
        const container = document.createElement('div');
        container.id = 'text-container';
        container.className = 'text-container';
        
        section.appendChild(header);
        section.appendChild(container);
        
        this.container = container;
        
        // Mensaje inicial
        this._showPlaceholder();
        
        return section;
    }

    // Actualiza el texto mostrado.
    // @param {string} text - Texto a mostrar.
    // @param {string} title - Título opcional (ej: "Texto Original", "Texto Descomprimido").
    update(text, title = 'Texto') {
        if (!text) {
            this._showPlaceholder();
            return;
        }

        this.clear();
        
        // Actualizar título
        const header = this.container.parentElement.querySelector('.section-header');
        if (header) {
            header.textContent = title;
        }
        
        // Crear contenedor de texto
        const textWrapper = document.createElement('div');
        textWrapper.className = 'text-wrapper';
        
        // Contador de caracteres/líneas
        const stats = document.createElement('div');
        stats.className = 'text-stats';
        
        const charCount = text.length;
        const lineCount = text.split('\n').length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        stats.innerHTML = `
            <span>Caracteres: ${charCount.toLocaleString()}</span>
            <span>Palabras: ${wordCount.toLocaleString()}</span>
            <span>Líneas: ${lineCount.toLocaleString()}</span>
        `;
        
        // Área de texto (pre para mantener formato)
        const textArea = document.createElement('pre');
        textArea.className = 'text-content';
        textArea.textContent = text;
        
        // Botón para copiar
        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-secondary copy-btn';
        copyButton.innerHTML = '📋 Copiar texto';
        copyButton.addEventListener('click', () => {
            this._copyToClipboard(text);
        });
        
        // Botón para descargar
        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn btn-secondary download-btn';
        downloadButton.innerHTML = '💾 Descargar como .txt';
        downloadButton.addEventListener('click', () => {
            this._downloadText(text);
        });
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-buttons';
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(downloadButton);
        
        textWrapper.appendChild(stats);
        textWrapper.appendChild(textArea);
        textWrapper.appendChild(buttonContainer);
        
        this.container.appendChild(textWrapper);
        this.textElement = textArea;
    }

    // Copia texto al portapapeles.
    // @param {string} text - Texto a copiar.
    _copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Mostrar feedback (se podría integrar con MessagesView)
            const originalText = this.container.querySelector('.copy-btn').innerHTML;
            this.container.querySelector('.copy-btn').innerHTML = '✅ Copiado!';
            this.container.querySelector('.copy-btn').classList.add('success');
            
            setTimeout(() => {
                this.container.querySelector('.copy-btn').innerHTML = originalText;
                this.container.querySelector('.copy-btn').classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    }

    // Descarga el texto como archivo .txt.
    // @param {string} text - Texto a descargar.
    _downloadText(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'texto_descomprimido.txt';
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Muestra un mensaje cuando no hay texto.
    _showPlaceholder() {
        this.clear();
        
        const placeholder = document.createElement('div');
        placeholder.className = 'text-placeholder';
        
        const icon = document.createElement('div');
        icon.className = 'placeholder-icon';
        icon.textContent = '📝';
        
        const message = document.createElement('p');
        message.textContent = 'El texto se mostrará aquí después de comprimir o descomprimir un archivo.';
        message.className = 'placeholder-message';
        
        placeholder.appendChild(icon);
        placeholder.appendChild(message);
        this.container.appendChild(placeholder);
    }

    // Limpia la vista.
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.textElement = null;
    }

    // Obtiene el texto actualmente mostrado.
    // @returns {string} - Texto actual.
    getText() {
        return this.textElement ? this.textElement.textContent : '';
    }
}