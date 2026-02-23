import mri from "mri";
import { exec } from "../command.js";
import { commandOutput, ExitCode } from "../commandOutput.js";
import {
  FileNode,
  FileNodeType,
  rootDirectory,
  rootNode,
} from "../fileSystem.js";
import { path } from "../utils/path.js";

interface CdOptions {
  targetDir: string | null;
  intermediateDirRef: FileNode;
}

const cdOptionDefault: CdOptions = {
  targetDir: null,
  intermediateDirRef: rootNode,
};

export class cd extends exec {
  options: CdOptions = cdOptionDefault;

  parse(args: string[]): void {
    const opts = mri(args);
    // if named args / more args passed return error

    this.options.targetDir = opts._[0] || null;
    this.options.intermediateDirRef = this.options.targetDir?.startsWith(
      rootDirectory,
    )
      ? this.context.fileSystem
      : this.context.currentNodeRef;

    // remove trailing slash
    const trailingSlash = this.options.targetDir?.endsWith("/");
    if (trailingSlash)
      this.options.targetDir =
        this.options.targetDir?.slice(0, this.options.targetDir.length - 1) ||
        null;
  }

  private travelToDir(
    target: string[] = this.options.targetDir?.split("/").reverse() || [],
  ) {
    if (target.length === 0) return;
    const current = target.pop();
    if (!current) throw "no such directory";

    if (current === "..") {
      if (!this.options.intermediateDirRef.parentNode?.node)
        throw "no such directory";

      this.options.intermediateDirRef =
        this.options.intermediateDirRef.parentNode.node;
    } else if (current === ".") {
      // do nothing ;)
    } else {
      const dirs = this.options.intermediateDirRef.nodes.filter(
        (node) => node.type === FileNodeType.directory && node.name === current,
      );
      if (!dirs[0]) throw "no such directory";

      this.options.intermediateDirRef = dirs[0];
    }

    this.travelToDir(target);
  }

  public getTargetDir(): FileNode | null {
    try {
      this.travelToDir();
      return this.options.intermediateDirRef;
    } catch (e) {
      return null;
    }
  }

  run(): commandOutput {
    if (!this.options.targetDir) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        "Usage: cd [target dir]",
      );
    }

    try {
      this.travelToDir();
      this.context.currentNodeRef = this.options.intermediateDirRef;
      this.context.currentWorkingDirectory = path(
        this.context.fileSystem,
        this.context.currentNodeRef,
      );
      return new commandOutput(ExitCode.EXIT_SUCCESS);
    } catch (e) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `cd : ${e} [${this.options.targetDir}]`,
      );
    }
  }
  man(): string {
    return ``;
  }
}
