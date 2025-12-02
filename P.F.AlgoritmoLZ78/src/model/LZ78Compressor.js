import { encode, encodedToString } from '../utils/LZ78Encoder.js';

// Modelo para la compresión LZ78.
// Maneja la lógica de compresión, generación de diccionario y estadísticas.
export class LZ78Compressor {
    constructor() {
        this.dictionary = new Map();
        this.compressedData = null;
        this.originalText = '';
        this.originalSize = 0;
        this.compressedSize = 0;
    }

    // Comprime un texto usando LZ78. 
    // @param {string} text - Texto a comprimir.
    compress(text) {
        if (typeof text !== 'string') {
            throw new TypeError('El parámetro text debe ser una cadena.');
        }

        this.originalText = text;
        this.originalSize = new Blob([text]).size; // Tamaño en bytes

        // 1. Codificar usando el algoritmo puro
        const encoded = encode(text);
        this.compressedData = encoded;

        // 2. Reconstruir diccionario para visualización
        this._buildDictionary(encoded);

        // 3. Calcular tamaño comprimido
        const compressedString = encodedToString(encoded);
        this.compressedSize = encoded.length * 2;
       //this.compressedSize = new Blob([compressedString]).size;

        return {
            compressedData: this.compressedData,
            dictionary: this.getDictionary(),
            compressedString: compressedString
        };
    }

    //Reconstruye el diccionario a partir de los datos codificados. 
    // @param {Array} encodedData - Array de {index, char} de encode().
    _buildDictionary(encodedData) {
        this.dictionary.clear();
        this.dictionary.set(0, ''); // Posición 0: cadena vacía

        let nextCode = 1;
        for (const pair of encodedData) {
            const { index, char } = pair;
            const prefix = this.dictionary.get(index) || '';
            const newString = prefix + char;

            if (newString !== '' && !Array.from(this.dictionary.values()).includes(newString)) {
                this.dictionary.set(nextCode, newString);
                nextCode++;
            }
        }
    }

    // Obtiene el diccionario en formato de array para fácil visualización. 
    // @returns {Array} - Array de objetos {index, string}.
    getDictionary() {
        return Array.from(this.dictionary.entries())
            .map(([index, str]) => ({ index, string: str }))
            .sort((a, b) => a.index - b.index);
    }

    // Obtiene estadísticas de compresión.
    // @returns {Object} - Objeto con:
    //   - originalSize: tamaño original en bytes
    //   - compressedSize: tamaño comprimido en bytes
    //   - compressionRatio: porcentaje de compresión (0-100)
    //   - spaceSaved: bytes ahorrados
    getStatistics() {
        if (this.originalSize === 0) return null;

        const compressionRatio = ((this.originalSize - this.compressedSize) / this.originalSize) * 100;
        const spaceSaved = this.originalSize - this.compressedSize;

        return {
            originalSize: this.originalSize,
            compressedSize: this.compressedSize,
            compressionRatio: parseFloat(compressionRatio.toFixed(2)),
            spaceSaved: spaceSaved
        };
    }

    // Reinicia el estado del compresor.
    reset() {
        this.dictionary.clear();
        this.compressedData = null;
        this.originalText = '';
        this.originalSize = 0;
        this.compressedSize = 0;
    }
}