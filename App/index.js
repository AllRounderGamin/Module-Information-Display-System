/* eslint-disable no-undef */
import { updateDragPos } from './scripts/util.js';
import { connectLine } from './scripts/lineFunctions.js';
import { createJsonldData } from './scripts/saving.js';

function setUp() {
  document.addEventListener('dblclick', addNode);
  const basicNode = createNode({ id: 'Node0', x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50, text: 'Default Node' });
  document.body.appendChild(basicNode);
  document.addEventListener('dragover', dragOverHandler);
  document.body.addEventListener('drop', fileDropHandler);
  document.querySelector('#saveButton').addEventListener('click', save);
}

function addNode(e) {
  if (e.target !== document.body) {
    return;
  }
  const newID = 'Node' + localStorage.getItem('next-node-id');
  const newNode = createNode({ id: newID, x: e.clientX, y: e.clientY, text: 'Placeholder' });
  localStorage.setItem('next-node-id', (parseInt(localStorage.getItem('next-node-id')) + 1).toString());
  document.querySelector('body').appendChild(newNode);
}

function createNode(settings) {
  const newNode = document.querySelector('#nodeTemplate').content.cloneNode(true);
  const newNodeDiv = newNode.querySelector('.node');
  const newNodeText = newNodeDiv.querySelector('.nodeName');
  newNodeDiv.style.setProperty('--Xpos', settings.x + 'px');
  newNodeDiv.style.setProperty('--Ypos', settings.y + 'px');
  newNodeDiv.dataset.x = (settings.x).toString();
  newNodeDiv.dataset.y = (settings.y).toString();
  newNodeDiv.setAttribute('id', settings.id);
  newNodeText.setAttribute('parent-id', settings.id);
  newNodeText.textContent = settings.text;
  newNodeDiv.querySelector('.drag-dot').setAttribute('parent-id', settings.id);
  eventSetup(newNodeDiv);
  NODE_LIST[settings.id] = [];
  return newNode;
}

function eventSetup(node) {
  node.addEventListener('dragstart', dragStartHandler);
  node.addEventListener('drop', nodeDropHandler);
  node.addEventListener('dragend', dragEndHandler);
}

function dragStartHandler(e) {
  DRAG_TARGET = e.target;
  e.dataTransfer.setDragImage(new Image(), 0, 0);
  if (e.target.hasAttribute('id')) {
    DRAG_TYPE = 'node';
  } else if (e.target.hasAttribute('parent-id')) {
    DRAG_TYPE = 'arrow';
    TEMP_LINE = new LeaderLine(document.querySelector(`#${e.target.getAttribute('parent-id')}`),
      LeaderLine.pointAnchor(document, { x: e.pageX, y: e.pageY }), {
        gradient: true,
        startPlugColor: '#009fe2',
        endPlugColor: '#621362',
        dash: { animation: true },
      });
  }
}

function dragOverHandler(e) {
  e.preventDefault();
  if (!DRAG_TARGET) {
    return;
  }
  if (DRAG_TYPE === 'node') {
    updateDragPos(DRAG_TARGET, { x: e.pageX, y: e.pageY });
    if (NODE_LIST[DRAG_TARGET.id]) {
      for (const obj of NODE_LIST[DRAG_TARGET.id]) {
        obj.line.position();
      }
    }
  } else if (DRAG_TYPE === 'arrow') {
    TEMP_LINE.end = LeaderLine.pointAnchor({ element: document.body, x: e.pageX, y: e.pageY });
  }
}

function nodeDropHandler(e) {
  e.preventDefault();
  // cancels event if a node was dropped and not an arrow
  if (DRAG_TYPE === 'node') {
    return;
  }
  // updates drop target to be the node so that the arrow doesnt try to connect to a div inside the node
  let endNode;
  if (e.target.getAttribute('parent-id') != null) {
    endNode = document.querySelector(`#${e.target.getAttribute('parent-id')}`);
  } else {
    endNode = e.target;
  }
  const startNode = document.querySelector(`#${DRAG_TARGET.getAttribute('parent-id')}`);
  if (startNode.id !== endNode.id && startNode.id.length > 0 && endNode.id.length > 0) {
    connectLine(NODE_LIST, startNode, endNode);
  }
  console.log(JSON.stringify(NODE_LIST));
}

function fileDropHandler(e) {
  e.preventDefault();
  if (e.dataTransfer.files[0]) {
    const fileName = e.dataTransfer.files[0].name.split('.');
    // eslint-disable-next-line no-constant-condition
    if (fileName[fileName.length - 1] === 'json' || 'jsonld') {
      const reader = new FileReader();
      reader.readAsText(e.dataTransfer.files[0]);
      reader.onload = () => { loadData(reader.result); };
    }
  }
}

function dragEndHandler() {
  // Re-adds node so that it remains on top of wherever dropped
  if (DRAG_TYPE === 'node') {
    document.body.removeChild(DRAG_TARGET);
    document.body.appendChild(DRAG_TARGET);
  } else if (DRAG_TYPE === 'arrow') {
    TEMP_LINE.remove();
  }
  DRAG_TARGET = null;
}

function save(dataReq = false) {
  const nodeData = [];
  const nodeList = document.querySelectorAll('.node');
  for (const node of nodeList) {
    nodeData.push({
      id: node.id,
      text: node.querySelector('.nodeName').textContent,
      position: { x: node.dataset.x, y: node.dataset.y },
    });
  }
  const jsonldData = JSON.stringify((createJsonldData(nodeData, NODE_LIST)), null, 4);
  if (dataReq === true) {
    return jsonldData;
  }
  document.querySelector('#downloadLink').href = 'data:application/javascript;charset=utf-8,' + encodeURIComponent(jsonldData);
}

function loadData(file) {
  const data = JSON.parse(file);
  const backup = save(true);
  try {
    for (const node of document.querySelectorAll('.node')) {
      node.remove();
      delete NODE_LIST[node.id];
    }
    for (const line of document.querySelectorAll('.leader-line')) {
      line.remove();
    }
    for (const node of data) {
      console.log(node);
      const newNode = createNode({ id: node.id, x: node.position.x, y: node.position.y, text: node.text });
      document.body.appendChild(newNode);
    }
    for (const node of data) {
      for (const line of node.links_to) {
        console.log(NODE_LIST, node.id, line, document.querySelector(`#${node.id}`), document.querySelector(`#${line}`));
        connectLine(NODE_LIST, document.querySelector(`#${node.id}`), document.querySelector(`#${line}`));
      }
    }
  } catch (error) {
    console.error('File could not be loaded, reverting data');
    console.error(error);
    loadData(backup);
  }
}

const NODE_LIST = {};
let DRAG_TARGET;
let DRAG_TYPE;
let TEMP_LINE;
window.addEventListener('load', setUp);
