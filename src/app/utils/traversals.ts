
export function breadthFirstBy(rootNode, getChildren, iteratee) {
  const queue = [rootNode];
  while (queue.length) {
    const currentNode = queue.shift();
    iteratee(currentNode);
    const children = getChildren(currentNode);
    queue.push(...children);
  }
}

export function reverseBreadthFirstBy(rootNode, getChildren, iteratee) {
  const stack = [];
  breadthFirstBy(rootNode, getChildren, (node: any) => {
    stack.push(node);
  });
  for (let i = stack.length - 1; i >= 0; i--) {
    iteratee(stack[i]);
  }
}
