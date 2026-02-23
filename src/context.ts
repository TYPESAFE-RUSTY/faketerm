import { type FileNode, rootNode, rootDirectory } from "./fileSystem.js";

export interface TerminalContext {
  shellName: string;
  fileSystem: FileNode;
  currentUser: string;
  currentNodeRef: FileNode;
  currentWorkingDirectory: string;
  commandHistoryLength: number;
  commandHistory: string[];
}

export const initContext = {
  shellName: "fake-sh",
  fileSystem: rootNode,
  currentUser: "rusty",
  currentNodeRef: rootNode,
  currentWorkingDirectory: rootDirectory,
  commandHistoryLength: 10,
  commandHistory: [],
};
