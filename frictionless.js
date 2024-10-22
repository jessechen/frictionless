document.addEventListener("DOMContentLoaded", init);

class Friend {
    constructor(name, asset, color, accent, x, y) {
        this.name = name;
        this.asset = asset;
        this.color = color;
        this.accent = accent;
        this.x = x;
        this.y = y;
    }

    horizontalCollisions() {
        return [[this.x, this.y], [this.x, this.y + 1]];
    }

    verticalCollisions() {
        return [[this.x, this.y], [this.x + 1, this.y]];
    }

    updatePosition() {
        const friendEls = document.getElementsByClassName(this.name);
        for (let el of friendEls) {
            el.setAttribute("x", this.x * CELL_SIZE);
            el.setAttribute("y", this.y * CELL_SIZE);
        }
    }

    visuallySelect() {
        const backgroundEl = document.querySelector(`.background.${this.name}`);
        backgroundEl.setAttribute("stroke", this.accent);
        backgroundEl.setAttribute("stroke-width", "10");
    }

    visuallyDeselect() {
        const backgroundEl = document.querySelector(`.background.${this.name}`);
        backgroundEl.setAttribute("stroke", "#222");
        backgroundEl.setAttribute("stroke-width", "1");
    }
}

const verticalWalls = [[5, 0], [7, 1], [1, 2], [7, 5], [3, 6], [7, 7]];
const horizontalWalls = [[0, 6], [1, 2], [3, 7], [6, 2], [6, 5], [7, 7]];
const goals = [[6, 1], [1, 2], [6, 5], [3, 6]];
const GRID_SIZE = 8;
const RESOLUTION = 1024;
const CELL_SIZE = RESOLUTION / GRID_SIZE;
const SVG_NS = "http://www.w3.org/2000/svg";

// Crocodile, Squirrel, Duck, and Frog icons created by iconixar - Flaticon    
const friends = new Map();
friends.set("allie", new Friend("allie", "static/alligator.png", "#e4c1f9", "#c370f3", 2, 2))
friends.set("saul", new Friend("saul", "static/squirrel.png", "#fcf6bd", "#f9ec66", 3, 3))
friends.set("doug", new Friend("doug", "static/duck.png", "#d0f4de", "#84e7aa", 4, 4))
friends.set("frida", new Friend("frida", "static/fox.png", "#a9def9", "#59c1f5", 5, 5))
// the 5th color in the pallette is #ff99c8 / #ff479d
let selectedFriend = friends.get("allie");

function init() {
    const canvas = document.getElementById("content");
    drawGrid(canvas);
    drawGoals(canvas);
    drawFriends(canvas);
    selectedFriend.visuallySelect();
    drawWalls(canvas);
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
        goalEl.setAttribute("fill", "#ff99c8");
        canvas.appendChild(goalEl);
    }
}

function drawFriends(canvas) {
    for (let friend of friends.values()) {
        drawFriend(canvas, friend);
    }
}

function drawFriend(canvas, friend) {
    // I had these in a group but it seemed to add overhead and not help
    // much since height, width, x, and y are not inheritable attributes
    const backgroundEl = document.createElementNS(SVG_NS, "rect");
    backgroundEl.setAttribute("height", CELL_SIZE);
    backgroundEl.setAttribute("width", CELL_SIZE);
    backgroundEl.setAttribute("x", friend.x * CELL_SIZE);
    backgroundEl.setAttribute("y", friend.y * CELL_SIZE);
    backgroundEl.setAttribute("stroke", "#222");
    backgroundEl.setAttribute("fill", friend.color);
    backgroundEl.setAttribute("class", `background friend ${friend.name}`);
    const imageEl = document.createElementNS(SVG_NS, "image");
    imageEl.setAttribute("height", CELL_SIZE);
    imageEl.setAttribute("width", CELL_SIZE);
    imageEl.setAttribute("x", friend.x * CELL_SIZE);
    imageEl.setAttribute("y", friend.y * CELL_SIZE);
    imageEl.setAttribute("id", friend.name);
    imageEl.setAttribute("href", friend.asset);
    imageEl.setAttribute("class", `image friend ${friend.name}`);
    canvas.appendChild(backgroundEl);
    canvas.appendChild(imageEl);
}

function handleKeydown(evt) {
    switch(evt.key) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
            moveSelectedFriend(evt.key);
            break;
        case "a":
            selectFriend(friends.get("allie"));
            break;
        case "s":
            selectFriend(friends.get("saul"));
            break;
        case "d":
            selectFriend(friends.get("doug"));
            break;
        case "f":
            selectFriend(friends.get("frida"));
            break;
    }
}

function moveSelectedFriend(direction) {
    const friend = selectedFriend;
    const otherFriends = friends.values().filter((f) => f.name !== friend.name);
    let newX, newY, collisions;
    switch(direction) {
        case "ArrowUp":
            collisions = otherFriends.map((f) => f.horizontalCollisions()).toArray().flat();
            newY = horizontalWalls.concat(collisions)
                .filter((wall) => wall[0] === friend.x)
                .filter((wall) => wall[1] <= friend.y)
                .map((wall) => wall[1])
                .sort()
                .at(-1);
            friend.y = newY || 0;
            break;
        case "ArrowRight":
            collisions = otherFriends.map((f) => f.verticalCollisions()).toArray().flat();
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
            collisions = otherFriends.map((f) => f.horizontalCollisions()).toArray().flat();
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
            collisions = otherFriends.map((f) => f.verticalCollisions()).toArray().flat();
            newX = verticalWalls.concat(collisions)
                .filter((wall) => wall[1] === friend.y)
                .filter((wall) => wall[0] <= friend.x)
                .map((wall) => wall[0])
                .sort()
                .at(-1);
            friend.x = newX || 0;
            break;
    }
    friend.updatePosition();
}

function selectFriend(friend) {
    selectedFriend.visuallyDeselect();
    friend.visuallySelect();
    selectedFriend = friend;
}
