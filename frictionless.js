document.addEventListener("DOMContentLoaded", init);

class Friend {
    constructor(props) {
        this.name = props.name;
        this.asset = props.asset;
        this.color = props.color;
        this.accent = props.accent;
        this.x = props.x;
        this.y = props.y;
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

class Board {
    constructor(props) {
        this.id = props.id;
        this.verticalWalls = props.verticalWalls;
        this.horizontalWalls = props.horizontalWalls;
        this.goals = props.goals;
    }
}

const GRID_SIZE = 16;
const RESOLUTION = 1024;
const CELL_SIZE = RESOLUTION / GRID_SIZE;
const SVG_NS = "http://www.w3.org/2000/svg";

const boards = new Map();
boards.set("eins", new Board({
    id: "eins",
    verticalWalls: [[2, 0], [4, 1], [2, 2], [7, 3], [3, 6], [7, 7]],
    horizontalWalls: [[0, 6], [1, 2], [3, 7], [4, 1], [6, 4], [7, 7]],
    goals: {allie: [4, 1], doug: [1, 2], saul: [6, 3], frida: [3, 6]},
}));
boards.set("zwei", new Board({
    id: "zwei",
    verticalWalls: [[4, 0], [6, 1], [1, 2], [6, 4], [3, 6], [7, 7]],
    horizontalWalls: [[0, 4], [1, 3], [2, 6], [5, 2], [6, 4], [7, 7]],
    goals: {frida: [5, 1], allie: [1, 2], saul: [6, 4], doug: [2, 6]},
}));
boards.set("drei", new Board({
    id: "drei",
    verticalWalls: [[4, 0], [6, 2], [3, 4], [7, 5], [1, 6], [7, 7]],
    horizontalWalls: [[0, 5], [1, 6], [2, 4], [5, 3], [7, 6], [7, 7]],
    goals: {frida: [5, 2], doug: [2, 4], allie: [7, 5], saul: [1, 6]},
}));
boards.set("vier", new Board({
    id: "vier",
    verticalWalls: [[4, 0], [6, 1], [2, 3], [5, 4], [3, 5], [8, 5], [7, 7]],
    horizontalWalls: [[0, 7], [1, 3], [2, 6], [5, 4], [6, 2], [7, 6], [7, 7]],
    goals: {frida: [6, 1], saul: [1, 3], doug: [5, 4], allie: [2, 5], asdf: [7, 5]},
}));
boards.set("un", new Board({
    id: "un",
    verticalWalls: [[5, 0], [7, 1], [1, 2], [7, 5], [3, 6], [7, 7]],
    horizontalWalls: [[0, 6], [1, 2], [3, 7], [6, 2], [6, 5], [7, 7]],
    goals: {saul: [6, 1], doug: [1, 2], frida: [6, 5], allie: [3, 6]},
}));
boards.set("deux", new Board({
    id: "deux",
    verticalWalls: [[5, 0], [2, 1], [6, 3], [5, 5], [2, 6], [7, 7]],
    horizontalWalls: [[0, 5], [1, 7], [2, 1], [4, 5], [6, 4], [7, 7]],
    goals: {saul: [2, 1], frida: [6, 3], allie: [4, 5], doug: [1, 6]},
}));
boards.set("trois", new Board({
    id: "trois",
    verticalWalls: [[4, 0], [1, 1], [7, 2], [3, 4], [7, 5], [7, 7]],
    horizontalWalls: [[0, 6], [1, 2], [2, 5], [6, 2], [7, 5], [7, 7]],
    goals: {allie: [1, 1], doug: [6, 2], frida: [2, 4], saul: [7, 5]},
}));
boards.set("cat", new Board({
    id: "cat",
    verticalWalls: [[5, 0], [3, 1], [1, 3], [6, 4], [6, 6], [4, 7], [7, 7]],
    horizontalWalls: [[0, 5], [1, 4], [2, 2], [3, 8], [5, 6], [6, 4], [7, 7]],
    goals: {allie: [2, 1], doug: [1, 3], saul: [6, 4], frida: [5, 6], asdf: [3, 7]},
}));

const verticalWalls = [];
const horizontalWalls = [];
const goals = new Map();

// Crocodile, Squirrel, Duck, and Fox icons created by iconixar - Flaticon
const friends = new Map();
friends.set("allie", new Friend({
    name: "allie",
    asset: "static/alligator.png",
    color: "#e4c1f9",
    accent: "#c370f3",
    x: 2,
    y: 2,
}));
friends.set("saul", new Friend({
    name: "saul",
    asset: "static/squirrel.png",
    color: "#fcf6bd",
    accent: "#f9ec66",
    x: 3,
    y: 3,
}));
friends.set("doug", new Friend({
    name: "doug",
    asset: "static/duck.png",
    color: "#d0f4de",
    accent: "#84e7aa",
    x: 4,
    y: 4,
}));
friends.set("frida", new Friend({
    name: "frida",
    asset: "static/fox.png",
    color: "#a9def9",
    accent: "#59c1f5",
    x: 5,
    y: 5,
}));
// the 5th color in the pallette is #ff99c8 / #ff479d
let selectedFriend = friends.get("allie");

function init() {
    pickBoards();

    const canvas = document.getElementById("content");
    drawGrid(canvas);
    drawGoals(canvas);
    drawFriends(canvas);
    selectedFriend.visuallySelect();
    drawWalls(canvas);
    document.addEventListener("keydown", handleKeydown);
}

function pickBoards() {
    goals.set("allie", []);
    goals.set("saul", []);
    goals.set("doug", []);
    goals.set("frida", []);
    goals.set("asdf", []);

    const board = boards.get("eins");
    verticalWalls.push(...board.verticalWalls);
    horizontalWalls.push(...board.horizontalWalls);
    for(let [name, coordinates] of Object.entries(board.goals)) {
        goals.get(name).push(coordinates);
    }
    const board2 = rotateBoard(boards.get("zwei"), 1);
    verticalWalls.push(...board2.verticalWalls);
    horizontalWalls.push(...board2.horizontalWalls);
    for(let [name, coordinates] of Object.entries(board2.goals)) {
        goals.get(name).push(coordinates);
    }
}

function rotateBoard(board, rotations) {
    
    const newVerticalWalls = board.horizontalWalls.map((wall) => [16-wall[1], wall[0]]);
    board.horizontalWalls = board.verticalWalls.map((wall) => [15-wall[1], wall[0]]);
    board.verticalWalls = newVerticalWalls;
    board.goals = Object.fromEntries(Object.entries(board.goals));
    return board;
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
    for (let friendGoals of goals.values()) {
        for (let goal of friendGoals) {
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
                .sort(sortInts)
                .at(-1);
            friend.y = newY || 0;
            break;
        case "ArrowRight":
            collisions = otherFriends.map((f) => f.verticalCollisions()).toArray().flat();
            newX = verticalWalls.concat(collisions)
                .filter((wall) => wall[1] === friend.y)
                .filter((wall) => wall[0] > friend.x)
                .map((wall) => wall[0])
                .sort(sortInts)
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
                .sort(sortInts)
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
                .sort(sortInts)
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

function sortInts(a, b) {
    return a - b;
}
