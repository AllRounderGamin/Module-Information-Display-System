/* eslint-disable no-undef */
import { updateDragPos } from './scripts/util.js';
import { connectLine } from './scripts/lineFunctions.js';
import { saveData } from './scripts/saving.js';

function setUp() {
  document.addEventListener('dblclick', addNode);
  const basicNode = createNode({ id: 'Node0', x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50, text: 'Default Node' });
  document.querySelector('body').appendChild(basicNode);
  localStorage.setItem('next-node-id', '1');
  document.addEventListener('dragover', dragOverHandler);
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
  node.addEventListener('drop', dropHandler);
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

function dropHandler(e) {
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

function dragEndHandler() {
  if (DRAG_TYPE === 'node') {
    document.querySelector('body').removeChild(DRAG_TARGET);
    document.querySelector('body').appendChild(DRAG_TARGET);
  } else if (DRAG_TYPE === 'arrow') {
    TEMP_LINE.remove();
  }
}

function save() {
  const nodeData = [];
  const nodeList = document.querySelectorAll('.node');
  for (const node of nodeList) {
    nodeData.push({
      id: node.id,
      text: node.querySelector('.nodeName').textContent,
      position: { x: node.dataset.x, y: node.dataset.y },
    });
  }
  console.log(saveData(nodeData, NODE_LIST));
}

const NODE_LIST = {};
let DRAG_TARGET;
let DRAG_TYPE;
let TEMP_LINE;
window.addEventListener('load', setUp);
