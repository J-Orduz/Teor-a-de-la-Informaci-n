// Vista para la subida de archivos y selección de modo.
export class FileUploadView {
    constructor() {
        this.mode = 'compress'; // Modo por defecto
        this.elements = {};
    }

    // Renderiza el componente.
    // @returns {HTMLElement} - Sección completa.
    render() {
        const section = document.createElement('section');
        section.className = 'file-upload-section';
        
        // 1. Selector de modo
        const modeSelector = this._createModeSelector();
        section.appendChild(modeSelector);
        
        // 2. Input de archivo
        const fileInputArea = this._createFileInputArea();
        section.appendChild(fileInputArea);
        
        // 3. Botones de acción
        const actionButtons = this._createActionButtons();
        section.appendChild(actionButtons);
        
        return section;
    }

    // Crea el selector de modo (compresión/descompresión).
    // @returns {HTMLElement} - Contenedor del selector.
    // @private
    _createModeSelector() {
        const container = document.createElement('div');
        container.className = 'mode-selector';
        
        const label = document.createElement('label');
        label.textContent = 'Selecciona el modo:';
        label.className = 'mode-label';
        
        const modesContainer = document.createElement('div');
        modesContainer.className = 'mode-options';
        
        // Radio para compresión
        const compressOption = document.createElement('div');
        compressOption.className = 'mode-option';
        
        const compressRadio = document.createElement('input');
        compressRadio.type = 'radio';
        compressRadio.id = 'mode-compress';
        compressRadio.name = 'mode';
        compressRadio.value = 'compress';
        compressRadio.checked = true;
        
        const compressLabel = document.createElement('label');
        compressLabel.htmlFor = 'mode-compress';
        compressLabel.textContent = 'Comprimir (.txt → .lz78)';
        
        compressOption.appendChild(compressRadio);
        compressOption.appendChild(compressLabel);
        
        // Radio para descompresión
        const decompressOption = document.createElement('div');
        decompressOption.className = 'mode-option';
        
        const decompressRadio = document.createElement('input');
        decompressRadio.type = 'radio';
        decompressRadio.id = 'mode-decompress';
        decompressRadio.name = 'mode';
        decompressRadio.value = 'decompress';
        
        const decompressLabel = document.createElement('label');
        decompressLabel.htmlFor = 'mode-decompress';
        decompressLabel.textContent = 'Descomprimir (.lz78 → .txt)';
        
        decompressOption.appendChild(decompressRadio);
        decompressOption.appendChild(decompressLabel);
        
        modesContainer.appendChild(compressOption);
        modesContainer.appendChild(decompressOption);
        
        container.appendChild(label);
        container.appendChild(modesContainer);
        
        // Guardar referencias
        this.elements.modeCompress = compressRadio;
        this.elements.modeDecompress = decompressRadio;
        
        return container;
    }

    // Crea el área de input de archivo.
    // @returns {HTMLElement} - Contenedor del input.
    _createFileInputArea() {
        const container = document.createElement('div');
        container.className = 'file-input-area';
        
        const label = document.createElement('label');
        label.textContent = 'Selecciona un archivo:';
        label.className = 'file-input-label';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'file-input-container';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-input';
        fileInput.className = 'file-input';
        fileInput.accept = '.txt'; // Por defecto para compresión
        
        const fileNameDisplay = document.createElement('span');
        fileNameDisplay.id = 'file-name-display';
        fileNameDisplay.className = 'file-name-display';
        fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        
        inputContainer.appendChild(fileInput);
        inputContainer.appendChild(fileNameDisplay);
        
        container.appendChild(label);
        container.appendChild(inputContainer);
        
        // Actualizar nombre del archivo cuando se selecciona
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileNameDisplay.textContent = file.name;
                fileNameDisplay.className = 'file-name-display has-file';
            } else {
                fileNameDisplay.textContent = 'Ningún archivo seleccionado';
                fileNameDisplay.className = 'file-name-display';
            }
        });
        
        // Guardar referencia
        this.elements.fileInput = fileInput;
        this.elements.fileNameDisplay = fileNameDisplay;
        
        return container;
    }

    // Crea los botones de acción.
    // @returns {HTMLElement} - Contenedor de botones.
    _createActionButtons() {
        const container = document.createElement('div');
        container.className = 'action-buttons';
        
        // Botón de comprimir
        const compressBtn = document.createElement('button');
        compressBtn.id = 'compress-btn';
        compressBtn.className = 'btn btn-primary';
        compressBtn.textContent = 'Comprimir';
        compressBtn.disabled = true;
        
        // Botón de descomprimir
        const decompressBtn = document.createElement('button');
        decompressBtn.id = 'decompress-btn';
        decompressBtn.className = 'btn btn-primary';
        decompressBtn.textContent = 'Descomprimir';
        decompressBtn.disabled = true;
        
        // Botón de guardar comprimido
        const saveCompressedBtn = document.createElement('button');
        saveCompressedBtn.id = 'save-compressed-btn';
        saveCompressedBtn.className = 'btn btn-secondary';
        saveCompressedBtn.textContent = 'Guardar Archivo Comprimido';
        saveCompressedBtn.disabled = true;
        
        // Botón de guardar descomprimido
        const saveDecompressedBtn = document.createElement('button');
        saveDecompressedBtn.id = 'save-decompressed-btn';
        saveDecompressedBtn.className = 'btn btn-secondary';
        saveDecompressedBtn.textContent = 'Guardar Archivo Descomprimido';
        saveDecompressedBtn.disabled = true;
        
        // Botón de reset
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-btn';
        resetBtn.className = 'btn btn-warning';
        resetBtn.textContent = 'Reiniciar';
        
        // Agrupar botones
        const primaryButtons = document.createElement('div');
        primaryButtons.className = 'primary-buttons';
        primaryButtons.appendChild(compressBtn);
        primaryButtons.appendChild(decompressBtn);
        
        const secondaryButtons = document.createElement('div');
        secondaryButtons.className = 'secondary-buttons';
        secondaryButtons.appendChild(saveCompressedBtn);
        secondaryButtons.appendChild(saveDecompressedBtn);
        secondaryButtons.appendChild(resetBtn);
        
        container.appendChild(primaryButtons);
        container.appendChild(secondaryButtons);
        
        // Guardar referencias
        this.elements.compressBtn = compressBtn;
        this.elements.decompressBtn = decompressBtn;
        this.elements.saveCompressedBtn = saveCompressedBtn;
        this.elements.saveDecompressedBtn = saveDecompressedBtn;
        this.elements.resetBtn = resetBtn;
        
        return container;
    }

    // Cambia el modo de operación.
    // @param {string} mode - 'compress' o 'decompress'.
    setMode(mode) {
        this.mode = mode;
        
        // Actualizar radio button seleccionado
        if (mode === 'compress') {
            this.elements.modeCompress.checked = true;
            this.elements.fileInput.accept = '.txt';
        } else {
            this.elements.modeDecompress.checked = true;
            this.elements.fileInput.accept = '.lz78';
        }
        
        // Actualizar placeholder del input
        this.elements.fileInput.title = `Selecciona un archivo ${mode === 'compress' ? '.txt' : '.lz78'}`;
    }

    // Métodos para obtener elementos (usados por UIController)

    getFileInput() {
        return this.elements.fileInput;
    }

    getCompressButton() {
        return this.elements.compressBtn;
    }

    getDecompressButton() {
        return this.elements.decompressBtn;
    }

    getSaveCompressedButton() {
        return this.elements.saveCompressedBtn;
    }

    getSaveDecompressedButton() {
        return this.elements.saveDecompressedBtn;
    }

    getResetButton() {
        return this.elements.resetBtn;
    }

    getModeRadios() {
        return {
            compress: this.elements.modeCompress,
            decompress: this.elements.modeDecompress
        };
    }

    // Habilita/deshabilita botones según el estado.
    // @param {boolean} hasFile - Si hay un archivo seleccionado.
    updateButtonState(hasFile) {
        if (this.mode === 'compress') {
            this.elements.compressBtn.disabled = !hasFile;
            this.elements.decompressBtn.disabled = true;
        } else {
            this.elements.decompressBtn.disabled = !hasFile;
            this.elements.compressBtn.disabled = true;
        }
    }
}