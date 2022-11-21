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
    }
}

customElements.define("interactive-node", InteractiveNode);
