// Punto de entrada principal de la aplicación.
// Inicializa el controlador y la vista principal.
import { AppView } from './src/vista/AppView.js';
import { UIController } from './src/controller/UIController.js';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Inicializando aplicación LZ78...');
        
        // 1. Crear la vista principal
        const appView = new AppView();
        
        // 2. Crear el controlador de UI (que crea los otros controladores internamente)
        const uiController = new UIController(appView);
        
        // 3. Inicializar la aplicación
        uiController.init();
        
        // 4. Ocultar pantalla de carga
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
        
        // 5. Exponer para depuración (opcional, quitar en producción)
        window.app = {
            view: appView,
            controller: uiController
        };
        
        console.log('✅ Aplicación LZ78 inicializada correctamente.');
        
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        
        // Mostrar error en pantalla
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="error-screen">
                    <h1>⚠️ Error al cargar la aplicación</h1>
                    <p>${error.message}</p>
                    <p>Por favor, recarga la página o contacta al desarrollador.</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            `;
        }
    }
});

// Manejar errores no capturados
window.addEventListener('error', (event) => {
    console.error('Error no capturado:', event.error);
});

// Manejar promesas rechazadas no capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no capturada:', event.reason);
});