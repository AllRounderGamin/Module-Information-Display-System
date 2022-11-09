const NODE = document.createElement("template");
NODE.innerHTML = '<link href="./stylesheet.css" rel="stylesheet"> \n' +
    '<div class = "node">\n' +
    '   <p class="nodeName" contenteditable="true"></p> \n' +
    '</div>'

class InteractiveNode extends HTMLElement{

    constructor() {
        super();
        this.initialise();
    }

    initialise(){
        this.shadow = this.attachShadow({mode: "open"});
        this.shadow.appendChild(NODE.content.cloneNode(true));
    }

    // event listeners for dragging and connecting(?)
    // Arrows may be here to depending how they work
}

customElements.define("interactive-node", InteractiveNode);
