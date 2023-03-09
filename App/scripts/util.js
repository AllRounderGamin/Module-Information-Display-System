function updateDragPos(dragTarget, pos) {
  dragTarget.style.setProperty('--Xpos', pos.x - 50 + 'px');
  dragTarget.style.setProperty('--Ypos', pos.y - 50 + 'px');
  dragTarget.dataset.x = (pos.x - 50).toString();
  dragTarget.dataset.y = (pos.y - 50).toString();
}

function objectSearch(obj, arr) {
  for (const object of arr) {
    if (JSON.stringify(object) === JSON.stringify(obj)) {
      return arr.indexOf(object);
    }
  }
  return false;
}

function keySearch(arr, key) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].keys.includes(key)) {
      return i;
    }
  }
  return false;
}

// checks both targets for existence of line and also creates an object for the node if it does not exist
function lineSearch(CONNECTED_NODES, DRAG_TARGET, lineName, dropTarget) {
  let found = false;
  if (CONNECTED_NODES[DRAG_TARGET.id]) {
    found = objectSearch(lineName, CONNECTED_NODES[DRAG_TARGET.id].keys);
  } else {
    CONNECTED_NODES[DRAG_TARGET.id] = { lines: [], keys: [] };
  }
  if (!CONNECTED_NODES[dropTarget.id]) {
    CONNECTED_NODES[dropTarget.id] = { lines: [], keys: [] };
  }
  return found;
}

export { updateDragPos, objectSearch, keySearch, lineSearch };
