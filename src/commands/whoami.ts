import { exec } from "../command.js";
import { commandOutput, ExitCode } from "../commandOutput.js";

export class whoami extends exec {
  parse(_args: string[]): void {
    // ignore any  args
  }

  run(): commandOutput {
    return new commandOutput(ExitCode.EXIT_SUCCESS, this.context.currentUser);
  }

  man(): string {
    return `
NAME
      whoami - print effective user name

SYNOPSIS
      whoami

DESCRIPTION
      Print the user name associated with the current effective user context.currentUser.

AUTHOR
      Written by TypesafeRusty.

INSPIRATION
      whoami from GNU coreutils.
   `;
  }
}
