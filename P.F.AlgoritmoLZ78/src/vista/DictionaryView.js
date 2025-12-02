// Vista para mostrar el diccionario LZ78.
export class DictionaryView {
    constructor() {
        this.container = null;
        this.table = null;
    }

    // Renderiza el componente.
    // @returns {HTMLElement} - Sección del diccionario.
    render() {
        const section = document.createElement('section');
        section.className = 'dictionary-view';
        
        const header = document.createElement('h2');
        header.textContent = 'Diccionario LZ78';
        header.className = 'section-header';
        
        const container = document.createElement('div');
        container.id = 'dictionary-container';
        container.className = 'dictionary-container';
        
        section.appendChild(header);
        section.appendChild(container);
        
        this.container = container;
        
        // Mensaje inicial
        this._showPlaceholder();
        
        return section;
    }

    // Actualiza la tabla del diccionario con nuevos datos.
    // @param {Array} dictionaryData - Array de {index, string}.
    update(dictionaryData) {
        if (!dictionaryData || dictionaryData.length === 0) {
            this._showPlaceholder();
            return;
        }

        this.clear();
        
        // Crear tabla
        this.table = document.createElement('table');
        this.table.className = 'dictionary-table';
        
        // Crear encabezado
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const thIndex = document.createElement('th');
        thIndex.textContent = 'Índice';
        
        const thString = document.createElement('th');
        thString.textContent = 'Cadena';
        
        headerRow.appendChild(thIndex);
        headerRow.appendChild(thString);
        thead.appendChild(headerRow);
        this.table.appendChild(thead);
        
        // Crear cuerpo
        const tbody = document.createElement('tbody');
        
        dictionaryData.forEach(entry => {
            const row = document.createElement('tr');
            
            const cellIndex = document.createElement('td');
            cellIndex.textContent = entry.index;
            cellIndex.className = 'index-cell';
            
            const cellString = document.createElement('td');
            cellString.textContent = entry.string || '(vacío)';
            cellString.className = 'string-cell';
            
            row.appendChild(cellIndex);
            row.appendChild(cellString);
            tbody.appendChild(row);
        });
        
        this.table.appendChild(tbody);
        this.container.appendChild(this.table);
        
        // Agregar contador
        const countInfo = document.createElement('div');
        countInfo.className = 'dictionary-count';
        countInfo.textContent = `Mostrando ${dictionaryData.length} entradas en el diccionario`;
        this.container.appendChild(countInfo);
    }

    // Muestra un mensaje cuando no hay diccionario.
    _showPlaceholder() {
        this.clear();
        
        const placeholder = document.createElement('div');
        placeholder.className = 'dictionary-placeholder';
        
        const icon = document.createElement('div');
        icon.className = 'placeholder-icon';
        icon.textContent = '📚';
        
        const message = document.createElement('p');
        message.textContent = 'El diccionario se mostrará aquí después de comprimir o descomprimir un archivo.';
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
        this.table = null;
    }
}