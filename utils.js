const WIDTH = 600;

const HEIGHT = 500;

const MARGIN = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};

// retorna una lista random de tamaño n
const getRandomList = (n, randomList=[]) => {
    if (!n) return randomList;
    const pos = Math.floor(Math.random()*randomList.length);
    return getRandomList (n-1, randomList.slice(0, pos).concat([n], randomList.slice(pos)));
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