// Vista para mostrar estadísticas de compresión/descompresión.
export class StatisticsView {
    constructor() {
        this.container = null;
    }

    // Renderiza el componente.
    // @returns {HTMLElement} - Sección de estadísticas.
    render() {
        const section = document.createElement('section');
        section.className = 'statistics-view';
        
        const header = document.createElement('h2');
        header.textContent = 'Estadísticas';
        header.className = 'section-header';
        
        const container = document.createElement('div');
        container.id = 'statistics-container';
        container.className = 'statistics-container';
        
        section.appendChild(header);
        section.appendChild(container);
        
        this.container = container;
        
        // Mensaje inicial
        this._showPlaceholder();
        
        return section;
    }

    // Actualiza las estadísticas.
    // @param {Object} statsData - Datos estadísticos.
    update(statsData) {
        if (!statsData) {
            this._showPlaceholder();
            return;
        }

        this.clear();
        
        // Crear tarjetas de estadísticas
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'stats-cards';
        
        // Tarjeta 1: Tamaños
        const sizeCard = this._createCard(
            '📊 Tamaños',
            [
                `Original: ${statsData.originalSizeFormatted}`,
                `Comprimido: ${statsData.compressedSizeFormatted}`,
                `Espacio ahorrado: ${statsData.spaceSavedFormatted}`
            ]
        );
        
        // Tarjeta 2: Porcentajes
        const ratioCard = this._createCard(
            '📈 Eficiencia',
            [
                `Porcentaje de compresión: ${statsData.compressionRatio}%`,
                `Eficiencia: ${statsData.compressionEfficiency}%`,
                statsData.isCompressed ? '✅ Compresión efectiva' : '⚠️  Sin compresión'
            ]
        );
        
        cardsContainer.appendChild(sizeCard);
        cardsContainer.appendChild(ratioCard);
        this.container.appendChild(cardsContainer);
        
        // Barra de progreso
        const progressBar = this._createProgressBar(statsData.compressionRatio);
        this.container.appendChild(progressBar);
        
        // Resumen textual
        const summary = document.createElement('div');
        summary.className = 'stats-summary';
        
        if (statsData.isCompressed) {
            summary.textContent = `Se logró una compresión del ${statsData.compressionRatio}%, ahorrando ${statsData.spaceSavedFormatted}.`;
            summary.className += ' success';
        } else {
            summary.textContent = 'No se logró compresión con este archivo.';
            summary.className += ' warning';
        }
        
        this.container.appendChild(summary);
    }

    // Crea una tarjeta de estadísticas.
    // @param {string} title - Título de la tarjeta.
    // @param {Array} items - Lista de items.
    // @returns {HTMLElement} - Elemento de tarjeta.
    _createCard(title, items) {
        const card = document.createElement('div');
        card.className = 'stats-card';
        
        const cardTitle = document.createElement('h3');
        cardTitle.textContent = title;
        cardTitle.className = 'card-title';
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        items.forEach(item => {
            const itemElement = document.createElement('p');
            itemElement.textContent = item;
            itemElement.className = 'card-item';
            cardBody.appendChild(itemElement);
        });
        
        card.appendChild(cardTitle);
        card.appendChild(cardBody);
        
        return card;
    }

    // Crea una barra de progreso.
    // @param {number} percentage - Porcentaje de compresión.
    // @returns {HTMLElement} - Barra de progreso.
    _createProgressBar(percentage) {
        const container = document.createElement('div');
        container.className = 'progress-container';
        
        const label = document.createElement('div');
        label.className = 'progress-label';
        label.textContent = `Nivel de compresión: ${Math.abs(percentage)}%`;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        
        // Limitar entre 0 y 100
        const clampedPercentage = Math.min(Math.max(Math.abs(percentage), 0), 100);
        progressFill.style.width = `${clampedPercentage}%`;
        
        // Color según eficiencia
        if (percentage > 50) {
            progressFill.className += ' excellent';
        } else if (percentage > 20) {
            progressFill.className += ' good';
        } else {
            progressFill.className += ' poor';
        }
        
        progressBar.appendChild(progressFill);
        container.appendChild(label);
        container.appendChild(progressBar);
        
        return container;
    }

    // Muestra un mensaje cuando no hay estadísticas.
    // @private
    _showPlaceholder() {
        this.clear();
        
        const placeholder = document.createElement('div');
        placeholder.className = 'stats-placeholder';
        
        const icon = document.createElement('div');
        icon.className = 'placeholder-icon';
        icon.textContent = '📊';
        
        const message = document.createElement('p');
        message.textContent = 'Las estadísticas se mostrarán aquí después de procesar un archivo.';
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
    }
}