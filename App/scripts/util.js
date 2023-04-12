function updateDragPos(dragTarget, pos) {
  dragTarget.style.setProperty('--Xpos', pos.x - 50 + 'px');
  dragTarget.style.setProperty('--Ypos', pos.y - 50 + 'px');
  dragTarget.dataset.x = (pos.x - 50).toString();
  dragTarget.dataset.y = (pos.y - 50).toString();
}

// Searches through given array to find object representing the line linked to endNode, returns false if does not exist
function lineSearch(node, endNode, type) {
  if (type === 'to') {
    for (const obj of node) {
      if (obj.linked_to === endNode) {
        return obj;
      }
    }
  } else if (type === 'from') {
    for (const obj of node) {
      if (obj.linked_from === endNode) {
        return obj;
      }
    }
  }
  return false;
}

export { updateDragPos, lineSearch };
