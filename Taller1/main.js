// Este archivo conecta la logica del archivo Huffman.js con la interfaz grafica (index.html)

// Variables globales para almacenar los resultados
let resultadosActuales = null;
let mensajeOriginal = "";

// Función para procesar el mensaje ingresado por el usuario
function procesarMensaje() {
    // Obtener el mensaje del input
    const inputMensaje = document.getElementById('mensaje');
    const frase = inputMensaje.value.trim();
    
    if (frase === "") {
        alert("Por favor, ingrese un mensaje válido.");
        return;
    }
    
    // Guardar el mensaje original
    mensajeOriginal = frase;
    
    // Procesar con Huffman
    const { 
        matriz: matrizResultados, 
        largoMedioTotal: lmt, 
        entropiaTotal: et, 
        eficiencia: eff 
    } = huffman(frase);
    
    // Guardar resultados globalmente
    resultadosActuales = {
        matriz: matrizResultados,
        largoMedioTotal: lmt,
        entropiaTotal: et,
        eficiencia: eff
    };
    
    // Mostrar los resultados en la interfaz
    mostrarMetricas(lmt, et, eff);
    
    // Mostrar información adicional
    mostrarMensajeCodificado(frase, matrizResultados);
    mostrarDiccionario(matrizResultados);
    
    // Mostrar la sección de resultados
    document.getElementById('resultsSection').style.display = 'block';
}

// Función para mostrar las métricas
function mostrarMetricas(largoMedio, entropia, eficiencia) {
    document.getElementById('entropiaTotal').textContent = entropia;
    document.getElementById('largoMedio').textContent = largoMedio;
    document.getElementById('eficiencia').textContent = eficiencia;
}

// Función para mostrar el mensaje codificado
function mostrarMensajeCodificado(mensaje, matriz) {
    // Crear diccionario de códigos
    const diccionarioCodigos = {};
    matriz.forEach(fila => {
        const simbolo = fila[0] === 'espacio' ? ' ' : fila[0];
        const codigo = fila[2];
        diccionarioCodigos[simbolo] = codigo;
    });
    
    // Codificar el mensaje
    let mensajeCodificado = '';
    for (let char of mensaje) {
        mensajeCodificado += diccionarioCodigos[char] || '';
    }
    
    document.getElementById('mensajeCodificado').textContent = mensajeCodificado;
}

// Función para mostrar el diccionario de códigos
function mostrarDiccionario(matriz) {
    const diccionarioDiv = document.getElementById('diccionario');
    diccionarioDiv.innerHTML = '';
    
    matriz.forEach(fila => {
        const simbolo = fila[0];
        const probabilidad = fila[1];
        const codigo = fila[2];
        
        const item = document.createElement('div');
        item.className = 'dictionary-item';
        item.innerHTML = `
            <span class="symbol">${simbolo}</span>
            <span class="code">${codigo}</span>
            <span class="probability">(p=${probabilidad})</span>
        `;
        diccionarioDiv.appendChild(item);
    });
}

// Función para generar y descargar archivo
function generarArchivo() {
    if (!resultadosActuales) {
        alert("Primero debe procesar un mensaje.");
        return;
    }
    
    // Crear contenido del archivo
    let contenido = "=== CODIFICACIÓN HUFFMAN ===\n\n";
    contenido += `Mensaje original: "${mensajeOriginal}"\n`;
    contenido += `Fecha: ${new Date().toLocaleString()}\n\n`;
    
    // Agregar métricas
    contenido += "=== MÉTRICAS ===\n";
    contenido += `Entropía Total: ${resultadosActuales.entropiaTotal} bits\n`;
    contenido += `Largo Medio: ${resultadosActuales.largoMedioTotal} bits/símbolo\n`;
    contenido += `Eficiencia: ${resultadosActuales.eficiencia}%\n\n`;
    
    // Agregar diccionario
    contenido += "=== DICCIONARIO DE CÓDIGOS HUFFMAN ===\n";
    contenido += "Símbolo | Probabilidad | Código Binario | Largo Medio | Entropía\n";
    contenido += "--------|--------------|----------------|-------------|----------\n";
    
    resultadosActuales.matriz.forEach(fila => {
        const simbolo = fila[0].padEnd(7);
        const probabilidad = fila[1].toString().padEnd(12);
        const codigo = fila[2].padEnd(14);
        const largoMedio = fila[3].toString().padEnd(11);
        const entropia = fila[4];
        
        contenido += `${simbolo} | ${probabilidad} | ${codigo} | ${largoMedio} | ${entropia}\n`;
    });
    
    // Agregar mensaje codificado
    contenido += "\n=== MENSAJE CODIFICADO ===\n";
    
    // Crear diccionario de códigos
    const diccionarioCodigos = {};
    resultadosActuales.matriz.forEach(fila => {
        const simbolo = fila[0] === 'espacio' ? ' ' : fila[0];
        const codigo = fila[2];
        diccionarioCodigos[simbolo] = codigo;
    });
    
    // Codificar el mensaje
    let mensajeCodificado = '';
    for (let char of mensajeOriginal) {
        mensajeCodificado += diccionarioCodigos[char] || '';
    }
    
    contenido += `${mensajeCodificado}\n\n`;
    
    // Crear y descargar archivo
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `huffman_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Archivo descargado exitosamente!");
}

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Procesar el mensaje por defecto
    procesarMensaje();
});