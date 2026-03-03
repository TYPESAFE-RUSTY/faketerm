import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";
import { FileNodeType } from "../fileSystem";
import { cd } from "./cd";
import mri from "mri";

interface RmdirOptions {
  targetDirName: string;
  targetDirLocation: string;
  target: string;
}

const rmdirOptionsDefault: RmdirOptions = {
  targetDirName: "",
  targetDirLocation: "",
  target: "",
};

export class rmdir extends exec {
  options: RmdirOptions = rmdirOptionsDefault;
  protected parse(args: string[]): void {
    const opts = mri(args);

    this.options.target = opts._[0] || "";
    const tokens = this.options.target.split("/");

    this.options.targetDirName = tokens.pop() || "";
    this.options.targetDirLocation = tokens.join("/");
  }

  completion(_args: string[]): string[] {
    return [];
  }

  run(args: string[]): commandOutput {
    this.parse(args);

    const command = new cd();
    const targetDir = command.getTargetDir([this.options.targetDirLocation]);
    if (!targetDir) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `mkdir : no such directory ${this.options.targetDirLocation} [${this.options.target}]`,
      );
    }

    targetDir.nodes = targetDir.nodes.filter((node) => {
      return !(
        node.type === FileNodeType.directory &&
        node.name === this.options.targetDirName &&
        node.nodes.length === 0
      );
    });

    return new commandOutput(ExitCode.EXIT_SUCCESS);
  }

  man(): string {
    return ``;
  }
}
