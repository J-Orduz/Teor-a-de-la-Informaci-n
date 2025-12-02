import { CompressionController } from './CompressionController.js';
import { DecompressionController } from './DecompressionController.js';

// Controlador principal de la interfaz de usuario.
// Maneja eventos y coordina entre controladores y vistas.
export class UIController {
    constructor(viewManager) {
        this.viewManager = viewManager;
        this.compressionController = new CompressionController(viewManager);
        this.decompressionController = new DecompressionController(viewManager);
        
        // Estado de la aplicación
        this.currentFile = null;
        this.currentMode = null; // 'compress' o 'decompress'
        this.compressionData = null;
        this.decompressionData = null;
        
        this._bindEvents();
    }

    // Vincula eventos del DOM a métodos del controlador.
    // @private
    _bindEvents() {
        // Eventos de compresión
        document.getElementById('compress-btn')?.addEventListener('click', () => this.onCompress());
        document.getElementById('save-compressed-btn')?.addEventListener('click', () => this.onSaveCompressed());
        
        // Eventos de descompresión
        document.getElementById('decompress-btn')?.addEventListener('click', () => this.onDecompress());
        document.getElementById('save-decompressed-btn')?.addEventListener('click', () => this.onSaveDecompressed());
        
        // Eventos de archivo
        document.getElementById('file-input')?.addEventListener('change', (e) => this.onFileSelect(e));
        
        // Eventos de limpieza/reset
        document.getElementById('reset-btn')?.addEventListener('click', () => this.onReset());
        
        // Eventos de modo
        document.getElementById('mode-compress')?.addEventListener('change', () => this.onModeChange('compress'));
        document.getElementById('mode-decompress')?.addEventListener('change', () => this.onModeChange('decompress'));
    }

    // Maneja la selección de archivo.
    // @param {Event} event - Evento change del input file.
    onFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.currentFile = file;
        this.viewManager.showMessage(`Archivo seleccionado: ${file.name}`);
        
        // Habilitar botones según el modo actual
        this._updateUIState();
    }

    // Maneja el cambio entre modos de operación.
    // @param {string} mode - 'compress' o 'decompress'.
    onModeChange(mode) {
        this.currentMode = mode;
        this.viewManager.switchMode(mode);
        this.viewManager.showMessage(`Modo: ${mode === 'compress' ? 'Compresión' : 'Descompresión'}`);
        this._updateUIState();
    }

    // Maneja la acción de compresión.
    async onCompress() {
        if (!this.currentFile || this.currentMode !== 'compress') {
            this.viewManager.showError('Selecciona un archivo .txt y asegúrate de estar en modo compresión.');
            return;
        }

        this.viewManager.clearAllViews();
        this.compressionData = await this.compressionController.compressFile(this.currentFile);
        
        if (this.compressionData) {
            // Habilitar botón de guardar comprimido
            document.getElementById('save-compressed-btn').disabled = false;
        }
    }

    // Maneja la acción de guardar archivo comprimido.
    onSaveCompressed() {
        if (!this.compressionData) {
            this.viewManager.showError('No hay datos comprimidos para guardar.');
            return;
        }

        this.compressionController.saveCompressedFile(
            this.compressionData.compressedString,
            this.compressionData.originalFilename
        );
    }

    // Maneja la acción de descompresión.
    async onDecompress() {
        if (!this.currentFile || this.currentMode !== 'decompress') {
            this.viewManager.showError('Selecciona un archivo .lz78 y asegúrate de estar en modo descompresión.');
            return;
        }

        this.viewManager.clearAllViews();
        this.decompressionData = await this.decompressionController.decompressFile(this.currentFile);
        
        if (this.decompressionData) {
            // Habilitar botón de guardar descomprimido
            document.getElementById('save-decompressed-btn').disabled = false;
        }
    }

    // Maneja la acción de guardar archivo descomprimido.
    onSaveDecompressed() {
        if (!this.decompressionData) {
            this.viewManager.showError('No hay datos descomprimidos para guardar.');
            return;
        }

        this.decompressionController.saveDecompressedFile(
            this.decompressionData.decompressedText,
            this.decompressionData.originalFilename
        );
    }

    // Maneja el reset de la aplicación.
    onReset() {
        this.currentFile = null;
        this.currentMode = null;
        this.compressionData = null;
        this.decompressionData = null;
        
        // Limpiar input de archivo
        document.getElementById('file-input').value = '';
        
        // Resetear controladores
        this.compressionController.reset();
        this.decompressionController.reset();
        
        // Resetear vistas
        this.viewManager.clearAllViews();
        this.viewManager.showMessage('Aplicación reiniciada. Selecciona un archivo para comenzar.');
        
        // Deshabilitar botones de guardar
        document.getElementById('save-compressed-btn').disabled = true;
        document.getElementById('save-decompressed-btn').disabled = true;
    }

    // Actualiza el estado de la UI (habilitar/deshabilitar elementos).
    // @private
    _updateUIState() {
        const hasFile = !!this.currentFile;
        const compressBtn = document.getElementById('compress-btn');
        const decompressBtn = document.getElementById('decompress-btn');
        
        if (compressBtn) {
            compressBtn.disabled = !(hasFile && this.currentMode === 'compress');
        }
        
        if (decompressBtn) {
            decompressBtn.disabled = !(hasFile && this.currentMode === 'decompress');
        }
        
        // Actualizar etiqueta del input file según modo
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            const accept = this.currentMode === 'compress' ? '.txt' : '.lz78';
            fileInput.accept = accept;
            fileInput.title = `Selecciona un archivo ${accept}`;
        }
    }

    // Inicializa la aplicación.
    init() {
        this.viewManager.showMessage('Aplicación LZ78 lista. Selecciona un archivo para comenzar.');
        this.onModeChange('compress'); // Modo por defecto
    }
}