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


function calcularLargoMedio(matrizResultados) {
    // Recorrer cada fila de la matriz
    for (let i = 0; i < matrizResultados.length; i++) {
        const fila = matrizResultados[i];
        const probabilidad = fila[1];        // Columna 2: Probabilidad
        const codigo = fila[2];              // Columna 3: Código Huffman
        const longitudCodigo = codigo.length;
        const largoMedio = probabilidad * longitudCodigo;
        
        // Asignar el resultado a la columna 4
        fila[3] = largoMedio.toFixed(3);
    }
    
    return matrizResultados;
}

function calcularLargoMedioTotal(matrizResultados) {
    return matrizResultados.reduce((suma, fila) => suma + Number(fila[3]), 0).toFixed(3);
}


function calcularEntropia(matrizResultados) {
    // Recorrer cada fila de la matriz
    for (let i = 0; i < matrizResultados.length; i++) {
        const fila = matrizResultados[i];
        const probabilidad = fila[1];        // Columna 2: Probabilidad
        
        // Calcular entropía: p * log2(1/p)
        let entropia = 0;
        if (probabilidad > 0) {
            entropia = probabilidad * Math.log2(1 / probabilidad);
        }
        
        // Asignar el resultado a la columna 5
        fila[4] = entropia.toFixed(3);
    }
    
    return matrizResultados;
}

function calcularEntropiaTotal(matrizResultados) {
    return matrizResultados.reduce((suma, fila) => suma + Number(fila[4]), 0).toFixed(3);
}


function calcularEficiencia(largoMedioTotal, entropiaTotal) {
    const eficiencia = (entropiaTotal / largoMedioTotal) * 100;
    return eficiencia.toFixed(2);
}


function huffman(frase){
    const resultado = contarLetras(frase);
    const totalSimbolos = frase.length;
    const probabilidades = calcularProbabilidades(resultado, totalSimbolos);

    // Construir árbol y generar códigos
    const arbol = construirArbolHuffman(probabilidades);
    const codigos = generarCodigosHuffman(arbol);
    
    // Crear la matriz con las columnas solicitadas
    let matrizResultados = probabilidades.map(item => {
        return [
            item.simbolo === ' ' ? 'espacio' : item.simbolo, // Columna 1: Símbolo
            item.probabilidad,                               // Columna 2: Probabilidad
            codigos[item.simbolo] || '',                    // Columna 3: Código Huffman
            null,                                           // Columna 4: Largo Medio 
            null                                            // Columna 5: Entropía
        ];
    });
    console.log("Matriz");
    console.log(matrizResultados);

    //Calcular largo medio de cada simbolo
    matrizResultados = calcularLargoMedio(matrizResultados);

    // Calcular el largo medio total
    const largoMedioTotal = calcularLargoMedioTotal(matrizResultados);
    

    //Calcular la entropía de cada simbolo
    matrizResultados = calcularEntropia(matrizResultados);

    // Calcular la entropía total
    const entropiaTotal = calcularEntropiaTotal(matrizResultados);
    

    //Calcular la eficiencia
    const eficiencia = calcularEficiencia(largoMedioTotal, entropiaTotal);







    //Zona de verificación por consola Borrar al acabar
//--------------------------------------------------------------

    console.log("Largo medio total");
    console.log(largoMedioTotal);

    console.log("Entropía total");
    console.log(entropiaTotal);

    console.log("Eficiencia");
    console.log(eficiencia + "%");

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
    console.log("Probabilidades:");
    probabilidades.forEach(item => {
        const simboloMostrar = item.simbolo === ' ' ? 'espacio' : item.simbolo;
        console.log(`- ${simboloMostrar}: ${item.probabilidad}`);
    });

    console.log("Resultado del conteo:");
    for (let letra in resultado) {
        const mostrar = letra === ' ' ? 'espacio' : letra;
        console.log(`- ${mostrar}: ${resultado[letra]}`);
    }
//--------------------------------------------------------------




     return {
        matriz: matrizResultados,
        largoMedioTotal: largoMedioTotal,
        entropiaTotal: entropiaTotal,
        eficiencia: eficiencia
    };
}