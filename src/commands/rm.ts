import { exec } from "../command";
import { ExitCode, commandOutput } from "../commandOutput";
import { FileNodeType } from "../fileSystem";
import { cd } from "./cd";
import mri from "mri";

interface RmOptions {
  targetFileDir: string;
  targetFileName: string;
  targetFileExt: string;

  target: string;
}

const rmOptionsDefault: RmOptions = {
  targetFileDir: "",
  targetFileName: "",
  targetFileExt: "",

  target: "",
};

export class rm extends exec {
  options: RmOptions = rmOptionsDefault;

  protected parse(args: string[]): void {
    const opts = mri(args);
    this.options.target = opts._[0] || "";
    let tokens = this.options.target.split("/");

    const fileName = (tokens.pop() || "").split(".");
    this.options.targetFileExt = fileName.pop() || "";
    this.options.targetFileName = fileName.join(".");
    this.options.targetFileDir = tokens.join("/");
  }

  completion(_args: string[]): string[] {
    return [];
  }

  run(args: string[]): commandOutput {
    this.parse(args);

    const command = new cd();
    const targetNode = command.getTargetDir([this.options.targetFileDir]);

    if (!targetNode) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `touch : no such directory ${this.options.targetFileDir} [${this.options.target}]`,
      );
    }

    targetNode.nodes = targetNode.nodes.filter((node) => {
      return !(
        node.type === FileNodeType.file &&
        node.name === this.options.targetFileName &&
        node.ext === this.options.targetFileExt
      );
    });

    return new commandOutput(ExitCode.EXIT_SUCCESS, null, null);
  }

  man(): string {
    return ``;
  }
}
