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
        this.addEventListener("dragstart", this.dragStart);
        this.addEventListener("dragover", this.dragEvent);
        this.addEventListener("dragend", this.dragEnd);
    }

    dragStart(e){
        const el = document.createElement("interactive-node");
        el.id = "FakeNode";
        el.hidden = true;
        document.querySelector("body").appendChild(el);
        e.dataTransfer.setDragImage(el, 0, 0);
    }

    dragEvent(e){
        this.style.setProperty("--Xpos", e.pageX - 50 + "px");
        this.style.setProperty("--Ypos", e.pageY - 50 + "px");
    }

    dragEnd(){
        document.querySelector("body").removeChild(document.querySelector("#FakeNode"));
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






dragStart(e){
        const el = document.createElement("interactive-node");
        el.hidden = true;
        document.querySelector("body").appendChild(el);
        e.dataTransfer.setDragImage(el, 0, 0);
    }

    dragEvent(e){
        this.style.setProperty("--Xpos", e.pageX - 50 + "px");
        this.style.setProperty("--Ypos", e.pageY - 50 + "px");
        console.log("test");
    }








            this.addEventListener("dragstart", this.dragStart);
        this.addEventListener("mousedown", this.mouseDown);
    }

    dragStart(e){
        e.preventDefault();
        return false;
    }

    mouseDown(e){
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseup", this.mouseUp);
    }

    mouseMove(e){
        e.target.style.setProperty("--Xpos", e.pageX - 50 + "px");
        e.target.style.setProperty("--Ypos", e.pageY - 50 + "px");
    }

    mouseUp(e){
        e.target.removeEventListener("mousemove", this.mouseMove);
        e.target.removeEventListener("mouseup", this.mouseUp);
    }
*/
