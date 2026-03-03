import { exec } from "./command.js";
import { type FileNode, rootNode, rootDirectory } from "./fileSystem.js";

export interface TerminalContext {
  // modifiable by lib user.
  shellName: string;
  currentUser: string;
  // reserved for use by commands.
  fileSystem: FileNode;
  currentNodeRef: FileNode;
  currentWorkingDirectory: string;
  // for terminal behaviour.
  commandHistoryLength: number;
  commandHistory: string[];
  // command registry (similar to path variable ig)
  commandRegistry: Map<string, exec>;
}

export const initContext: TerminalContext = {
  shellName: "fake-sh",
  currentUser: "rusty",
  fileSystem: rootNode,
  currentNodeRef: rootNode,
  currentWorkingDirectory: rootDirectory,
  commandHistoryLength: 10,
  commandHistory: [],
  commandRegistry: new Map<string, exec>(),
};
