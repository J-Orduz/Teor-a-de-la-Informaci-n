export class FileValidator {
    // Valida un archivo de texto plano.
    // @param {File} file - Objeto File del input.
    // @returns {Object} - { isValid: boolean, message: string }
    validateTextFile(file) {
        if (!file) {
            return { isValid: false, message: 'No se seleccionó ningún archivo.' };
        }

        // Validar extensión
        if (!file.name.toLowerCase().endsWith('.txt')) {
            return { isValid: false, message: 'El archivo debe tener extensión .txt' };
        }

        // Validar tamaño
        if (file.size === 0) {
            return { isValid: false, message: 'El archivo está vacío.' };
        }

        // Validar tipo MIME (opcional, puede variar según navegador)
        if (file.type && !file.type.startsWith('text/')) {
            return { isValid: false, message: 'El archivo no es un archivo de texto válido.' };
        }

        return { isValid: true, message: 'Archivo válido.' };
    }

    // Valida un archivo comprimido .lz78.
    // @param {File} file - Objeto File del input.
    // @returns {Object} - { isValid: boolean, message: string }
    validateLZ78File(file) {
        if (!file) {
            return { isValid: false, message: 'No se seleccionó ningún archivo.' };
        }

        // Validar extensión
        if (!file.name.toLowerCase().endsWith('.lz78')) {
            return { isValid: false, message: 'El archivo debe tener extensión .lz78' };
        }

        // Validar tamaño
        if (file.size === 0) {
            return { isValid: false, message: 'El archivo está vacío.' };
        }

        return { isValid: true, message: 'Archivo .lz78 válido.' };
    }

    // Valida que un string tenga el formato correcto para .lz78.
    // @param {string} content - Contenido del archivo .lz78.
    // @returns {Object} - { isValid: boolean, message: string }
    validateLZ78Content(content) {
        if (typeof content !== 'string') {
            return { isValid: false, message: 'El contenido debe ser una cadena.' };
        }

        const lines = content.trim().split('\n');
        
        if (lines.length === 0) {
            return { isValid: false, message: 'El archivo .lz78 está vacío.' };
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split(',');
            
            if (parts.length !== 2) {
                return { 
                    isValid: false, 
                    message: `Formato incorrecto en línea ${i + 1}. Debe ser "índice,carácter".` 
                };
            }

            const index = parseInt(parts[0], 10);
            if (isNaN(index) || index < 0) {
                return { 
                    isValid: false, 
                    message: `Índice inválido en línea ${i + 1}.` 
                };
            }
        }

        return { isValid: true, message: 'Formato .lz78 válido.' };
    }
}
