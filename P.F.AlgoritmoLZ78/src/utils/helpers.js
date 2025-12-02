// Funciones genéricas (formato, validación)
// formatBytes(bytes), validateExtension(filename, ext)

// Valida que un archivo tenga una extensión específica.
// @param {File} file - Objeto File del input.
// @param {string} expectedExtension - Extensión esperada (ej: '.txt', '.lz78').
// @returns {boolean} - true si la extensión es válida.
export function validateFileExtension(file, expectedExtension) {
    if (!file || !file.name) return false;
    return file.name.toLowerCase().endsWith(expectedExtension.toLowerCase());
}

// Formatea bytes a un string legible (KB, MB, etc.).
// @param {number} bytes - Número de bytes.
// @returns {string} - String formateado (ej: "1.5 KB").
export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}