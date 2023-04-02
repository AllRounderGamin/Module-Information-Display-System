/* eslint-disable no-undef */
import { lineSearch } from './util.js';

// makes the arrow tipped at both ends and adds the new lineName to the key lists
function doubleTippedArrow(NODE_LIST, startNode, endNode) {
  const nodeLinkObj = lineSearch(NODE_LIST[endNode], startNode, 'to');
  const line = nodeLinkObj.line;
  if (nodeLinkObj.endPoint) {
    line.endPlug = 'arrow1';
    NODE_LIST[startNode].push({ linked_to: endNode, line });
  } else {
    line.startPlug = 'arrow1';
    NODE_LIST[startNode].push({ linked_to: endNode, line, endPoint: true });
  }
  NODE_LIST[endNode].push({ linked_from: startNode, line });
}

// creates new LeaderLine obj and adds to storage
function createNewLine(NODE_LIST, startNode, endNode) {
  const line = new LeaderLine(
    startNode,
    endNode,
    { gradient: true, startPlugColor: '#009fe2', endPlugColor: '#621362' },
  );
  // to make sure line.position is updated regardless of what node is dragged, both nodes need an entry
  // I have differentiated the two types to not upset the tipping arrow logic, maybe there is a better way around this?
  NODE_LIST[startNode.id].push({ linked_to: endNode.id, line });
  NODE_LIST[endNode.id].push({ linked_from: startNode.id, line });
}

// removes one of the arrow tips depending on user input and what arrow came first
function unDoubleTipArrow(NODE_LIST, startNode, endNode) {
  let nodeLinkObj = lineSearch(NODE_LIST[startNode], endNode, 'to');
  let lineIndex = NODE_LIST[startNode].indexOf(nodeLinkObj);
  if (nodeLinkObj.endPoint) {
    nodeLinkObj.line.startPlug = 'behind';
  } else {
    nodeLinkObj.line.endPlug = 'behind';
  }
  NODE_LIST[startNode].splice(lineIndex, 1);
  nodeLinkObj = lineSearch(NODE_LIST[endNode], startNode, 'from');
  lineIndex = NODE_LIST[endNode].indexOf(nodeLinkObj);
  NODE_LIST[endNode].splice(lineIndex, 1);
}

// completely removes line object from page and storage
function removeLine(NODE_LIST, startNode, endNode) {
  let nodeLinkObj = lineSearch(NODE_LIST[startNode], endNode, 'to');
  let lineIndex = NODE_LIST[startNode].indexOf(nodeLinkObj);
  nodeLinkObj.line.remove();
  NODE_LIST[startNode].splice(lineIndex, 1);
  nodeLinkObj = lineSearch(NODE_LIST[endNode], startNode, 'from');
  lineIndex = NODE_LIST[endNode].indexOf(nodeLinkObj);
  NODE_LIST[endNode].splice(lineIndex, 1);
}

// function for deciding how to correctly connect nodes
function connectLine(NODE_LIST, startNode, endNode) {
  // checks to see if the line already exists or if the inverse line exists, if so makes the line 'double tipped'
  if (lineSearch(NODE_LIST[startNode.id], endNode.id, 'to') === false) {
    if (lineSearch(NODE_LIST[endNode.id], startNode.id, 'to') !== false) {
      doubleTippedArrow(NODE_LIST, startNode.id, endNode.id);
      console.log(JSON.stringify(NODE_LIST));
      return;
    }
    // if line and inverse line does not exist makes a new line object
    createNewLine(NODE_LIST, startNode, endNode);
  } else {
    // if inverse line key exists, modify existing line back to single tipped
    if (lineSearch(NODE_LIST[endNode.id], startNode.id, 'to') !== false) {
      unDoubleTipArrow(NODE_LIST, startNode.id, endNode.id);
      console.log(JSON.stringify(NODE_LIST));
    } else {
      removeLine(NODE_LIST, startNode.id, endNode.id);
    }
  }
}

export { connectLine };
