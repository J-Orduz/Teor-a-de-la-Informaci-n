import { decode, stringToEncoded } from '../utils/LZ78Decoder.js';

// Modelo para la descompresión LZ78.
// Maneja la lógica de descompresión y reconstrucción del diccionario.
export class LZ78Decompressor {
    constructor() {
        this.dictionary = new Map();
        this.decompressedText = '';
        this.compressedSize = 0;
        this.decompressedSize = 0;
        this.encodedData = null;
    }

    // Descomprime datos LZ78.
    // @param {string} lz78String - String en formato "índice,carácter" (contenido de archivo .lz78).
    // @returns {Object} - Objeto con:
    //   - decompressedText: texto original reconstruido
    //   - dictionary: diccionario reconstruido
    //   - encodedData: array de {index, char} parseado
    decompress(lz78String) {
        if (typeof lz78String !== 'string') {
            throw new TypeError('El parámetro lz78String debe ser una cadena.');
        }

        // 1. Calcular tamaño comprimido
        //encodedData = stringToEncoded(lz78String);
        //this.compressedSize = encodedData.length * 2;
        //this.compressedSize = new Blob([lz78String]).size;
        const lines = lz78String.trim().split('\n');
        const pairCount = lines.filter(line => line.trim() !== '').length;
        this.compressedSize = pairCount * 2;

        // 2. Parsear string a datos codificados
        this.encodedData = stringToEncoded(lz78String);

        // 3. Decodificar usando el algoritmo puro
        this.decompressedText = decode(this.encodedData);
        this.decompressedSize = new Blob([this.decompressedText]).size;

        // 4. Reconstruir diccionario para visualización
        this._buildDictionary(this.encodedData);

        return {
            decompressedText: this.decompressedText,
            dictionary: this.getDictionary(),
            encodedData: this.encodedData
        };
    }

    // Reconstruye el diccionario a partir de datos codificados. 
    // @param {Array} encodedData - Array de {index, char}.
    // @private
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

    // Obtiene estadísticas de descompresión.
    // @returns {Object} - Objeto con:
    //   - compressedSize: tamaño comprimido en bytes
    //   - decompressedSize: tamaño descomprimido en bytes
    //   - expansionRatio: porcentaje de expansión (puede ser negativo si hay compresión efectiva)
    getStatistics() {
        if (this.compressedSize === 0) return null;

        const expansionRatio = ((this.decompressedSize - this.compressedSize) / this.compressedSize) * 100;

        return {
            compressedSize: this.compressedSize,
            decompressedSize: this.decompressedSize,
            expansionRatio: parseFloat(expansionRatio.toFixed(2))
        };
    }

    // Reinicia el estado del descompresor.
    reset() {
        this.dictionary.clear();
        this.decompressedText = '';
        this.compressedSize = 0;
        this.decompressedSize = 0;
        this.encodedData = null;
    }
}