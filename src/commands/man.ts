import mri from "mri";
import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";
import { getExec } from "../dispatcher";

export class man extends exec {
  options: string = "";

  parse(args: string[]): void {
    this.options = mri(args)._[0] || "";
  }

  run(): commandOutput {
    const command = getExec(this.options);
    const manEntry = command?.man();
    if (manEntry === "")
      return new commandOutput(
        ExitCode.EXIT_SUCCESS,
        `No man entry for ${this.options} :(`,
      );

    return new commandOutput(ExitCode.EXIT_SUCCESS, manEntry);
  }

  man(): string {
    return ``;
  }
}
