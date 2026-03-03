import mri from "mri";
import { exec } from "../command";
import { commandOutput, ExitCode } from "../commandOutput";

export class man extends exec {
  options: string = "";

  protected parse(args: string[]): void {
    this.options = mri(args)._[0] || "";
  }

  run(args: string[]): commandOutput {
    this.parse(args);

    const command = this.context.commandRegistry.get(this.options);
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
