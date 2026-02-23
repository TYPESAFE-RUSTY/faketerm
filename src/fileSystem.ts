export enum FileNodeType {
  file = "FILE",
  directory = "DIR",
}

interface NodeRef {
  name: string;
  node: FileNode | null;
}

export interface FileNode {
  name: string;
  ext: null | string;
  type: FileNodeType;
  nodes: FileNode[];
  parentNode: NodeRef | null;
  content: string | null;
}

function fillParentNode(node: FileNode, parentNode: FileNode | null = null) {
  const dirs = node.nodes.filter((_) => _.type === FileNodeType.directory);

  dirs.forEach((dir) => {
    dir.parentNode = { name: "..", node: parentNode };

    fillParentNode(dir, dir);
  });
}

export function parseFileNode(input: string) {
  let fileSystemRoot: FileNode = JSON.parse(input);
  fillParentNode(fileSystemRoot, fileSystemRoot);
  fileSystemRoot.parentNode = null;
  fileSystemRoot.name = rootDirectory;
  return fileSystemRoot;
}

// is there a way to do this without mutating original node??
// function removeParentNode(node: FileNode) {
//   const dirs = node.nodes.filter((_) => _.type === FileNodeType.directory);

//   dirs.forEach((dir) => {
//     dir.parentNode = null;
//     removeParentNode(dir);
//   });
// }

// export function serializeFileNode(input: FileNode): FileNode {
//   removeParentNode(input);
//   return input;
// }

// basic constant utilities
export const rootDirectory = "~";
export const rootNode: FileNode = {
  name: rootDirectory,
  ext: null,
  type: FileNodeType.directory,
  nodes: [],
  parentNode: null,
  content: null,
};
