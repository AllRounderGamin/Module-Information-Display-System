/* eslint-disable no-undef */
import { keySearch } from './util.js';

// makes the arrow tipped at both ends and adds the new lineName to the key lists
function doubleTippedArrow(CONNECTED_NODES, DRAG_TARGET, lineName, inverseLine, dropTarget) {
  let lineIndex = keySearch(CONNECTED_NODES[DRAG_TARGET.id].lines, inverseLine);
  CONNECTED_NODES[DRAG_TARGET.id].lines[lineIndex].line.startPlug = 'arrow1';
  CONNECTED_NODES[DRAG_TARGET.id].lines[lineIndex].keys.push(lineName);
  CONNECTED_NODES[DRAG_TARGET.id].keys.push(lineName);
  lineIndex = keySearch(CONNECTED_NODES[dropTarget.id].lines, inverseLine);
  CONNECTED_NODES[dropTarget.id].lines[lineIndex].keys.push(lineName);
  CONNECTED_NODES[dropTarget.id].keys.push(lineName);
}

// creates new LeaderLine obj and adds to storage
function createNewLine(CONNECTED_NODES, DRAG_TARGET, lineName, dropTarget) {
  const line = new LeaderLine(
    DRAG_TARGET,
    dropTarget,
    { gradient: true, startPlugColor: '#009fe2', endPlugColor: '#621362' },
  );
  CONNECTED_NODES[DRAG_TARGET.id].lines.push({ line, keys: [lineName] });
  CONNECTED_NODES[DRAG_TARGET.id].keys.push(lineName);
  CONNECTED_NODES[dropTarget.id].lines.push({ line, keys: [lineName] });
  CONNECTED_NODES[dropTarget.id].keys.push(lineName);
}

// removes one of the arrow tips depending on user input and what arrow came first
function unDoubleTipArrow(CONNECTED_NODES, DRAG_TARGET, lineName, inverseLine, dropTarget) {
  let lineIndex = keySearch(CONNECTED_NODES[dropTarget.id].lines, inverseLine);
  let removalIndex;
  if (CONNECTED_NODES[dropTarget.id].lines[lineIndex].keys[0] === lineName) {
    CONNECTED_NODES[dropTarget.id].lines[lineIndex].line.endPlug = 'behind';
  } else {
    CONNECTED_NODES[dropTarget.id].lines[lineIndex].line.startPlug = 'behind';
  }
  const removalTarget = lineName;
  removalIndex = CONNECTED_NODES[dropTarget.id].lines[lineIndex].keys.indexOf(removalTarget);
  CONNECTED_NODES[dropTarget.id].lines[lineIndex].keys.splice(removalIndex, 1);
  CONNECTED_NODES[dropTarget.id].keys.splice(removalIndex, 1);
  lineIndex = keySearch(CONNECTED_NODES[DRAG_TARGET.id].lines, removalTarget);
  removalIndex = CONNECTED_NODES[DRAG_TARGET.id].lines[lineIndex].keys.indexOf(removalTarget);
  CONNECTED_NODES[DRAG_TARGET.id].lines[lineIndex].keys.splice(removalIndex, 1);
  CONNECTED_NODES[DRAG_TARGET.id].keys.splice(removalIndex, 1);
}

// completely removes line object from page and storage
function removeLine(CONNECTED_NODES, DRAG_TARGET, lineName, dropTarget) {
  let objIndex = keySearch(CONNECTED_NODES[DRAG_TARGET.id].lines, lineName);
  CONNECTED_NODES[DRAG_TARGET.id].lines[objIndex].line.remove();
  CONNECTED_NODES[DRAG_TARGET.id].lines.splice(objIndex, 1);
  CONNECTED_NODES[DRAG_TARGET.id].keys.splice(CONNECTED_NODES[DRAG_TARGET.id].keys.indexOf(lineName), 1);

  objIndex = keySearch(CONNECTED_NODES[dropTarget.id].lines, lineName);
  CONNECTED_NODES[dropTarget.id].lines.splice(objIndex, 1);
  CONNECTED_NODES[dropTarget.id].keys.splice(CONNECTED_NODES[dropTarget.id].keys.indexOf(lineName), 1);
}

export { createNewLine, doubleTippedArrow, unDoubleTipArrow, removeLine };
