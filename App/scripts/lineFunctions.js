/* eslint-disable no-undef */
import { lineSearch } from './util.js';

// makes the arrow tipped at both ends and adds the new lineName to the key lists
function doubleTippedArrow(NODE_LIST, startNode, endNode) {
  const nodeLinkObj = lineSearch(NODE_LIST[endNode], startNode);
  const line = nodeLinkObj.line;
  if (nodeLinkObj.endPoint) {
    line.endPlug = 'arrow1';
    NODE_LIST[startNode].push({ linked: endNode, line });
  } else {
    line.startPlug = 'arrow1';
    NODE_LIST[startNode].push({ linked: endNode, line, endPoint: true });
  }
}

// creates new LeaderLine obj and adds to storage
function createNewLine(NODE_LIST, startNode, endNode) {
  const line = new LeaderLine(
    startNode,
    endNode,
    { gradient: true, startPlugColor: '#009fe2', endPlugColor: '#621362' },
  );
  NODE_LIST[startNode.id].push({ linked: endNode.id, line });
}

// removes one of the arrow tips depending on user input and what arrow came first
function unDoubleTipArrow(NODE_LIST, startNode, endNode) {
  const nodeLinkObj = lineSearch(NODE_LIST[startNode], endNode);
  const lineIndex = NODE_LIST[startNode].indexOf(nodeLinkObj);
  if (nodeLinkObj.endPoint) {
    nodeLinkObj.line.startPlug = 'behind';
  } else {
    nodeLinkObj.line.endPlug = 'behind';
  }
  NODE_LIST[startNode].splice(lineIndex, 1);
}

// completely removes line object from page and storage
function removeLine(NODE_LIST, startNode, endNode) {
  const nodeLinkObj = lineSearch(NODE_LIST[startNode], endNode);
  nodeLinkObj.line.remove();
  const lineIndex = NODE_LIST[startNode].indexOf(nodeLinkObj);
  NODE_LIST[startNode].splice(lineIndex, 1);
}

// function for deciding how to correctly connect nodes
function connectLine(NODE_LIST, startNode, endNode) {
  // checks to see if the line already exists or if the inverse line exists, if so makes the line 'double tipped'
  if (lineSearch(NODE_LIST[startNode.id], endNode.id) === false) {
    if (lineSearch(NODE_LIST[endNode.id], startNode.id) !== false) {
      doubleTippedArrow(NODE_LIST, startNode.id, endNode.id);
      console.log(JSON.stringify(NODE_LIST));
      return;
    }
    // if line and inverse line does not exist makes a new line object
    createNewLine(NODE_LIST, startNode, endNode);
  } else {
    // if inverse line key exists, modify existing line back to single tipped
    if (lineSearch(NODE_LIST[endNode.id], startNode.id) !== false) {
      unDoubleTipArrow(NODE_LIST, startNode.id, endNode.id);
      console.log(JSON.stringify(NODE_LIST));
    } else {
      removeLine(NODE_LIST, startNode.id, endNode.id);
    }
  }
}

export { connectLine };
