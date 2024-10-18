document.addEventListener("DOMContentLoaded", init);

class Friend {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

const verticalWalls = [[2, 3], [1, 4], [3, 4]];
const horizontalWalls = [[3, 2], [4, 1], [4, 3]];
const GRID_SIZE = 8;
const RESOLUTION = 1024;
const CELL_SIZE = RESOLUTION / GRID_SIZE;
const SVG_NS = "http://www.w3.org/2000/svg";
let friends = new Map();
friends.set("red-friend", new Friend(2, 2, "red-friend"))

function init() {
    const canvas = document.getElementById("content");
    drawGrid(canvas);
    drawWalls(canvas);
    drawFriends(canvas);
    document.addEventListener("keydown", handleKeydown);
}

function drawGrid(canvas) {
    let gridPath = `M${RESOLUTION} 0H0v${RESOLUTION}`; // outer edge
    for (let x = 0; x <= GRID_SIZE; x++) {
        gridPath += `M${x * CELL_SIZE} 0v${RESOLUTION}`; // vertical lines
    }
    for (let y = 0; y <= GRID_SIZE; y++) {
        gridPath += `M0 ${y * CELL_SIZE}h${RESOLUTION}`; // horizontal lines
    }
    const pathEl = document.createElementNS(SVG_NS, "path");
    pathEl.setAttribute("d", gridPath);
    pathEl.setAttribute("stroke", "#222");
    pathEl.setAttribute("fill", "none");
    canvas.appendChild(pathEl);
}

function drawWalls(canvas) {
    let wallPath = "";
    for (let verticalWall of verticalWalls) {
        wallPath += `M${verticalWall[0] * CELL_SIZE} ${verticalWall[1] * CELL_SIZE}v${CELL_SIZE}`;
    }
    for (let horizontalWall of horizontalWalls) {
        wallPath += `M${horizontalWall[0] * CELL_SIZE} ${horizontalWall[1] * CELL_SIZE}h${CELL_SIZE}`;
    }
    const pathEl = document.createElementNS(SVG_NS, "path");
    pathEl.setAttribute("d", wallPath);
    pathEl.setAttribute("stroke", "#111");
    pathEl.setAttribute("stroke-width", "5");
    pathEl.setAttribute("fill", "none");
    canvas.appendChild(pathEl);
}

function drawFriends(canvas) {
    // Robot antennas icon by Delapouite [delapouite.com] under CC BY 3.0
    // Source: game-icons.net
    const imageEl = document.createElementNS(SVG_NS, "image");
    imageEl.setAttribute("href", "robot-antennas.svg");
    imageEl.setAttribute("height", CELL_SIZE);
    imageEl.setAttribute("width", CELL_SIZE);
    imageEl.setAttribute("x", friends.get("red-friend").x * CELL_SIZE);
    imageEl.setAttribute("y", friends.get("red-friend").y * CELL_SIZE);
    imageEl.setAttribute("id", friends.get("red-friend").name);
    canvas.appendChild(imageEl);
    return imageEl;
}

function handleKeydown(evt) {
    switch(evt.key) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
            moveFriend("red-friend", evt.key);
            const friendEl = document.getElementById(friends.get("red-friend").name);
            friendEl.setAttribute("x", friends.get("red-friend").x * CELL_SIZE);
            friendEl.setAttribute("y", friends.get("red-friend").y * CELL_SIZE);
            break;
    }
}

function moveFriend(name, direction) {
    const friend = friends.get(name);
    let newX, newY;
    switch(direction) {
        case "ArrowUp":
            newY = horizontalWalls.filter((wall) => wall[0] === friend.x)
                .filter((wall) => wall[1] <= friend.y)
                .map((wall) => wall[1])
                .sort()
                .at(-1);
            friend.y = newY || 0;
            break;
        case "ArrowRight":
            newX = horizontalWalls.filter((wall) => wall[1] === friend.y)
                .filter((wall) => wall[1] > friend.x)
                .map((wall) => wall[1])
                .sort()
                .at(0);
            friend.x = newX || GRID_SIZE - 1;
            break;
        case "ArrowDown":
            newY = horizontalWalls.filter((wall) => wall[0] === friend.x)
                .filter((wall) => wall[1] > friend.y)
                .map((wall) => wall[1])
                .sort()
                .at(0);
            friend.y = newY || GRID_SIZE - 1;
            break;
        case "ArrowLeft":
            newY = horizontalWalls.filter((wall) => wall[1] === friend.y)
                .filter((wall) => wall[1] <= friend.x)
                .map((wall) => wall[1])
                .sort()
                .at(-1);
            friend.x = newX || 0;
            break;
    }
}