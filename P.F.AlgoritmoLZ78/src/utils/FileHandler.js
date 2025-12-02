// Utilidades para manejo de archivos en el navegador.

export class FileHandler {
    // Lee un archivo de texto como string.
    // @param {File} file - Archivo a leer.
    // @returns {Promise<string>} - Contenido del archivo.
    static readTextFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No se proporcionó un archivo.'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Error al leer el archivo.'));
            };
            
            reader.readAsText(file);
        });
    }

    // Guarda un string como archivo .lz78 y lo descarga.
    // @param {string} content - Contenido a guardar.
    // @param {string} filename - Nombre del archivo.
    static saveAsLZ78File(content, filename) {
        this._saveFile(content, filename, 'text/plain');
    }

    // Guarda un string como archivo .txt y lo descarga.
    // @param {string} content - Contenido a guardar.
    // @param {string} filename - Nombre del archivo.
    static saveAsTextFile(content, filename) {
        this._saveFile(content, filename, 'text/plain');
    }

    // Método genérico para guardar archivos.
    // @param {string} content - Contenido del archivo.
    // @param {string} filename - Nombre del archivo.
    // @param {string} mimeType - Tipo MIME.
    // @private
    static _saveFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Limpieza
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}