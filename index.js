import utils from './utils.js';

const {getAngles, getLines, getRandomList, weights, WIDTH, HEIGHT, MARGIN} = utils;

let N; //numbers of players;
let names = [];
let player = 0; // current player
let points; //list of points per player
const shots =  []; // shots of current player

const printPuntajes = () => {
    names.forEach((name, index) => {
        console.log(`${name} ${points[index]}`);
    });
};

const readPlayers = (players) => {
    names = players;
    N = names.length;
    points = Array.from({length: N}, () => 501)
    console.log("Comienza el juego !");
    console.log(`turno de ${names[0]}`);
    printPuntajes();
    return players;
};

const square = (n) => n*n;

const finishGame = () => {
    console.log(`ha ganado ${names[player]}!`);
    points = points.map((_) => 501);
};

const update = () => {
    let total = 0;
    for (let i = 0; i < 3; i ++){
        if (typeof shots[i] === "number") total += shots[i];
        else if (shots[i] == "DB") total += 50;
        else total += 25;
    }
    points[player] -= total;
    points[player] = Math.abs(points[player]);
    if (!points[player]) finishGame();
    else {
        player++; 
        player %= N;
        shots.length = 0;
        console.log(`Turno de ${names[player]}`);
        printPuntajes();
    }
};

const savePoints = (circlesRadius, angles, nums, CX, CY, x, y) => {
    const radius = square(CX-x)+square(CY-y);
    const rad = Math.pow(radius, 0.5);
    let angle = Math.acos((x-CX)/rad);
    if (y < CY) angle = 2*Math.PI - angle;
    let radpos = 0;
    let numpos = nums.length-1;

    for (let i = 0; i < circlesRadius.length; i++){
        if (square(circlesRadius[i]) >= radius) radpos = i;
    }
    for (let i = 0; i < angles.length; i++){
        if (angle > angles[i]) numpos = i;
    }
    if (radpos == 6) shots.push("DB");
    else if (radpos == 5) shots.push("SB");
    else if (radpos == 4) shots.push(1 * parseInt(nums[numpos]));
    else if (radpos == 3) shots.push(3 * parseInt(nums[numpos]));
    else if (radpos == 2) shots.push(1 * parseInt(nums[numpos]));
    else if (radpos == 1) shots.push(2 * parseInt(nums[numpos]));
    else if (radpos == 0) shots.push(0 * parseInt(nums[numpos]));

    if (shots.length == 3) update();
};

const dartsCircle = async (width, height, margin) => {
    const circlesRadius = [160, 120, 110, 80, 70, 20, 10]
    const circlesColors = ["#1b1b1a", "#26204b","#929091","#351137","#d5d5d5","#eb8e04","#165025"]
    const CX = width/2 - margin.left;
    const CY = height/2 - margin.bottom;
    const svg = d3
        .select("#darts")
        .append("svg")
            .attr("height", height)
            .attr("width", width)

    const clickHandler = (e) => {
        const x = e.layerX - margin.left;
        const y = e.layerY - margin.top;
        savePoints(circlesRadius, angles, values, CX, CY, x, y);
        container
            .append("circle")
                .attr("cx", width)
                .attr("cy", 0)
                .attr("r", 100)
                .attr("fill", "red") // todo: get de correct color for each player... iterators (?)
            .transition()
            .duration(200)
            .attr("r", 5)
            .attr("cx", x)
            .attr("cy", y)

    }
    
    const container = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .on("click", clickHandler)

    container.selectAll("circle")
        .data(circlesRadius)
        .join("circle")
            .attr("fill", (d, i) => circlesColors[i])
            .attr("cx", CX)
            .attr("cy", CY)
            .attr("r", (d, i) => circlesRadius[i])
            .attr("stroke", "white");
//    container.append("circle").attr("cx", CX).attr("cy", CY).attr("r", 10).attr("fill", "red");
    const n = 20;
    const values = getRandomList(n);
    const angles = getAngles(n);
    const lines = getLines(angles);
    const firstRadious = circlesRadius[5];
    const secondRadious = circlesRadius[1];
    
    container.selectAll("line")
        .data(lines)
        .join("line")
            .attr("x1", (d) => CX+firstRadious*d.x)
            .attr("y1", (d) => CY+firstRadious*d.y)
            .attr("x2", (d) => CX+secondRadious*d.x)
            .attr("y2", (d) => CY+secondRadious*d.y)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
    
    container.selectAll("text")
        .data(values)
        .join("text")
            .attr("x", (d, i) => CX + secondRadious*Math.cos((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5)*weights((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5))
            .attr("y", (d, i) => CY + secondRadious*Math.sin((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5)*weights((angles[i] + (i + 1 < n ? angles[i + 1]: 2*Math.PI))*0.5))
            .text((d)=> d)
            .attr("stroke", "white")
            
}

const main = () => {
    readPlayers(["pedro", "juan", "diego"]);
    dartsCircle(WIDTH, HEIGHT, MARGIN);
}

main();