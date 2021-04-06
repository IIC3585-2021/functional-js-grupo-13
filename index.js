const WIDTH = 600;
const HEIGHT = 500;
const MARGIN = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};

let N; //numbers of players;
let names = []; // nombres de los jugadores
let player = 0; // current player
let points; //list of points per player
const shots =  []; // shots of current player

// retorna el último indice donde la funcion statement es verdadera
const lastTrue = (statement, index, list) => {
    if (index != list.length && statement(index, list)) return lastTrue(statement, index+1, list);
    return index-1;
}

const square = (n) => n*n;

const printPuntajes = () => {
    names.forEach((name, index) => {
        console.log(`${name} ${points[index]}`);
    });
};

const printTurn = () => {
    console.log(`turno de ${names[player]}`);
}

const readPlayers = (players) => {
    names = players;
    N = names.length;
    points = Array.from({length: N}, () => 501)
    console.log("Comienza el juego !");
    printTurn();
    printPuntajes();
    return players;
};

const finishGame = () => {
    console.log(`ha ganado ${names[player]}!`);
    points = points.map((_) => 501);
};


// retorna el valor de un lanzamiento 
const getPoints = (shot) => {
    if (typeof shot === "number") return shot;
    else if (shot == "DB") return 50;
    return 25;
}

// retorna la suma de los últimos 3 lanzamientos
const getSum = (pos) => {
    if (pos == 3) return 0;
    return getPoints(shots[pos]) + getSum(pos+1);
}

const update = () => {
    let total = getSum(0);
    points[player] -= total;
    points[player] = Math.abs(points[player]);
    if (!points[player]) finishGame();
    else {
        player++; 
        player %= N;
        printTurn();
        printPuntajes();
    }
};

//buscar forma funcional para reemplazar los for's si es que se puede
const savePoints = (circlesRadius, angles, nums, CX, CY, x, y) => {
    const radius = square(CX-x)+square(CY-y);
    const rad = Math.pow(radius, 0.5);
    const angle = y < CY ? 2*Math.PI - Math.acos((x-CX)/rad): Math.acos((x-CX)/rad);
    
    const radpos = lastTrue((i, circlesRadius) => square(circlesRadius[i]) >= radius, 0, circlesRadius);
    const numpos = lastTrue((i, angles) =>  angle > angles[i], 0, angles);
    
    if (radpos == 6) shots.push("DB");
    else if (radpos == 5) shots.push("SB");
    else if (radpos == 4) shots.push(1 * parseInt(nums[numpos]));
    else if (radpos == 3) shots.push(3 * parseInt(nums[numpos]));
    else if (radpos == 2) shots.push(1 * parseInt(nums[numpos]));
    else if (radpos == 1) shots.push(2 * parseInt(nums[numpos]));
    else if (radpos == 0) shots.push(0 * parseInt(nums[numpos]));

    if (shots.length == 3) update(), shots.length = 0;
};

// muestra el tablero
const dartsCircle = async (width, height, margin) => {
    const circlesRadius = [160, 120, 110, 80, 70, 20, 10] 
    const circlesColors = ["#1b1b1a", "#26204b","#929091","#351137","#d5d5d5","#eb8e04","#165025"]
    const CX = width/2 - margin.left;
    const CY = height/2 - margin.bottom;

    const svg = d3  // insertamos un svg
        .select("#darts")
        .append("svg")
            .attr("height", height)
            .attr("width", width)

    const clickHandler = (e) => { // define el comportamiento al hacer click
        const x = e.layerX - margin.left;
        const y = e.layerY - margin.top;
        savePoints(circlesRadius, angles, values, CX, CY, x, y);
        container
            .append("circle")
                .attr("cx", width)
                .attr("cy", 0)
                .attr("r", 100)
                .attr("fill", "red")
            .transition()
            .duration(200)
            .attr("r", 5)
            .attr("cx", x)
            .attr("cy", y)

    }
    
    const container = svg.append("g") // inserta un <g></g> donde irá el tablero
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .on("click", clickHandler)

    container.selectAll("circle") // inserta los circulos concéntricos
        .data(circlesRadius)
        .join("circle")
            .attr("fill", (_, i) => circlesColors[i])
            .attr("cx", CX)
            .attr("cy", CY)
            .attr("r", (_, i) => circlesRadius[i])
            .attr("stroke", "white");

    // retorna una lista random de tamaño n
    const getRandomList = (n, randomList=[]) => {
        if (!n) return randomList;
        const pos = Math.floor(Math.random()*randomList.length);
        return getRandomList (n-1, randomList.slice(0, pos).concat([n], randomList.slice(pos)));
    };
    // retorna un array de los angulos de las secciones circulares del tablero.
    const getAngles = (n) =>{
        const alpha = 2*Math.PI/n;
        const angles = Array.from({length: n}, (_, i) => alpha*i);
        return angles;
    };
    // A: arreglo con los ángulos para cada sección circular del tablero
    // a partir de los angulos A genera las posiciones de las lineas que dividen los sectores circulares
    const getLines = (A) => {
        const lines = Array.from({length: A.length}, (_, i) => ({"x" : Math.cos(A[i]), "y": Math.sin(A[i])}))
        return lines;
    };

    // esta función retorna un coeficiente que posiciona correctamente los
    // numeros del tablero según su ángulo
    const weights = (alpha) => {
        return ((Math.sin(5.23+alpha)+1)*0.1+1.08)
    };


    const n = 20;
    const values = getRandomList(n);
    const angles = getAngles(n);
    const lines = getLines(angles);
    const firstRadious = circlesRadius[5];
    const secondRadious = circlesRadius[1];
    
    container.selectAll("line") // inserta las lineas que dividen cada sección circular
        .data(lines)
        .join("line")
            .attr("x1", (d) => CX+firstRadious*d.x)
            .attr("y1", (d) => CY+firstRadious*d.y)
            .attr("x2", (d) => CX+secondRadious*d.x)
            .attr("y2", (d) => CY+secondRadious*d.y)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
    
    container.selectAll("text") // inserta los números del 1 al n
        .data(values)
        .join("text")
            .attr("x", (_, i) => CX + secondRadious*Math.cos((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5)*weights((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5))
            .attr("y", (_, i) => CY + secondRadious*Math.sin((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5)*weights((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5))
            .text((d)=> d)
            .attr("stroke", "white")
            
}

const main = () => {
    readPlayers(["pedro", "juan", "diego"]);
    dartsCircle(WIDTH, HEIGHT, MARGIN);
}

main();