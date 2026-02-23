import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";
import mri from "mri";
import { cd } from "./cd";
import { FileNode, FileNodeType } from "../fileSystem";

interface CatOptions {
  targetDirPath: string;
  targetFileName: string;
  target: string;
}

const defaultCatOption: CatOptions = {
  targetDirPath: "",
  targetFileName: "",
  target: "",
};

export class cat extends exec {
  options: CatOptions = defaultCatOption;
  parse(args: string[]): void {
    const opts = mri(args);

    this.options.target = opts._[0] || "";
    let tokens = this.options.target.split("/");

    this.options.targetFileName = tokens.pop() || "";
    this.options.targetDirPath = tokens.join("/");
  }

  private getContentsFromTarget(): string {
    if (this.options.targetFileName === "") throw "no such file";

    const helper = new cd();
    helper.parse([this.options.targetDirPath]);
    const targetDirectory: FileNode =
      helper.getTargetDir() || this.context.currentNodeRef;

    const file = targetDirectory.nodes.find(
      (node) =>
        node.type === FileNodeType.file &&
        this.options.targetFileName === `${node.name}.${node.ext}`,
    );

    if (!file) throw "no such file";

    return file.content || "";
  }

  run(): commandOutput {
    if (this.stdin) {
      return new commandOutput(ExitCode.EXIT_SUCCESS, this.stdin);
    }

    try {
      return new commandOutput(
        ExitCode.EXIT_SUCCESS,
        this.getContentsFromTarget(),
      );
    } catch (e) {
      return new commandOutput(
        ExitCode.EXIT_FAILURE,
        null,
        `cat : ${e} [${this.options.target}]`,
      );
    }
  }

  man(): string {
    return `
NAME
      cat - concatenate files and print on the standard output

SYNOPSIS
      ls [FILE]

DESCRIPTION
      Concatenate FILE(s) to standard output.

      With no FILE, read standard input.

AUTHOR
      Written by TypesafeRusty.
    `;
  }
}
