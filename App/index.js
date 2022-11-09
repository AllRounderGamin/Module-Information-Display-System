function setUp(){
    document.addEventListener("dblclick", addNode);
    const basicNode = document.createElement("interactive-node");
    basicNode.style.setProperty("--Xpos", (window.innerWidth / 2) - 50 +"px");
    basicNode.style.setProperty("--Ypos", (window.innerHeight / 2) - 50 + "px");
    basicNode.shadowRoot.querySelector(".nodeName").textContent = "Default Node";
    document.querySelector("body").appendChild(basicNode);
}

function addNode(e){
    const newNode = document.createElement("interactive-node");
    newNode.style.setProperty("--Xpos", e.clientX + "px");
    newNode.style.setProperty("--Ypos", e.clientY + "px");
    document.querySelector("body").appendChild(newNode);
    const input = newNode.shadowRoot.querySelector(".nodeName")
    input.focus();
}

window.addEventListener("load", setUp)
