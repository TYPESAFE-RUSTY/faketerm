import { FileNode, FileNodeType, rootDirectory } from "../fileSystem";

function traverseForPath(
  startNode: FileNode,
  endNode: FileNode,
  path: string[] = [],
): boolean {
  if (startNode === endNode) {
    return true;
  }

  for (let i = 0; i < startNode.nodes.length; i++) {
    let node = startNode.nodes[i];
    if (!node) continue;
    if (node.type === FileNodeType.file) continue;

    path.push(node.name);
    const found = traverseForPath(node, endNode, path);
    if (found) return true;
    path.pop();
  }

  return false;
}

export function path(startNode: FileNode, endNode: FileNode): string {
  let path: string[] = [rootDirectory];
  traverseForPath(startNode, endNode, path);
  return path.join("/");
}
