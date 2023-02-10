function setUp() {
    document.addEventListener("dblclick", addNode);
    const basicNode = document.querySelector("#nodeTemplate").content.cloneNode(true);
    const basicNodeDiv = basicNode.querySelector(".node");
    const basicNodeText = basicNodeDiv.querySelector(".nodeName");
    basicNodeDiv.style.setProperty("--Xpos", (window.innerWidth / 2) - 50 + "px");
    basicNodeDiv.style.setProperty("--Ypos", (window.innerHeight / 2) - 50 + "px");
    basicNodeDiv.dataset.x = ((window.innerWidth / 2) - 50).toString();
    basicNodeDiv.dataset.y = ((window.innerHeight / 2) - 50).toString();
    basicNodeText.textContent = "Default Node";
    basicNodeText.setAttribute("parentId", "Node0");
    basicNodeDiv.setAttribute("id", "Node0");
    document.querySelector("body").appendChild(basicNode);
    eventSetup(basicNodeDiv);
    localStorage.setItem("next-node-id", "1");
}

function addNode(e) {
    const newNode = document.querySelector("#nodeTemplate").content.cloneNode(true);
    const newNodeDiv = newNode.querySelector(".node");
    const newNodeText = newNodeDiv.querySelector(".nodeName");
    newNodeDiv.style.setProperty("--Xpos", e.clientX + "px");
    newNodeDiv.style.setProperty("--Ypos", e.clientY + "px");
    newNodeDiv.dataset.x = (e.clientX).toString();
    newNodeDiv.dataset.y = (e.clientY).toString();
    newNodeDiv.setAttribute("id", "Node" + localStorage.getItem("next-node-id"));
    newNodeText.setAttribute("parentId", "Node" + localStorage.getItem("next-node-id"));
    localStorage.setItem("next-node-id", (parseInt(localStorage.getItem("next-node-id")) + 1).toString());
    document.querySelector("body").appendChild(newNode);
    eventSetup(newNodeDiv);
    newNodeText.focus();
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

    if (CONNECTED_NODES[DRAG_TARGET.id]){
        for (let lineObj of CONNECTED_NODES[DRAG_TARGET.id].lines){
            lineObj.line.position();
        }
    }
}

function dropHandler(e) {
    e.preventDefault();
    let dropTarget;
    if (e.target.getAttribute("parentid") != null){
        dropTarget = document.querySelector(`#${e.target.getAttribute("parentid")}`);
    } else {
        dropTarget = e.target;
    }
    const lineName = DRAG_TARGET.id + dropTarget.id;
    if (DRAG_TARGET.id !== dropTarget.id && DRAG_TARGET.id.length > 0 && dropTarget.id.length > 0) {
        let found = false;
        if (CONNECTED_NODES[DRAG_TARGET.id]){
            found = objectSearch(DRAG_TARGET.id + dropTarget.id, CONNECTED_NODES[DRAG_TARGET.id].keys);
        } else {
            CONNECTED_NODES[DRAG_TARGET.id] = {lines: [], keys: []};
        }
        if (!found && CONNECTED_NODES[dropTarget.id]){
            found = objectSearch(DRAG_TARGET.id + dropTarget.id, CONNECTED_NODES[dropTarget.id].keys);
        } else {
            CONNECTED_NODES[dropTarget.id] = {lines: [], keys: []}
        }
        if (found === false) {
            const line = new LeaderLine(
                DRAG_TARGET,
                dropTarget,
                {gradient: true, startPlugColor: "#009fe2", endPlugColor: '#621362', opacity: 1}
            );
            CONNECTED_NODES[DRAG_TARGET.id].lines.push({line: line, key: lineName});
            CONNECTED_NODES[DRAG_TARGET.id].keys.push(lineName);
            CONNECTED_NODES[dropTarget.id].lines.push({line: line, key: lineName});
            CONNECTED_NODES[dropTarget.id].keys.push(lineName);
        } else {
            let objIndex = keySearch(CONNECTED_NODES[DRAG_TARGET.id].lines, DRAG_TARGET.id + dropTarget.id);
            CONNECTED_NODES[DRAG_TARGET.id].lines[objIndex].line.remove();
            CONNECTED_NODES[DRAG_TARGET.id].lines.splice(objIndex, 1);
            CONNECTED_NODES[DRAG_TARGET.id].keys.splice(CONNECTED_NODES[DRAG_TARGET.id].keys.indexOf(lineName));

            objIndex = keySearch(CONNECTED_NODES[dropTarget.id].lines, DRAG_TARGET.id + dropTarget.id);
            CONNECTED_NODES[dropTarget.id].lines.splice(objIndex, 1);
            CONNECTED_NODES[dropTarget.id].keys.splice(CONNECTED_NODES[dropTarget.id].keys.indexOf(lineName));
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
