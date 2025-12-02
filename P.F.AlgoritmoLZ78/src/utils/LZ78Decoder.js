// Algoritmo puro de decodificación LZ78


// @param {Array} encodedData - Array de objetos {index, char} (salida de encode()).
// @returns {string} - Texto original descomprimido.
// Ejemplo: Entrada: [{index:0,char:'B'}, {index:0,char:'C'}, {index:1,char:'C'}]
//Salida: "BCBC"
export function decode(encodedData) {
    if (!Array.isArray(encodedData)) {
        throw new TypeError('encodedData debe ser un array.');
    }

    const dictionary = new Map();
    dictionary.set(0, ''); // Posición 0 es cadena vacía
    let nextCode = 1;
    let output = '';

    for (const pair of encodedData) {
        const { index, char } = pair;

        if (typeof index !== 'number' || index < 0 || index >= nextCode) {
            throw new Error(`Índice inválido: ${index}. Debe estar entre 0 y ${nextCode - 1}.`);
        }

        // Recuperamos la cadena del diccionario
        const prefix = dictionary.get(index) || '';
        const newString = prefix + char;

        // Añadimos al output
        output += newString;

        // Si la nueva cadena no está vacía, la agregamos al diccionario
        if (newString !== '') {
            dictionary.set(nextCode, newString);
            nextCode++;
        }
    }

    return output;
}


// Convierte un string formateado .lz78 en array de objetos para decode().
// @param {string} lz78String - String en formato "índice,carácter" separado por saltos de línea.
// @returns {Array} - Array de objetos {index, char}.
// Ejemplo: "0,B\n0,C" → [{index:0,char:'B'}, {index:0,char:'C'}]
export function stringToEncoded(lz78String) {
    if (typeof lz78String !== 'string') {
        throw new TypeError('lz78String debe ser una cadena.');
    }

    const lines = lz78String.trim().split('\n');
    return lines.map(line => {
        const [indexStr, char] = line.split(',');
        const index = parseInt(indexStr, 10);

        if (isNaN(index) || index < 0) {
            throw new Error(`Índice inválido en línea: ${line}`);
        }

        return {
            index,
            char: char || '' // Si char es undefined, asumimos cadena vacía
        };
    });
}