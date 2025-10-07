function contarLetras(texto) {
    const contador = {};
    
    for (let letra of texto) {
        contador[letra] = (contador[letra] || 0) + 1;
    }
    
    return contador;
}

function calcularProbabilidades(resultadoConteo, totalSimbolos) {
    const probabilidades = [];
    
    for (let letra in resultadoConteo) {
        const frecuencia = resultadoConteo[letra];
        const probabilidad = Number((frecuencia / totalSimbolos)).toFixed(3);
        
        probabilidades.push({
            simbolo: letra,
            frecuencia: frecuencia,
            probabilidad: Number(probabilidad)
        });
    }
    
    // Ordenar por probabilidad (mayor a menor)
    return probabilidades.sort((a, b) => {
            if (a.probabilidad !== b.probabilidad) {
                return b.probabilidad - a.probabilidad;
            }
            return probabilidades.indexOf(b) - probabilidades.indexOf(a);
        });
}

// Árbol de Huffman
function construirArbolHuffman(probabilidades) {
    // Crear nodos hoja iniciales
    let nodos = probabilidades.map(item => ({
        simbolos: [item.simbolo],
        probabilidad: item.probabilidad,
        izquierda: null,
        derecha: null
    }));

    
    // Mientras haya más de un nodo en la lista
    while (nodos.length > 1) {
        // Ordenar por probabilidad de menor a mayor para tomar los dos más pequeños
        nodos.sort((a, b) => a.probabilidad - b.probabilidad);
        
        // Tomar los dos nodos con menor probabilidad
        const derecha = nodos.shift();
        const izquierda = nodos.shift();

        // Crear nuevo nodo padre
        const nuevoNodo = {
            simbolos: izquierda.probabilidad > derecha.probabilidad 
                ? [...izquierda.simbolos, ...derecha.simbolos]
                : [...derecha.simbolos, ...izquierda.simbolos],
            probabilidad: Number(izquierda.probabilidad) + Number(derecha.probabilidad),
            izquierda: izquierda,
            derecha: derecha
        };
        
        // Agregar el nuevo nodo a la lista
        nodos.push(nuevoNodo);
    }

    return nodos[0]; // Devolver la raíz del árbol
}

// Generar los códigos Huffman recursivamente
function generarCodigosHuffman(nodo, codigoActual = '', codigos = {}) {

    if (!nodo.izquierda && !nodo.derecha) {
        // Es un nodo hoja, asignar el código
        codigos[nodo.simbolos[0]] = codigoActual || '0'; // Si solo hay un símbolo, usar '0'
        return codigos;
    }
    
    // Recorrer subárbol izquierdo (agregar 0)
    if (nodo.izquierda) {
        generarCodigosHuffman(nodo.izquierda, codigoActual + '0', codigos);
    }
    
    // Recorrer subárbol derecho (agregar 1)
    if (nodo.derecha) {
        generarCodigosHuffman(nodo.derecha, codigoActual + '1', codigos);
    }
    
    // ORDENAR POR LONGITUD Y LUEGO POR VALOR BINARIO
    const codigosOrdenados = {};
    Object.entries(codigos)
        .sort((a, b) => {
            const codigoA = a[1];
            const codigoB = b[1];
            
            // Primero por longitud 
            if (codigoA.length !== codigoB.length) {
                return codigoA.length - codigoB.length;
            }
            
            // Si misma longitud, comparar como números binarios
            const numA = parseInt(codigoA, 2);
            const numB = parseInt(codigoB, 2);
            return numA - numB;
        })
        .forEach(([simbolo, codigo]) => {
            codigosOrdenados[simbolo] = codigo;
        });
        
    return codigosOrdenados;
}

function huffman(frase){
    const resultado = contarLetras(frase);
    const totalSimbolos = frase.length;
    const probabilidades = calcularProbabilidades(resultado, totalSimbolos);

    // Construir árbol y generar códigos
    const arbol = construirArbolHuffman(probabilidades);
    const codigos = generarCodigosHuffman(arbol);
    


    //Zona de verificación por consola Borrar al acabar

    console.log("Frase analizada:", frase);
    console.log("Total de símbolos:", totalSimbolos);
    console.log(arbol);

    // Mostrar códigos Huffman
    console.log("CÓDIGOS HUFFMAN");
    for (let simbolo in codigos) {
        const simboloMostrar = simbolo === ' ' ? 'espacio' : simbolo;
        console.log(`- ${simboloMostrar}: ${codigos[simbolo]}`);
    }
    
    //mostrar probabilidades
    probabilidades.forEach(item => {
        const simboloMostrar = item.simbolo === ' ' ? 'espacio' : item.simbolo;
        console.log(`- ${simboloMostrar}: ${item.probabilidad}`);
    });

    console.log("Resultado del conteo:");
    for (let letra in resultado) {
        const mostrar = letra === ' ' ? 'espacio' : letra;
        console.log(`- ${mostrar}: ${resultado[letra]}`);
    }


    return {
        probabilidades: probabilidades,
        codigos: codigos,
        arbol: arbol,
    };
}