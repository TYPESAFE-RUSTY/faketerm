import mri from "mri";
import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";

export class echo extends exec {
  options: string[] = [];

  parse(args: string[]): void {
    this.options = mri(args)._;
  }

  run(): commandOutput {
    return new commandOutput(
      ExitCode.EXIT_SUCCESS,
      this.options.map((elem) => elem).join(" "),
      null,
    );
  }

  man(): string {
    return `
NAME
      echo - display a line of text

SYNOPSIS
      echo [string]

DESCRIPTION
      Echo the STRING(s) to standard output.

AUTHOR
      Written by TypesafeRusty.
`;
  }
}
