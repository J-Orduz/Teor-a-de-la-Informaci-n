import { LZ78Compressor } from '../model/LZ78Compressor.js';
import { FileValidator } from '../model/FileValidator.js';
import { Statistics } from '../model/Statistics.js';
import { FileHandler } from '../utils/FileHandler.js';

// Controlador para la compresión de archivos.
// Orquesta: Validación → Compresión → Guardado → Actualización de vistas.
export class CompressionController {
    constructor(viewManager) {
        this.compressor = new LZ78Compressor();
        this.validator = new FileValidator();
        this.viewManager = viewManager; // Para actualizar vistas
    }

    // Procesa la compresión de un archivo de texto.
    // @param {File} file - Archivo .txt a comprimir.
    // @returns {Promise<Object>} - Resultado de la compresión.
    async compressFile(file) {
        try {
            // 1. Validar archivo
            const validation = this.validator.validateTextFile(file);
            if (!validation.isValid) {
                this.viewManager.showError(validation.message);
                return null;
            }

            this.viewManager.showMessage('Leyendo archivo...');

            // 2. Leer contenido del archivo
            const text = await FileHandler.readTextFile(file);
            if (!text || text.trim() === '') {
                this.viewManager.showError('El archivo está vacío o no se pudo leer.');
                return null;
            }

            this.viewManager.showMessage('Comprimiendo con LZ78...');

            // 3. Comprimir texto
            const result = this.compressor.compress(text);
            
            // 4. Calcular estadísticas
            const stats = Statistics.calculate(
                this.compressor.originalSize,
                this.compressor.compressedSize
            );

            // 5. Preparar datos para vista
            const compressionData = {
                originalText: text,
                compressedData: result.compressedData,
                dictionary: result.dictionary,
                compressedString: result.compressedString,
                statistics: stats,
                originalFilename: file.name
            };

            // 6. Actualizar vistas
            this.viewManager.updateDictionaryView(result.dictionary);
            this.viewManager.updateStatisticsView(stats);
            this.viewManager.showSuccess('Compresión completada exitosamente.');

            return compressionData;

        } catch (error) {
            console.error('Error en compresión:', error);
            this.viewManager.showError(`Error al comprimir: ${error.message}`);
            return null;
        }
    }

    // Guarda el archivo comprimido en formato .lz78.
    // @param {string} compressedString - String formateado .lz78.
    // @param {string} originalFilename - Nombre original del archivo.
    saveCompressedFile(compressedString, originalFilename) {
        try {
            if (!compressedString || compressedString.trim() === '') {
                throw new Error('No hay datos comprimidos para guardar.');
            }

            const baseName = originalFilename.replace(/\.[^/.]+$/, ''); // Quitar extensión
            const filename = `${baseName}_compressed.lz78`;
            
            FileHandler.saveAsLZ78File(compressedString, filename);
            this.viewManager.showSuccess(`Archivo guardado como: ${filename}`);

        } catch (error) {
            console.error('Error al guardar archivo comprimido:', error);
            this.viewManager.showError(`Error al guardar: ${error.message}`);
        }
    }

    // Reinicia el estado del controlador.
    reset() {
        this.compressor.reset();
        this.viewManager.clearDictionaryView();
        this.viewManager.clearStatisticsView();
        this.viewManager.clearMessages();
    }
}