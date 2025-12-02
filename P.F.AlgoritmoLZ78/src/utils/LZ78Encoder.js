// Algoritmo puro de codificación LZ78 

///@param {string} text - Texto de entrada a comprimir.
// @returns {Array} - Array de objetos {index, char} representando la salida codificada.
export function encode(text) {
    if (typeof text !== 'string') {
        throw new TypeError('El texto de entrada debe ser una cadena de caracteres.');
    }

    const dictionary = new Map();
    dictionary.set('', 0); // Posición 0 reservada para cadena vacía
    let nextCode = 1;
    let currentPrefix = '';
    const output = [];

    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];
        const currentString = currentPrefix + currentChar;

        // Si la cadena actual ya está en el diccionario, seguimos acumulando
        if (dictionary.has(currentString)) {
            currentPrefix = currentString;
        } else {
            // Agregamos nueva entrada al diccionario
            dictionary.set(currentString, nextCode++);

            // Añadimos al output: (índice del prefijo, carácter nuevo)
            const prefixIndex = dictionary.get(currentPrefix) || 0;
            output.push({
                index: prefixIndex,
                char: currentChar
            });

            // Reiniciamos el prefijo
            currentPrefix = '';
        }
    }

    // Si queda un prefijo al final (caso en que el texto termine con una cadena ya conocida)
    if (currentPrefix !== '') {
        // El último carácter ya está en el diccionario, lo emitimos como (índice, '')
        const prefixIndex = dictionary.get(currentPrefix) || 0;
        output.push({
            index: prefixIndex,
            char: ''
        });
    }

    return output;
}


//Convierte la salida de `encode` en un string formateado para guardar en archivo .lz78.
//@param {Array} encodedData - Array de objetos {index, char} de encode().
// @returns {string} - String en formato "índice,carácter" separado por saltos de línea.
// Ejemplo:[{index:0,char:'B'}, {index:0,char:'C'}] → "0,B\n0,C"
export function encodedToString(encodedData) {
    if (!Array.isArray(encodedData)) {
        throw new TypeError('encodedData debe ser un array.');
    }

    return encodedData.map(pair => {
        // Si char está vacío, lo representamos como cadena vacía
        const char = pair.char === '' ? '' : pair.char;
        return `${pair.index},${char}`;
    }).join('\n');
}