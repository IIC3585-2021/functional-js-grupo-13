const WIDTH = 600;

const HEIGHT = 500;

const MARGIN = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};

//buscar una forma funcional de hacer esto
const getRandomList = (n) => {
    const randomList = [];
    for (let i = 1; i <= n; i++) randomList.push(i);
    for (let i = 0; i < n-1; i++){
        const j = Math.floor(Math.random() * (n-i-1))+i+1;
        randomList[i] ^= randomList[j];
        randomList[j] ^= randomList[i];
        randomList[i] ^= randomList[j];
        // [A[i], A[j]] = [A[j], A[i]]; no funciona  ???? TODO
    }
    return randomList;
};

// se cambío a una forma más compacta para definir el arreglo 
// qué es n?, explicar que hace la función acá
const getAngles = (n) =>{
    const alpha = 2*Math.PI/n;
    const angles = Array.from({length: n}, (_, i) => alpha*i)
    return angles;
};

// se cambío a una forma más compacta para definir el arreglo 
// qué es A?, explicar que hace la función acá
const getLines = (A) => {
    const lines = Array.from({length: A.length}, (_, i) => ({"x" : Math.cos(A[i]), "y": Math.sin(A[i])}))
    return lines;
};

// explicar que hace la función acá
const weights = (alpha) => {
    return ((Math.sin(5.23+alpha)+1)*0.1+1.08)
};

const utils = {
    getAngles,
    getLines,
    getRandomList,
    weights,
    WIDTH,
    HEIGHT,
    MARGIN,
};

export default utils;