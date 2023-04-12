function createJsonldData(nodes, NODE_LIST) {
  const data = [];
  for (const node of nodes) {
    const links = [];
    for (const nodeObj of NODE_LIST[node.id]) {
      if (nodeObj.linked_to) {
        links.push(nodeObj.linked_to);
      }
    }
    const object = {
      '@context': 'UOP:Node',
      'id': node.id,
      'text': node.text,
      'position': node.position,
      'links_to': links,
    };
    data.push(object);
  }
  return data;
}

export { createJsonldData };
