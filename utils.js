const WIDTH = 600;

const HEIGHT = 500;

const MARGIN = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};

const getRandomList = (n) => {
    const randomList =  Array(100).fill().map((_, index) => index + 1);
    randomList.sort(() => Math.random() - 0.5);
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