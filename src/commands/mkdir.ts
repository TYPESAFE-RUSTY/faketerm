import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";
import mri from "mri";
import { FileNode, FileNodeType } from "../fileSystem";
import { cd } from "./cd";

interface MkdirOptions {
  targetDirName: string;
  targetDirLocation: string;
  target: string;
}

const mkdirOptionsDefault: MkdirOptions = {
  targetDirName: "",
  targetDirLocation: "",
  target: "",
};

export class mkdir extends exec {
  options: MkdirOptions = mkdirOptionsDefault;

  parse(args: string[]): void {
    const opts = mri(args);

    this.options.target = opts._[0] || "";
    const tokens = this.options.target.split("/");

    this.options.targetDirName = tokens.pop() || "";
    this.options.targetDirLocation = tokens.join("/");
  }

  run(): commandOutput {
    const command = new cd();
    command.parse([this.options.targetDirLocation]);
    const targetDir = command.getTargetDir();
    if (!targetDir) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `mkdir : no such directory ${this.options.targetDirLocation} [${this.options.target}]`,
      );
    }

    // check if the dir already exists
    const exists = targetDir.nodes.filter(
      (node) => node.name === this.options.targetDirName,
    );
    if (exists.length > 0) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `mkdir : directory already exists ${this.options.targetDirName} [${this.options.target}]`,
      );
    }

    const dir: FileNode = {
      name: this.options.targetDirName,
      type: FileNodeType.directory,
      nodes: [],
      ext: null,
      content: null,
      parentNode: {
        name: "..",
        node: targetDir,
      },
    };

    targetDir.nodes.push(dir);
    return new commandOutput(ExitCode.EXIT_SUCCESS);
  }

  man(): string {
    return ``;
  }
}
