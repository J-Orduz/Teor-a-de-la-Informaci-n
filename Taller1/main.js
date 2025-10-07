// Este archivo conecta la logica del archivo Huffman.js con la interfaz grafica (index.html)


// Enviar la frase a Huffman.js
const frase = "codigo oso";
//Destructuring de la salida de huffman.js
const { 
    matriz: matrizResultados, 
    largoMedioTotal: lmt, 
    entropiaTotal: et, 
    eficiencia: eff 
} = huffman(frase);


console.log("OMG", matrizResultados, lmt, et, eff);
