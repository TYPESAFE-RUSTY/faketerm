import { exec } from "../command.js";
import { commandOutput, ExitCode } from "../commandOutput.js";

export class pwd extends exec {
  protected parse(_args: string[]): void {
    // ignore any args
  }

  run(args: string[]): commandOutput {
    this.parse(args);

    return new commandOutput(
      ExitCode.EXIT_SUCCESS,
      this.context.currentWorkingDirectory,
    );
  }

  man(): string {
    return `
NAME
      pwd - output the current working directory

SYNOPSIS
      pwd

DESCRIPTION
      pwd outputs (prints) the current working directory.

AUTHOR
      Written by TypesafeRusty.

INSPIRATION
      pwd from GNU coreutils.
    `;
  }
}
