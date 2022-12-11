function setUp(){
    document.addEventListener("dblclick", addNode);
    const basicNode = document.createElement("interactive-node");
    basicNode.style.setProperty("--Xpos", (window.innerWidth / 2) - 50 +"px");
    basicNode.style.setProperty("--Ypos", (window.innerHeight / 2) - 50 + "px");
    basicNode.shadowRoot.querySelector(".nodeName").textContent = "Default Node";
    basicNode.setAttribute("id", "Node0");
    document.querySelector("body").appendChild(basicNode);
    eventSetup(basicNode);
    localStorage.setItem("next-node-id", "1");
}

function addNode(e){
    const newNode = document.createElement("interactive-node");
    newNode.style.setProperty("--Xpos", e.clientX + "px");
    newNode.style.setProperty("--Ypos", e.clientY + "px");
    newNode.setAttribute("id", "Node" + localStorage.getItem("next-node-id"));
    localStorage.setItem("next-node-id", (parseInt(localStorage.getItem("next-node-id")) + 1).toString());
    document.querySelector("body").appendChild(newNode);
    eventSetup(newNode);
    const input = newNode.shadowRoot.querySelector(".nodeName")
    input.focus();
}

function eventSetup(node){
    node.addEventListener("dragstart", dragStartHandler);
    node.addEventListener("dragover", dragHandler);
    node.addEventListener("drop", dropHandler);
    node.addEventListener("dragend", dragEndHandler);
}

function dragStartHandler(e){
    DRAG_TARGET = e.target;
    e.dataTransfer.setDragImage(new Image, 0, 0);
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("dragging");
}

function dragHandler(e){
    e.preventDefault();
    DRAG_TARGET.style.setProperty("--Xpos", e.pageX - 50 + "px");
    DRAG_TARGET.style.setProperty("--Ypos", e.pageY - 50 + "px");
}

function dropHandler(e){
    e.preventDefault();
    if (DRAG_TARGET.id !== e.target.id){
        const objIndex = objectSearch([DRAG_TARGET.id, e.target.id], CONNECTED_NODES);
        if (objIndex === false) {
            CONNECTED_NODES.push([DRAG_TARGET.id, e.target.id]);
        } else {
            CONNECTED_NODES.splice(objIndex, 1);
        }
    }
    console.log(CONNECTED_NODES);
}

function objectSearch(obj, arr){
    for (let object of arr){
        if (JSON.stringify(object) === JSON.stringify(obj)){
            return arr.indexOf(object);
        }
    }
    return false;
}

function dragEndHandler(e){
    e.target.classList.remove("dragging");
    const nodeTarget = document.querySelector(`#${e.dataTransfer.getData("text")}`);
    document.querySelector("body").removeChild(nodeTarget);
    document.querySelector("body").appendChild(nodeTarget);
}

window.addEventListener("load", setUp);
const CONNECTED_NODES = [];
let DRAG_TARGET = undefined;





/*    eventSetup(document.querySelector("#end"))
    new LeaderLine(
        document.querySelector("#start"),
        document.querySelector("#end")
    )*/
