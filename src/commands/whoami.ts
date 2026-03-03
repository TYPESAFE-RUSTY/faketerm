import { exec } from "../command.js";
import { commandOutput, ExitCode } from "../commandOutput.js";

export class whoami extends exec {
  protected parse(_args: string[]): void {
    // ignore any  args
  }

  completion(_args: string[]): string[] {
    return [];
  }

  run(args: string[]): commandOutput {
    this.parse(args);
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
