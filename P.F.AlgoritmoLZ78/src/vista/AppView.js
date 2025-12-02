import { FileUploadView } from './FileUploadView.js';
import { DictionaryView } from './DictionaryView.js';
import { StatisticsView } from './StatisticsView.js';
import { MessagesView } from './MessagesView.js';
import { TextView } from './TextView.js';

// Vista principal de la aplicación.
// Ensambla todas las vistas y las coloca en el DOM.
export class AppView {
    constructor() {
        // Contenedor raíz
        this.appContainer = document.getElementById('app') || this._createAppContainer();
        
        // Inicializar vistas hijas
        this.fileUploadView = new FileUploadView();
        this.dictionaryView = new DictionaryView();
        this.statisticsView = new StatisticsView();
        this.messagesView = new MessagesView();
        this.textView = new TextView();
        
        // Renderizar la aplicación
        this.render();
    }

    // Crea el contenedor principal si no existe.
    // @returns {HTMLElement} - Contenedor de la aplicación.
    // @private
    _createAppContainer() {
        const container = document.createElement('div');
        container.id = 'app';
        document.body.appendChild(container);
        return container;
    }

    // Renderiza toda la estructura de la aplicación.
    render() {
        this.appContainer.innerHTML = '';

        // 1. Header
        const header = this._createHeader();
        this.appContainer.appendChild(header);

        // 2. Área de subida de archivos
        const uploadSection = this.fileUploadView.render();
        this.appContainer.appendChild(uploadSection);

        // 3. Contenedor principal de resultados (TRES columnas)
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'results-container';

        // Texto (izquierda)
        const textSection = this.textView.render();
        textSection.className = 'text-section';
        resultsContainer.appendChild(textSection);
        
        // Diccionario (centro)
        const dictionarySection = this.dictionaryView.render();
        dictionarySection.className = 'dictionary-section';
        resultsContainer.appendChild(dictionarySection);
        
        // Estadísticas (derecha)
        const statsSection = this.statisticsView.render();
        statsSection.className = 'stats-section';
        resultsContainer.appendChild(statsSection);
        
        this.appContainer.appendChild(resultsContainer);

        // 4. Área de mensajes
        const messagesSection = this.messagesView.render();
        this.appContainer.appendChild(messagesSection);

        // 5. Footer
        const footer = this._createFooter();
        this.appContainer.appendChild(footer);
    }

    // Crea el encabezado de la aplicación.
    // @returns {HTMLElement} - Elemento header.
    // @private
    _createHeader() {
        const header = document.createElement('header');
        header.className = 'app-header';
        
        const title = document.createElement('h1');
        title.textContent = 'Compresor LZ78';
        title.className = 'app-title';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Comprime y descomprime archivos de texto usando el algoritmo LZ78';
        subtitle.className = 'app-subtitle';
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        return header;
    }

    // Crea el pie de página.
    // @returns {HTMLElement} - Elemento footer.
    // @private
    _createFooter() {
        const footer = document.createElement('footer');
        footer.className = 'app-footer';
        
        const footerText = document.createElement('p');
        footerText.innerHTML = '&copy; 2025 - Teoría de la Información - Universidad Distrital';
        footerText.className = 'footer-text';
        
        footer.appendChild(footerText);
        return footer;
    }

    // Métodos para que el controlador actualice vistas específicas

    // Actualiza la vista del diccionario.
    // @param {Array} dictionaryData - Datos del diccionario.
    updateDictionaryView(dictionaryData) {
        this.dictionaryView.update(dictionaryData);
    }

    // Actualiza la vista de texto.
    // @param {string} text - Texto a mostrar.
    // @param {string} title - Título de la sección.
    updateTextView(text, title = 'Texto') {
        this.textView.update(text, title);
    }

    // Actualiza la vista de estadísticas.
    // @param {Object} statsData - Datos estadísticos.
    updateStatisticsView(statsData) {
        this.statisticsView.update(statsData);
    }

    // Muestra un mensaje de éxito.
    // @param {string} message - Mensaje a mostrar.
    showSuccess(message) {
        this.messagesView.showSuccess(message);
    }

    // Muestra un mensaje de error.
    // @param {string} message - Mensaje a mostrar.
    showError(message) {
        this.messagesView.showError(message);
    }

    // Muestra un mensaje informativo.
    // @param {string} message - Mensaje a mostrar.
    showMessage(message) {
        this.messagesView.showInfo(message);
    }

    // Limpia todas las vistas.
    clearAllViews() {
        this.textView.clear();
        this.dictionaryView.clear();
        this.statisticsView.clear();
        this.messagesView.clear();
    }

    // Cambia entre modos de operación.
    // @param {string} mode - 'compress' o 'decompress'.
    switchMode(mode) {
        this.fileUploadView.setMode(mode);
    }

    // Obtiene el elemento del input de archivo.
    // @returns {HTMLInputElement} - Input file.
    getFileInput() {
        return this.fileUploadView.getFileInput();
    }

    // Obtiene el botón de compresión.
    // @returns {HTMLButtonElement} - Botón de comprimir.
    getCompressButton() {
        return this.fileUploadView.getCompressButton();
    }

    // Obtiene el botón de descompresión.
    // @returns {HTMLButtonElement} - Botón de descomprimir.
    getDecompressButton() {
        return this.fileUploadView.getDecompressButton();
    }

    // Obtiene el botón de guardar comprimido.
    // @returns {HTMLButtonElement} - Botón de guardar.
    getSaveCompressedButton() {
        return this.fileUploadView.getSaveCompressedButton();
    }

    // Obtiene el botón de guardar descomprimido.
    // @returns {HTMLButtonElement} - Botón de guardar.
    getSaveDecompressedButton() {
        return this.fileUploadView.getSaveDecompressedButton();
    }

    // Obtiene el botón de reset.
    // @returns {HTMLButtonElement} - Botón de reset.
    getResetButton() {
        return this.fileUploadView.getResetButton();
    }

    // Obtiene los radio buttons de modo.
    // @returns {Object} - Radios de modo.
    getModeRadios() {
        return this.fileUploadView.getModeRadios();
    }
}