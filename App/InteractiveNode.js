import {CONNECTED_NODES} from "./index.js";

const NODE = document.createElement("template");
NODE.innerHTML = '<link href="./stylesheet.css" rel="stylesheet"> \n' +
    '<div class = "node" draggable="true">\n' +
    '   <p class="nodeName" contenteditable="true"></p> \n' +
    '</div>'

class InteractiveNode extends HTMLElement{

    constructor() {
        super();
        this.initialise();
    }

    initialise() {
        this.shadow = this.attachShadow({mode: "open"});
        this.shadow.appendChild(NODE.content.cloneNode(true));
        this.addEventListener("dragstart", this.dragStartHandler);
        this.addEventListener("dragover", this.dragEventHandler);
        this.addEventListener("dragend", this.dragEndHandler);
        this.addEventListener("dragover", this.dragOverHandler);
        this.addEventListener("drop", this.dropHandler);
    }

    dragStartHandler(e){
        const el = document.createElement("interactive-node");
        el.id = "FakeNode";
        el.hidden = true;
        document.querySelector("body").appendChild(el);
        e.dataTransfer.setDragImage(el, 0, 0);
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.classList.add("dragging");

        // add dragging class to stop others being dragged? - doesnt fire new event. Or to put underneath other nodes
    }

    dragEventHandler(e){
        this.style.setProperty("--Xpos", e.pageX - 50 + "px");
        this.style.setProperty("--Ypos", e.pageY - 50 + "px");
    }

    dragEndHandler(e){
        document.querySelector("body").removeChild(document.querySelector("#FakeNode"));
        e.target.classList.remove("dragging");
    }

    dragOverHandler(e){
        e.preventDefault()
    }

    dropHandler(e){
        e.preventDefault();
        if (e.dataTransfer.getData("text/plain") !== e.target.id) {
            CONNECTED_NODES.push([e.dataTransfer.getData("text/plain"), e.target.id]);
            console.log(CONNECTED_NODES);
        }
    }

    // event listeners for dragging and connecting(?)
    // Arrows may be here to depending how they work
}

customElements.define("interactive-node", InteractiveNode);



/*
        this.shadow.addEventListener("dragstart", this.dragStart);
        this.shadow.addEventListener("dragend", this.dragEnd);

dragStart(e){
    const fakeNode = document.createElement("interactive-node");
    fakeNode.style.setProperty("--Xpos", -1000 + "px");
    fakeNode.style.setProperty("--Ypos", -1000 + "px");
    fakeNode.shadowRoot.querySelector(".nodeName").textContent = e.target.querySelector(".nodeName").textContent
    document.querySelector("body").appendChild(fakeNode);
    e.dataTransfer.setDragImage(fakeNode, 0, 0);
    e.target.hidden = true;
}

dragEnd(e){
    e.target.hidden = false;
}

*/
