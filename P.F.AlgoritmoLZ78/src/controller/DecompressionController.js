import { LZ78Decompressor } from '../model/LZ78Decompressor.js';
import { FileValidator } from '../model/FileValidator.js';
import { Statistics } from '../model/Statistics.js';
import { FileHandler } from '../utils/FileHandler.js';

// Controlador para la descompresión de archivos .lz78.
// Recibe archivo .lz78 → valida → descomprime → reconstruye texto → actualiza vista.
export class DecompressionController {
    constructor(viewManager) {
        this.decompressor = new LZ78Decompressor();
        this.validator = new FileValidator();
        this.viewManager = viewManager;
    }

    // Procesa la descompresión de un archivo .lz78.
    // @param {File} file - Archivo .lz78 a descomprimir.
    // @returns {Promise<Object>} - Resultado de la descompresión.
    async decompressFile(file) {
        try {
            // 1. Validar archivo .lz78
            const validation = this.validator.validateLZ78File(file);
            if (!validation.isValid) {
                this.viewManager.showError(validation.message);
                return null;
            }

            this.viewManager.showMessage('Leyendo archivo .lz78...');

            // 2. Leer contenido del archivo
            const lz78Content = await FileHandler.readTextFile(file);
            
            // 3. Validar formato interno
            const contentValidation = this.validator.validateLZ78Content(lz78Content);
            if (!contentValidation.isValid) {
                this.viewManager.showError(contentValidation.message);
                return null;
            }

            this.viewManager.showMessage('Descomprimiendo con LZ78...');

            // 4. Descomprimir
            const result = this.decompressor.decompress(lz78Content);
            
            // 5. Calcular estadísticas
            const stats = Statistics.calculate(
                this.decompressor.decompressedSize,
                this.decompressor.compressedSize
            );

            // 6. Preparar datos para vista
            const decompressionData = {
                decompressedText: result.decompressedText,
                dictionary: result.dictionary,
                encodedData: result.encodedData,
                statistics: stats,
                originalFilename: file.name
            };

            // 7. Actualizar vistas
            this.viewManager.updateDictionaryView(result.dictionary);
            this.viewManager.updateStatisticsView(stats);
            this.viewManager.showSuccess('Descompresión completada exitosamente.');

            return decompressionData;

        } catch (error) {
            console.error('Error en descompresión:', error);
            this.viewManager.showError(`Error al descomprimir: ${error.message}`);
            return null;
        }
    }

    // Guarda el texto descomprimido como archivo .txt.
    // @param {string} decompressedText - Texto descomprimido.
    // @param {string} originalFilename - Nombre original del archivo .lz78.
    saveDecompressedFile(decompressedText, originalFilename) {
        try {
            if (!decompressedText || decompressedText.trim() === '') {
                throw new Error('No hay texto descomprimido para guardar.');
            }

            const baseName = originalFilename.replace(/\.[^/.]+$/, ''); // Quitar .lz78
            const filename = `${baseName}_decompressed.txt`;
            
            FileHandler.saveAsTextFile(decompressedText, filename);
            this.viewManager.showSuccess(`Archivo guardado como: ${filename}`);

        } catch (error) {
            console.error('Error al guardar archivo descomprimido:', error);
            this.viewManager.showError(`Error al guardar: ${error.message}`);
        }
    }

    // Reinicia el estado del controlador.
    reset() {
        this.decompressor.reset();
        this.viewManager.clearDictionaryView();
        this.viewManager.clearStatisticsView();
        this.viewManager.clearMessages();
    }
}