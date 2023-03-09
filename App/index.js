/* eslint-disable no-undef */
import { updateDragPos, objectSearch, lineSearch } from './scripts/util.js';
import { createNewLine, doubleTippedArrow, unDoubleTipArrow, removeLine } from './scripts/lineFunctions.js';

function setUp() {
  document.addEventListener('dblclick', addNode);
  const basicNode = createNode({ id: 'Node0', x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50, text: 'Default Node' });
  document.querySelector('body').appendChild(basicNode);
  localStorage.setItem('next-node-id', '1');
  document.addEventListener('dragover', dragOverHandler);
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
    if (CONNECTED_NODES[DRAG_TARGET.id]) {
      for (const lineObj of CONNECTED_NODES[DRAG_TARGET.id].lines) {
        lineObj.line.position();
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
  let dropTarget;
  if (e.target.getAttribute('parent-id') != null) {
    dropTarget = document.querySelector(`#${e.target.getAttribute('parent-id')}`);
  } else {
    dropTarget = e.target;
  }
  DRAG_TARGET = document.querySelector(`#${DRAG_TARGET.getAttribute('parent-id')}`);
  const lineName = DRAG_TARGET.id + dropTarget.id;
  const inverseLine = dropTarget.id + DRAG_TARGET.id;
  if (DRAG_TARGET.id !== dropTarget.id && DRAG_TARGET.id.length > 0 && dropTarget.id.length > 0) {
    // checks to see if the line already exists or if the inverse line exists
    if (lineSearch(CONNECTED_NODES, DRAG_TARGET, lineName, dropTarget) === false) {
      if (objectSearch(inverseLine, CONNECTED_NODES[DRAG_TARGET.id].keys) !== false) {
        doubleTippedArrow(CONNECTED_NODES, DRAG_TARGET, lineName, inverseLine, dropTarget);
        return;
      }
      // if line and inverse line does not exist makes a new line object
      createNewLine(CONNECTED_NODES, DRAG_TARGET, lineName, dropTarget);
    } else {
      // if inverse line key exists, modify existing line back to single tipped
      if (objectSearch(inverseLine, CONNECTED_NODES[DRAG_TARGET.id].keys) !== false) {
        unDoubleTipArrow(CONNECTED_NODES, DRAG_TARGET, lineName, inverseLine, dropTarget);
        return;
      } else {
        removeLine(CONNECTED_NODES, DRAG_TARGET, lineName, dropTarget);
      }
    }
    console.log(CONNECTED_NODES);
  }
}

function dragEndHandler() {
  if (DRAG_TYPE === 'node') {
    document.querySelector('body').removeChild(DRAG_TARGET);
    document.querySelector('body').appendChild(DRAG_TARGET);
  } else if (DRAG_TYPE === 'arrow') {
    TEMP_LINE.remove();
  }
}

const CONNECTED_NODES = {};
let DRAG_TARGET;
let DRAG_TYPE;
let TEMP_LINE;
window.addEventListener('load', setUp);
