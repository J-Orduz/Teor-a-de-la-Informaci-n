//Modelo para cálculos estadísticos de compresión.
export class Statistics {
    // Calcula estadísticas básicas de compresión.
    // @param {number} originalSize - Tamaño original en bytes.
    // @param {number} compressedSize - Tamaño comprimido en bytes.
    // @returns {Object} - Estadísticas.
    static calculate(originalSize, compressedSize) {
        if (originalSize <= 0 || compressedSize < 0) {
            throw new Error('Los tamaños deben ser números positivos.');
        }

        const spaceSaved = originalSize - compressedSize;
        const compressionRatio = (spaceSaved / originalSize) * 100;
        const compressionEfficiency = compressedSize / originalSize * 100;

        return {
            originalSize,
            compressedSize,
            spaceSaved,
            compressionRatio: parseFloat(compressionRatio.toFixed(2)),
            compressionEfficiency: parseFloat(compressionEfficiency.toFixed(2)),
            // Para mostrar en interfaz:
            originalSizeFormatted: this._formatBytes(originalSize),
            compressedSizeFormatted: this._formatBytes(compressedSize),
            spaceSavedFormatted: this._formatBytes(Math.abs(spaceSaved)),
            isCompressed: spaceSaved > 0
        };
    }

    // Formatea bytes a string legible. 
    // @param {number} bytes - Bytes a formatear.
    // @returns {string} - String formateado.
    static _formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}