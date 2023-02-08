function setUp() {
    document.addEventListener("dblclick", addNode);
    const basicNode = document.createElement("interactive-node");
    basicNode.style.setProperty("--Xpos", (window.innerWidth / 2) - 50 + "px");
    basicNode.style.setProperty("--Ypos", (window.innerHeight / 2) - 50 + "px");
    basicNode.dataset.x = ((window.innerWidth / 2) - 50).toString();
    basicNode.dataset.y = ((window.innerHeight / 2) - 50).toString();
    basicNode.shadowRoot.querySelector(".nodeName").textContent = "Default Node";
    basicNode.setAttribute("id", "Node0");
    document.querySelector("body").appendChild(basicNode);
    eventSetup(basicNode);
    localStorage.setItem("next-node-id", "1");
}

function addNode(e) {
    const newNode = document.createElement("interactive-node");
    newNode.style.setProperty("--Xpos", e.clientX + "px");
    newNode.style.setProperty("--Ypos", e.clientY + "px");
    newNode.dataset.x = (e.clientX).toString();
    newNode.dataset.y = (e.clientY).toString();
    newNode.setAttribute("id", "Node" + localStorage.getItem("next-node-id"));
    localStorage.setItem("next-node-id", (parseInt(localStorage.getItem("next-node-id")) + 1).toString());
    document.querySelector("body").appendChild(newNode);
    eventSetup(newNode);
    const input = newNode.shadowRoot.querySelector(".nodeName")
    input.focus();
}

function eventSetup(node) {
    node.addEventListener("dragstart", dragStartHandler);
    node.addEventListener("dragover", dragHandler);
    node.addEventListener("drop", dropHandler);
    node.addEventListener("dragend", dragEndHandler);
}

function dragStartHandler(e) {
    DRAG_TARGET = e.target;
    e.dataTransfer.setDragImage(new Image, 0, 0);
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("dragging");
}

function dragHandler(e) {
    e.preventDefault();
    DRAG_TARGET.style.setProperty("--Xpos", e.pageX - 50 + "px");
    DRAG_TARGET.style.setProperty("--Ypos", e.pageY - 50 + "px");
    DRAG_TARGET.dataset.x = (e.pageX - 50).toString();
    DRAG_TARGET.dataset.y = (e.pageY - 50).toString();
}

function dropHandler(e) {
    e.preventDefault();
    const lineName = DRAG_TARGET.id + e.target.id;
    if (DRAG_TARGET.id !== e.target.id) {
        let found = false;
        if (CONNECTED_NODES[DRAG_TARGET.id]){
            found = objectSearch(DRAG_TARGET.id + e.target.id, CONNECTED_NODES[DRAG_TARGET.id].keys);
        } else {
            CONNECTED_NODES[DRAG_TARGET.id] = {start: [], end: [], keys: []};
        }
        if (!found && CONNECTED_NODES[e.target.id]){
            found = objectSearch(DRAG_TARGET.id + e.target.id, CONNECTED_NODES[e.target.id].keys);
        } else {
            CONNECTED_NODES[e.target.id] = {start: [], end: [], keys: []}
        }
        if (found === false) {
            const line = new LeaderLine(
                LeaderLine.pointAnchor(document.body, {x: parseInt(DRAG_TARGET.dataset.x), y: parseInt(DRAG_TARGET.dataset.y)}),
                LeaderLine.pointAnchor(document.body, {x: parseInt(e.target.dataset.x), y: parseInt(e.target.dataset.y)}));
            CONNECTED_NODES[DRAG_TARGET.id].start.push({line: line, key: lineName});
            CONNECTED_NODES[DRAG_TARGET.id].keys.push(lineName);
            CONNECTED_NODES[e.target.id].end.push({line: line, key: lineName});
            CONNECTED_NODES[e.target.id].keys.push(lineName);
        } else {
            let objIndex = keySearch(CONNECTED_NODES[DRAG_TARGET.id].start, DRAG_TARGET.id + e.target.id);
            CONNECTED_NODES[DRAG_TARGET.id].start[objIndex].line.remove();
            CONNECTED_NODES[DRAG_TARGET.id].start.splice(objIndex, 1);
            CONNECTED_NODES[DRAG_TARGET.id].keys.splice(CONNECTED_NODES[DRAG_TARGET.id].keys.indexOf(lineName));

            objIndex = keySearch(CONNECTED_NODES[e.target.id].end, DRAG_TARGET.id + e.target.id);
            CONNECTED_NODES[e.target.id].end.splice(objIndex, 1);
            CONNECTED_NODES[e.target.id].keys.splice(CONNECTED_NODES[e.target.id].keys.indexOf(lineName));
        }
        console.log(CONNECTED_NODES);
    }
}

function objectSearch(obj, arr) {
    for (let object of arr) {
        if (JSON.stringify(object) === JSON.stringify(obj)) {
            return arr.indexOf(object);
        }
    }
    return false;
}

function keySearch(arr, key){
    for (let i = 0; i<arr.length; i++){
        if (arr[i].key === key){
            return i;
        }
    }
    return false;
}

function dragEndHandler(e) {
    e.target.classList.remove("dragging");
    const nodeTarget = document.querySelector(`#${e.dataTransfer.getData("text")}`);
    document.querySelector("body").removeChild(nodeTarget);
    document.querySelector("body").appendChild(nodeTarget);
}

window.addEventListener("load", setUp);
const CONNECTED_NODES = {};
let DRAG_TARGET = undefined;


/*
    Find way to change CSS to use attr() and remove the css prop entirely
    Find how to not have overflow, without needing to use overflow:hidden
  */
