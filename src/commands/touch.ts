import mri from "mri";
import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";
import { FileNode, FileNodeType } from "../fileSystem";
import { cd } from "./cd";

interface TouchOptions {
  targetFileDir: string;
  targetFileName: string;
  targetFileExt: string;

  target: string;
}

const touchDefaults: TouchOptions = {
  targetFileDir: "",
  targetFileName: "",
  targetFileExt: "",

  target: "",
};

export class touch extends exec {
  options: TouchOptions = touchDefaults;

  parse(args: string[]): void {
    const opts = mri(args);
    this.options.target = opts._[0] || "";
    let tokens = this.options.target.split("/");

    const fileName = (tokens.pop() || "").split(".");
    this.options.targetFileExt = fileName.pop() || "";
    this.options.targetFileName = fileName.join(".");
    this.options.targetFileDir = tokens.join("/");
  }

  run(): commandOutput {
    const command = new cd();
    command.parse([this.options.targetFileDir]);
    const targetNode = command.getTargetDir();

    if (!targetNode) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `touch : no such directory ${this.options.targetFileDir} [${this.options.target}]`,
      );
    }

    // check if the file already exists.
    const exists = targetNode.nodes.filter(
      (node) =>
        node.name === this.options.targetFileName &&
        node.ext === this.options.targetFileExt,
    );

    if (exists.length > 0) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `touch : file already exists ${this.options.targetFileName}.${this.options.targetFileExt} [${this.options.target}]`,
      );
    }

    const fileNode: FileNode = {
      name: this.options.targetFileName,
      ext: this.options.targetFileExt,
      type: FileNodeType.file,
      nodes: [],
      parentNode: null,
      content: "",
    };

    targetNode.nodes.push(fileNode);
    return new commandOutput(ExitCode.EXIT_SUCCESS, null, null);
  }

  man(): string {
    return ``;
  }
}
