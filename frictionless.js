document.addEventListener("DOMContentLoaded", init);

class Friend {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
    }
}

const verticalWalls = [[5, 0], [7, 1], [1, 2], [7, 5], [3, 6], [7, 7]];
const horizontalWalls = [[0, 6], [1, 2], [3, 7], [6, 2], [6, 5], [7, 7]];
const goals = [[6, 1], [1, 2], [6, 5], [3, 6]];
const GRID_SIZE = 8;
const RESOLUTION = 1024;
const CELL_SIZE = RESOLUTION / GRID_SIZE;
const SVG_NS = "http://www.w3.org/2000/svg";
let friends = new Map();
friends.set("ally", new Friend(2, 2, "ally"))
friends.set("sal", new Friend(3, 3, "sal"))
friends.set("doug", new Friend(4, 4, "doug"))
friends.set("frida", new Friend(5, 5, "frida"))

function init() {
    const canvas = document.getElementById("content");
    drawGrid(canvas);
    drawGoals(canvas);
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

function drawGoals(canvas) {
    for (let goal of goals) {
        const goalEl = document.createElementNS(SVG_NS, "rect");
        goalEl.setAttribute("x", goal[0] * CELL_SIZE);
        goalEl.setAttribute("y", goal[1] * CELL_SIZE);
        goalEl.setAttribute("width", CELL_SIZE);
        goalEl.setAttribute("height", CELL_SIZE);
        goalEl.setAttribute("stroke", "none");
        goalEl.setAttribute("fill", "#f88");
        canvas.appendChild(goalEl);
    }
}

function drawFriends(canvas) {
    // Crocodile, Squirrel, Duck, and Frog icons created by iconixar - Flaticon    
    canvas.appendChild(drawFriend("static/alligator.png", "ally"));
    canvas.appendChild(drawFriend("static/squirrel.png", "sal"));
    canvas.appendChild(drawFriend("static/duck.png", "doug"));
    canvas.appendChild(drawFriend("static/frog.png", "frida"));
}

function drawFriend(image, name) {
    const imageEl = document.createElementNS(SVG_NS, "image");
    imageEl.setAttribute("href", image);
    imageEl.setAttribute("height", CELL_SIZE);
    imageEl.setAttribute("width", CELL_SIZE);
    imageEl.setAttribute("x", friends.get(name).x * CELL_SIZE);
    imageEl.setAttribute("y", friends.get(name).y * CELL_SIZE);
    imageEl.setAttribute("id", friends.get(name).name);
    imageEl.setAttribute("class", "friend");
    return imageEl;
}

function handleKeydown(evt) {
    switch(evt.key) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
            moveFriend("ally", evt.key);
            const friendEl = document.getElementById(friends.get("ally").name);
            friendEl.setAttribute("x", friends.get("ally").x * CELL_SIZE);
            friendEl.setAttribute("y", friends.get("ally").y * CELL_SIZE);
            break;
    }
}

function moveFriend(name, direction) {
    const friend = friends.get(name);
    const otherFriends = friends.values().filter((f) => f.name !== friend.name);
    let newX, newY, collisions;
    switch(direction) {
        case "ArrowUp":
            collisions = otherFriends.map(horizontalCollisions).toArray().flat();
            newY = horizontalWalls.concat(collisions)
                .filter((wall) => wall[0] === friend.x)
                .filter((wall) => wall[1] <= friend.y)
                .map((wall) => wall[1])
                .sort()
                .at(-1);
            friend.y = newY || 0;
            break;
        case "ArrowRight":
            collisions = otherFriends.map(verticalCollisions).toArray().flat();
            newX = verticalWalls.concat(collisions)
                .filter((wall) => wall[1] === friend.y)
                .filter((wall) => wall[0] > friend.x)
                .map((wall) => wall[0])
                .sort()
                .at(0);
            newX ||= GRID_SIZE;
            friend.x = newX - 1;
            break;
        case "ArrowDown":
            collisions = otherFriends.map(horizontalCollisions).toArray().flat();
            newY = horizontalWalls.concat(collisions)
                .filter((wall) => wall[0] === friend.x)
                .filter((wall) => wall[1] > friend.y)
                .map((wall) => wall[1])
                .sort()
                .at(0);
            newY ||= GRID_SIZE;
            friend.y = newY - 1;
            break;
        case "ArrowLeft":
            collisions = otherFriends.map(verticalCollisions).toArray().flat();
            newX = verticalWalls.concat(collisions)
                .filter((wall) => wall[1] === friend.y)
                .filter((wall) => wall[0] <= friend.x)
                .map((wall) => wall[0])
                .sort()
                .at(-1);
            friend.x = newX || 0;
            break;
    }
}

function horizontalCollisions(entity) {
    return [[entity.x - 1, entity.y], [entity.x, entity.y]];
}

function verticalCollisions(entity) {
    return [[entity.x, entity.y - 1], [entity.x, entity.y]];
}
